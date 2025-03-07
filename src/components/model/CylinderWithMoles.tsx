import { useEffect, useRef, useState } from "react";

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

const Molecule: React.FC<MoleculeProps> = ({ x, y, template, opacity = 1 }) => (
  <g style={{ opacity }}>{template({ x, y })}</g>
);

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

  const [molecules, setMolecules] = useState<MoleculeState[]>([]);
  const [opacity, setOpacity] = useState(1);
  const prevPumpOffsetRef = useRef(0);
  const prevMoleculeCountRef = useRef(0);
  const timeRef = useRef(0);

  const { settings } = useSimulationSettings();
  const { incrementCollision } = useWallCollisions();
  const RELEASE_POINT = { x: 375, y: 800 };
  const CYLINDER_BOUNDS = {
    left: 25,
    right: 375,
    top: 400,
    bottom: 830,
  };

  const currentTopBoundary = CYLINDER_BOUNDS.top + volumePosition;
  const currentVolume =
    (CYLINDER_BOUNDS.bottom - currentTopBoundary) *
    (CYLINDER_BOUNDS.right - CYLINDER_BOUNDS.left);

  const BASE_TEMPERATURE = convertTemperature(temperature, temperatureUnit);

  const calculateAdjustedMoleculeCount = (baseCount: number) => {
    if (settings.moleculeRatio.type === "scaled") {
      return Math.floor(baseCount / settings.moleculeRatio.scale);
    }
    return Math.floor(baseCount);
  };

  const clearMolecules = () => {
    setMolecules([]);
    prevMoleculeCountRef.current = 0;
  };

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

  useEffect(() => {
    setOpacity(isVolumeDragging ? 0.3 : 1);
  }, [isVolumeDragging]);

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

      setMolecules(newMolecules);
      prevMoleculeCountRef.current = moleculeCount;
    }
  }, [moleculeCount, BASE_TEMPERATURE, selectedGases, settings]);

  // Generate new molecules from pump
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

      setMolecules((prev) => [...prev, ...newMolecules]);
    }

    prevPumpOffsetRef.current = pumpOffset;
  }, [pumpOffset, selectedGases, settings, BASE_TEMPERATURE]);

  // Gas Laws Physics Simulation
  useEffect(() => {
    const intervalId = setInterval(() => {
      timeRef.current += 1;

      setMolecules((prev) => {
        const updatedMolecules = [...prev].filter(
          (mol) =>
            !isNaN(mol.x) &&
            !isNaN(mol.y) &&
            !isNaN(mol.velocityX) &&
            !isNaN(mol.velocityY)
        );

        for (let i = 0; i < updatedMolecules.length; i++) {
          for (let j = i + 1; j < updatedMolecules.length; j++) {
            const mol1 = updatedMolecules[i];
            const mol2 = updatedMolecules[j];

            // Check if they are close enough to collide
            const dx = mol2.x - mol1.x;
            const dy = mol2.y - mol1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= mol1.radius + mol2.radius) {
              handleCollision(mol1, mol2);
            }
          }
        }

        const volume = currentVolume;
        const volumeRatio =
          volume /
          ((CYLINDER_BOUNDS.bottom - CYLINDER_BOUNDS.top) *
            (CYLINDER_BOUNDS.right - CYLINDER_BOUNDS.left));

        // More conservative temperature scaling
        const currentTemp = BASE_TEMPERATURE / Math.pow(volumeRatio, 0.3);

        // Reduced velocity scaling for more realistic motion at room temperature
        const baseVelocityScale = 0.5; // Reduce overall velocity magnitude
        const rmsVelocity =
          Math.sqrt((3 * currentTemp) / 100) * baseVelocityScale;

        // Reduce thermal kick amplitude
        const thermalKickScale = 0.05; // Smaller random motion

        // Update positions and handle wall collisions
        updatedMolecules.forEach((molecule) => {
          if (
            isNaN(molecule.x) ||
            isNaN(molecule.y) ||
            isNaN(molecule.velocityX) ||
            isNaN(molecule.velocityY)
          ) {
            return;
          }

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
            Math.sqrt(currentTemp / BASE_TEMPERATURE) * thermalKickScale;
          molecule.velocityX += (Math.random() - 0.5) * thermalKick;
          molecule.velocityY += (Math.random() - 0.5) * thermalKick;

          // More conservative pressure and wall collision handling
          const pressureFactor = Math.min(
            1.2,
            (1 / volumeRatio) * (1 + temperature / 200)
          );

          // Wall collision logic with gentler rebounds
          if (molecule.x - molecule.radius <= CYLINDER_BOUNDS.left) {
            incrementCollision();
            molecule.x = CYLINDER_BOUNDS.left + molecule.radius;
            molecule.velocityX =
              Math.abs(molecule.velocityX) * pressureFactor * 0.8;
          }
          if (molecule.x + molecule.radius >= CYLINDER_BOUNDS.right) {
            incrementCollision();
            molecule.x = CYLINDER_BOUNDS.right - molecule.radius;
            molecule.velocityX =
              -Math.abs(molecule.velocityX) * pressureFactor * 0.8;
          }
          if (molecule.y - molecule.radius <= currentTopBoundary) {
            incrementCollision();
            molecule.y = currentTopBoundary + molecule.radius;
            molecule.velocityY =
              Math.abs(molecule.velocityY) * pressureFactor * 0.8;
          }
          if (molecule.y + molecule.radius >= CYLINDER_BOUNDS.bottom) {
            incrementCollision();
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
              (1 + temperature / 200);
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
        });

        return updatedMolecules;
      });
    }, 16);

    return () => clearInterval(intervalId);
  }, [
    volumePosition,
    currentVolume,
    currentTopBoundary,
    temperature,
    incrementCollision,
  ]);

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
      <g>
        {molecules.map((molecule) => (
          <Molecule
            key={molecule.id}
            x={molecule.x}
            y={molecule.y}
            template={molecule.template}
            opacity={opacity}
            radius={molecule.radius}
            type={molecule.type}
          />
        ))}
      </g>
    </>
  );
};

export default CylinderWithMole;
