import { memo, useEffect, useMemo, useRef, useState } from "react";

import { convertTemperature } from "@/lib/helpers";

import { useWallCollisions } from "@/contexts/WallCollissionProvider";
import { useSimulationSettings } from "@/contexts/SettingsProvider";

import { Cylinder } from "./Paths";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MoleculeProps {
  x: number;
  y: number;
  template: ({ x, y }: { x: number; y: number }) => JSX.Element;
  opacity?: number;
  radius: number;
  type: string;
}

interface MoleculeState extends MoleculeProps {
  id: number;
  velocityX: number;
  velocityY: number;
  mass: number;
  energy: number;
}

interface CylinderWithMoleProps {
  pumpOffset?: number;
  volumePosition?: number;
  isVolumeDragging?: boolean;
  temperature: number;
  temperatureUnit?: "K" | "C" | "F";
  moleculeCount?: number;
  selectedGases?: string[];
}

// Fixed geometry — these never change, so keep them module-level so the
// requestAnimationFrame loop can close over them without re-subscribing.
const RELEASE_POINT = { x: 375, y: 800 };
const CYLINDER_BOUNDS = {
  left: 25,
  right: 375,
  top: 400,
  bottom: 830,
};

// Physics step size in milliseconds. The loop advances in fixed steps of this
// size (matching the previous setInterval(16) cadence) so motion stays
// consistent regardless of the display's refresh rate.
const PHYSICS_STEP_MS = 16;
// Cap accumulated time so a backgrounded/janky tab can't trigger a "spiral of
// death" where we try to simulate hundreds of steps in one frame.
const MAX_ACCUMULATED_MS = 200;

// Live physics parameters the loop reads each step. Held in a ref so prop
// changes (volume, temperature) take effect immediately without tearing down
// and recreating the animation loop.
interface PhysicsParams {
  baseTemperature: number;
  currentTopBoundary: number;
  currentVolume: number;
  temperature: number;
  incrementCollision: () => void;
}

const handleCollision = (mol1: MoleculeState, mol2: MoleculeState) => {
  // Calculate collision normal
  const dx = mol2.x - mol1.x;
  const dy = mol2.y - mol1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Prevent division by zero
  if (distance === 0) {
    // If molecules are at exactly the same position, slightly separate them
    mol2.x += 0.1;
    mol2.y += 0.1;
    return;
  }

  // Normalize the collision vector
  const nx = dx / distance;
  const ny = dy / distance;

  // Relative velocity
  const vx = mol2.velocityX - mol1.velocityX;
  const vy = mol2.velocityY - mol1.velocityY;

  // Relative velocity along normal
  const relativeVelocity = vx * nx + vy * ny;

  // Do not resolve collision if particles are moving apart
  if (relativeVelocity > 0) return;

  // Calculate impulse scalar
  const restitution = 1; // Perfectly elastic collision
  const impulseScalar =
    (-(1 + restitution) * relativeVelocity) / (1 / mol1.mass + 1 / mol2.mass);

  // Apply impulse
  const impulseX = impulseScalar * nx;
  const impulseY = impulseScalar * ny;

  // Check for NaN values before applying velocities
  if (!isNaN(impulseX) && !isNaN(impulseY)) {
    mol1.velocityX -= impulseX / mol1.mass;
    mol1.velocityY -= impulseY / mol1.mass;
    mol2.velocityX += impulseX / mol2.mass;
    mol2.velocityY += impulseY / mol2.mass;
  }

  // Separate overlapping molecules
  const overlap = mol1.radius + mol2.radius - distance;
  if (overlap > 0) {
    const separationX = (overlap * nx) / 2;
    const separationY = (overlap * ny) / 2;

    // Check for NaN values before applying position changes
    if (!isNaN(separationX) && !isNaN(separationY)) {
      mol1.x -= separationX;
      mol1.y -= separationY;
      mol2.x += separationX;
      mol2.y += separationY;
    }
  }
};

export const CylinderWithMole: React.FC<CylinderWithMoleProps> = ({
  pumpOffset = 0,
  volumePosition = 0,
  isVolumeDragging = false,
  temperature,
  temperatureUnit = "K",
  moleculeCount = 0,
  selectedGases = ["oxygen"],
}) => {
  const isMobile = useIsMobile();

  // The molecules array is the single source of truth for both physics and
  // rendering. It lives in a ref (not state) so the animation loop can mutate
  // positions every frame WITHOUT triggering a React re-render.
  const moleculesRef = useRef<MoleculeState[]>([]);
  // Bumped only when the SET of molecules changes (add / remove / clear), so
  // React rebuilds the node list just for those events — never for movement.
  const [setVersion, setSetVersion] = useState(0);
  const bumpSetVersion = () => setSetVersion((v) => v + 1);

  // Maps molecule id -> its rendered <g> so the loop can update transforms.
  const nodeRefs = useRef<Map<number, SVGGElement>>(new Map());

  const [opacity, setOpacity] = useState(1);
  const prevPumpOffsetRef = useRef(0);
  const prevMoleculeCountRef = useRef(0);

  const { settings } = useSimulationSettings();
  const { incrementCollision } = useWallCollisions();

  const currentTopBoundary = CYLINDER_BOUNDS.top + volumePosition;
  const currentVolume =
    (CYLINDER_BOUNDS.bottom - currentTopBoundary) *
    (CYLINDER_BOUNDS.right - CYLINDER_BOUNDS.left);

  const BASE_TEMPERATURE = convertTemperature(temperature, temperatureUnit);

  // Keep the loop's live parameters current on every render. Writing to a ref
  // during render is safe and lets the long-lived rAF loop read fresh values.
  const paramsRef = useRef<PhysicsParams>({
    baseTemperature: BASE_TEMPERATURE,
    currentTopBoundary,
    currentVolume,
    temperature,
    incrementCollision,
  });
  paramsRef.current = {
    baseTemperature: BASE_TEMPERATURE,
    currentTopBoundary,
    currentVolume,
    temperature,
    incrementCollision,
  };

  const calculateAdjustedMoleculeCount = (baseCount: number) => {
    if (settings.moleculeRatio.type === "scaled") {
      return Math.floor(baseCount / settings.moleculeRatio.scale);
    }
    return Math.floor(baseCount);
  };

  const clearMolecules = () => {
    moleculesRef.current = [];
    prevMoleculeCountRef.current = 0;
    bumpSetVersion();
  };

  useEffect(() => {
    setOpacity(isVolumeDragging ? 0.3 : 1);
  }, [isVolumeDragging]);

  // (Re)generate the full molecule set when the target count changes.
  useEffect(() => {
    if (
      (prevMoleculeCountRef.current === 0 && moleculeCount > 0) ||
      (prevMoleculeCountRef.current !== moleculeCount && moleculeCount > 0)
    ) {
      const newMolecules: MoleculeState[] = [];

      // Filter molecule types based on selected gases
      const availableMoleculeTypes = settings.moleculeTypes.filter((type) =>
        selectedGases.includes(type.type)
      );

      const boltzmannConstant = 1.380649e-23; // J/K
      const meanSpeed = Math.sqrt(
        (8 * boltzmannConstant * BASE_TEMPERATURE) /
          ((Math.PI *
            availableMoleculeTypes.reduce(
              (max, type) => Math.max(max, type.mass),
              0
            )) /
            1000)
      );

      // Calculate adjusted molecule count based on ratio settings
      const moleculeCountToGenerate =
        calculateAdjustedMoleculeCount(moleculeCount);

      for (let i = 0; i < moleculeCountToGenerate; i++) {
        const moleculeType =
          availableMoleculeTypes[
            Math.floor(Math.random() * availableMoleculeTypes.length)
          ];

        const angle = Math.random() * 2 * Math.PI;
        const speed = meanSpeed * Math.sqrt(-Math.log(1 - Math.random()));

        const newMolecule: MoleculeState = {
          id: Math.random(),
          x: RELEASE_POINT.x,
          y: RELEASE_POINT.y,
          velocityX: speed * Math.cos(angle),
          velocityY: speed * Math.sin(angle),
          template: moleculeType.template,
          radius: moleculeType.radius,
          mass: moleculeType.mass,
          energy: 0.5 * moleculeType.mass * speed * speed,
          type: moleculeType.type,
        };

        newMolecules.push(newMolecule);
      }

      moleculesRef.current = newMolecules;
      prevMoleculeCountRef.current = moleculeCount;
      bumpSetVersion();
    }
  }, [moleculeCount, BASE_TEMPERATURE, selectedGases, settings]);

  // Generate new molecules from the pump on each pump stroke.
  useEffect(() => {
    if (prevPumpOffsetRef.current === 0 && pumpOffset === 0) {
      prevPumpOffsetRef.current = pumpOffset;
      return;
    }

    if (pumpOffset === 0 && prevPumpOffsetRef.current >= -75) {
      const newMolecules: MoleculeState[] = [];

      const availableMoleculeTypes = settings.moleculeTypes.filter((type) =>
        selectedGases.includes(type.type)
      );

      const meanSpeed = Math.sqrt((3 * BASE_TEMPERATURE) / 100);

      // Calculate pump molecule count based on ratio settings
      const pumpMoleculeCount = 5;

      for (let i = 0; i < pumpMoleculeCount; i++) {
        const moleculeType =
          availableMoleculeTypes[
            Math.floor(Math.random() * availableMoleculeTypes.length)
          ];

        const angle = Math.random() * 2 * Math.PI;
        const speed = meanSpeed * (0.5 + Math.random());

        const newMolecule: MoleculeState = {
          id: Math.random(),
          x: RELEASE_POINT.x,
          y: RELEASE_POINT.y,
          velocityX: speed * Math.cos(angle),
          velocityY: speed * Math.sin(angle),
          template: moleculeType.template,
          radius: moleculeType.radius,
          mass: moleculeType.mass,
          energy: 0.5 * moleculeType.mass * speed * speed,
          type: moleculeType.type,
        };

        newMolecules.push(newMolecule);
      }

      moleculesRef.current = [...moleculesRef.current, ...newMolecules];
      bumpSetVersion();
    }

    prevPumpOffsetRef.current = pumpOffset;
  }, [pumpOffset, selectedGases, settings, BASE_TEMPERATURE]);

  // Live re-skin: when the user changes the molecule size, update the visuals
  // (template) and collision radius of molecules ALREADY in the cylinder so the
  // size setting applies immediately instead of only to newly added molecules.
  useEffect(() => {
    if (moleculesRef.current.length === 0) {
      return;
    }

    const typeByName = new Map(
      settings.moleculeTypes.map((type) => [type.type, type])
    );

    let changed = false;
    for (const molecule of moleculesRef.current) {
      const type = typeByName.get(molecule.type);
      if (type && type.radius !== molecule.radius) {
        molecule.template = type.template;
        molecule.radius = type.radius;
        changed = true;
      }
    }

    if (changed) {
      bumpSetVersion();
    }
  }, [settings.moleculeTypes]);

  // Advance the simulation by one fixed physics step, mutating molecules in place.
  const stepPhysics = () => {
    const molecules = moleculesRef.current;
    const {
      baseTemperature,
      currentTopBoundary: topBoundary,
      currentVolume: volume,
      temperature: temp,
      incrementCollision: onCollision,
    } = paramsRef.current;

    // Drop any molecules that have gone non-finite (defensive).
    let hadInvalid = false;
    for (let i = 0; i < molecules.length; i++) {
      const mol = molecules[i];
      if (
        isNaN(mol.x) ||
        isNaN(mol.y) ||
        isNaN(mol.velocityX) ||
        isNaN(mol.velocityY)
      ) {
        hadInvalid = true;
        break;
      }
    }
    if (hadInvalid) {
      moleculesRef.current = molecules.filter(
        (mol) =>
          !isNaN(mol.x) &&
          !isNaN(mol.y) &&
          !isNaN(mol.velocityX) &&
          !isNaN(mol.velocityY)
      );
      // Removing nodes requires a render so their <g> elements unmount.
      bumpSetVersion();
      return;
    }

    // Pairwise collisions
    for (let i = 0; i < molecules.length; i++) {
      for (let j = i + 1; j < molecules.length; j++) {
        const mol1 = molecules[i];
        const mol2 = molecules[j];

        const dx = mol2.x - mol1.x;
        const dy = mol2.y - mol1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= mol1.radius + mol2.radius) {
          handleCollision(mol1, mol2);
        }
      }
    }

    const volumeRatio =
      volume /
      ((CYLINDER_BOUNDS.bottom - CYLINDER_BOUNDS.top) *
        (CYLINDER_BOUNDS.right - CYLINDER_BOUNDS.left));

    // More conservative temperature scaling
    const currentTemp = baseTemperature / Math.pow(volumeRatio, 0.3);

    // Reduced velocity scaling for more realistic motion at room temperature
    const baseVelocityScale = 0.5; // Reduce overall velocity magnitude
    const rmsVelocity =
      Math.sqrt((3 * currentTemp) / 100) * baseVelocityScale;

    // Reduce thermal kick amplitude
    const thermalKickScale = 0.05; // Smaller random motion

    for (let i = 0; i < molecules.length; i++) {
      const molecule = molecules[i];

      // Damped velocity updates
      molecule.x += molecule.velocityX * baseVelocityScale;
      molecule.y += molecule.velocityY * baseVelocityScale;

      const currentSpeed = Math.sqrt(
        molecule.velocityX * molecule.velocityX +
          molecule.velocityY * molecule.velocityY
      );

      if (!isNaN(currentSpeed)) {
        molecule.energy = 0.5 * molecule.mass * currentSpeed * currentSpeed;
      }

      // Significantly reduced thermal motion
      const thermalKick =
        Math.sqrt(currentTemp / baseTemperature) * thermalKickScale;
      molecule.velocityX += (Math.random() - 0.5) * thermalKick;
      molecule.velocityY += (Math.random() - 0.5) * thermalKick;

      // More conservative pressure and wall collision handling
      const pressureFactor = Math.min(
        1.2,
        (1 / volumeRatio) * (1 + temp / 200)
      );

      // Wall collision logic with gentler rebounds
      if (molecule.x - molecule.radius <= CYLINDER_BOUNDS.left) {
        onCollision();
        molecule.x = CYLINDER_BOUNDS.left + molecule.radius;
        molecule.velocityX =
          Math.abs(molecule.velocityX) * pressureFactor * 0.8;
      }
      if (molecule.x + molecule.radius >= CYLINDER_BOUNDS.right) {
        onCollision();
        molecule.x = CYLINDER_BOUNDS.right - molecule.radius;
        molecule.velocityX =
          -Math.abs(molecule.velocityX) * pressureFactor * 0.8;
      }
      if (molecule.y - molecule.radius <= topBoundary) {
        onCollision();
        molecule.y = topBoundary + molecule.radius;
        molecule.velocityY =
          Math.abs(molecule.velocityY) * pressureFactor * 0.8;
      }
      if (molecule.y + molecule.radius >= CYLINDER_BOUNDS.bottom) {
        onCollision();
        molecule.y = CYLINDER_BOUNDS.bottom - molecule.radius;
        molecule.velocityY =
          -Math.abs(molecule.velocityY) * pressureFactor * 0.8;
      }

      // More conservative energy scaling
      if (!isNaN(molecule.energy) && molecule.energy !== 0) {
        const targetEnergy =
          0.5 *
          molecule.mass *
          rmsVelocity *
          rmsVelocity *
          (1 + temp / 200);
        const energyRatio = Math.sqrt(targetEnergy / molecule.energy);

        // Limit energy changes to prevent extreme velocity shifts
        const maxEnergyChange = 1.2;
        const clampedEnergyRatio = Math.min(
          maxEnergyChange,
          Math.max(1 / maxEnergyChange, energyRatio)
        );

        molecule.velocityX *= clampedEnergyRatio;
        molecule.velocityY *= clampedEnergyRatio;
      }
    }
  };

  // The animation loop: requestAnimationFrame with a fixed-timestep accumulator.
  // Runs once for the component's lifetime; reads live params from refs and
  // writes positions straight to the DOM, so it never re-renders React.
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let accumulator = 0;

    const frame = (now: number) => {
      accumulator += now - lastTime;
      lastTime = now;
      if (accumulator > MAX_ACCUMULATED_MS) {
        accumulator = MAX_ACCUMULATED_MS;
      }

      let stepped = false;
      while (accumulator >= PHYSICS_STEP_MS) {
        stepPhysics();
        accumulator -= PHYSICS_STEP_MS;
        stepped = true;
      }

      // Push the new positions to the DOM only when something moved.
      if (stepped) {
        const molecules = moleculesRef.current;
        const nodes = nodeRefs.current;
        for (let i = 0; i < molecules.length; i++) {
          const mol = molecules[i];
          const node = nodes.get(mol.id);
          if (node) {
            node.setAttribute("transform", `translate(${mol.x}, ${mol.y})`);
          }
        }
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
    // Intentionally empty: the loop lives for the component's lifetime and
    // reads all changing values through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build the molecule <g> nodes. Memoized on setVersion so this list is only
  // rebuilt when molecules are added/removed — never for per-frame movement.
  // Parent re-renders (e.g. dragging the pressure slider) reuse this exact
  // element reference, so React skips reconciling the molecule subtree.
  const moleculeNodes = useMemo(
    () => (
      <>
        {moleculesRef.current.map((molecule) => (
          <g
            key={molecule.id}
            ref={(el) => {
              if (el) {
                nodeRefs.current.set(molecule.id, el);
              } else {
                nodeRefs.current.delete(molecule.id);
              }
            }}
            transform={`translate(${molecule.x}, ${molecule.y})`}
          >
            {molecule.template({ x: 0, y: 0 })}
          </g>
        ))}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setVersion]
  );

  return (
    <>
      <Cylinder />
      <Tooltip>
        <TooltipTrigger asChild>
          <foreignObject
            x={isMobile ? "25" : "-120"}
            y={isMobile ? "290" : "800"}
            width="120"
            height="50"
          >
            <Button
              onClick={clearMolecules}
              className="bg-red-500 text-white px-2 py-1 rounded simulation-clear-molecules"
            >
              Clear Molecules
            </Button>
          </foreignObject>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to remove all molecules from the simulation.</p>
        </TooltipContent>
      </Tooltip>
      <g style={{ opacity }}>{moleculeNodes}</g>
    </>
  );
};

// Memoized so re-renders of the parent simulation (e.g. dragging the pressure
// slider, which updates pressure/volume state up the tree) don't re-render the
// molecule subtree. Its props don't change during those interactions.
export default memo(CylinderWithMole);
