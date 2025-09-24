import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { GAS_LAWS } from "@/lib/constants";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExitDialog } from "@/components/ExitDialog";
import { Button } from "@/components/ui/button";
import { AccessibilityButton } from "@/components/AccessibilityButton";
import { useWalkthrough } from "@/contexts/WalkthroughProvider";
import TourResumeDialog from "@/components/TourResumeDialog";

interface MoleculeType {
  type: string;
  template: ({ x, y }: { x: number; y: number }) => JSX.Element;
  radius: number;
  mass: number;
}

interface Molecule {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  template: ({ x, y }: { x: number; y: number }) => JSX.Element;
  radius: number;
  mass: number;
  energy: number;
  type: string;
}

interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const moleculeTypes: MoleculeType[] = [
  {
    type: "oxygen",
    template: ({ x, y }) => (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={10} fill="#f87171" />
        <circle r={7} fill="#fca5a5" cx={-14} cy={-9} />
        <circle r={7} fill="#fca5a5" cx={14} cy={-9} />
      </g>
    ),
    radius: 18,
    mass: 32,
  },
  {
    type: "carbonDioxide",
    template: ({ x, y }) => (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={10} fill="#4ade80" />
        <circle r={8} fill="#86efac" cx={-16} cy={0} />
        <circle r={8} fill="#86efac" cx={16} cy={0} />
      </g>
    ),
    radius: 22,
    mass: 44,
  },
  {
    type: "nitrogen",
    template: ({ x, y }) => (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={9} fill="#a78bfa" />
        <circle r={9} fill="#c4b5fd" cx={0} cy={-15} />
      </g>
    ),
    radius: 20,
    mass: 28,
  },
];

const CONTAINER_PADDING = 30;
const BASE_TEMPERATURE = 293;

export default function Home() {
  const navigate = useNavigate();
  const {
    setState,
    getStoredProgress,
    startTour,
    getRouteForStep,
    state: { steps },
  } = useWalkthrough();

  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [storedProgress, setStoredProgress] = useState<{
    stepIndex: number;
    timestamp: number;
  } | null>(null);
  const [isTouching, setIsTouching] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);

  const activeLaw = GAS_LAWS[activeIndex];

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    const generateInitialMolecules = (): Molecule[] => {
      const bounds: Bounds = {
        left: CONTAINER_PADDING,
        right: containerSize.width - CONTAINER_PADDING,
        top: CONTAINER_PADDING,
        bottom: containerSize.height - CONTAINER_PADDING,
      };

      const newMolecules: Molecule[] = [];

      const oxygenCount = 10;
      const carbonDioxideCount = 10;
      const nitrogenCount = 10;

      const createMolecule = (type: string): Molecule => {
        const moleculeType = moleculeTypes.find(
          (m) => m.type === type
        ) as MoleculeType;
        const radius = moleculeType.radius;

        const x =
          Math.random() * (bounds.right - bounds.left - radius * 2) +
          bounds.left +
          radius;
        const y =
          Math.random() * (bounds.bottom - bounds.top - radius * 2) +
          bounds.top +
          radius;

        const meanSpeed = Math.sqrt((3 * BASE_TEMPERATURE) / 100);
        const angle = Math.random() * 2 * Math.PI;
        const speed = meanSpeed * Math.sqrt(-Math.log(1 - Math.random()));

        return {
          id: Math.random(),
          x,
          y,
          velocityX: speed * Math.cos(angle) * 0.5,
          velocityY: speed * Math.sin(angle) * 0.5,
          template: moleculeType.template,
          radius,
          mass: moleculeType.mass,
          energy: 0.5 * moleculeType.mass * speed * speed,
          type,
        };
      };

      for (let i = 0; i < oxygenCount; i++) {
        newMolecules.push(createMolecule("oxygen"));
      }

      for (let i = 0; i < carbonDioxideCount; i++) {
        newMolecules.push(createMolecule("carbonDioxide"));
      }

      for (let i = 0; i < nitrogenCount; i++) {
        newMolecules.push(createMolecule("nitrogen"));
      }

      return newMolecules;
    };

    setMolecules(generateInitialMolecules());

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerSize]);

  const handleStartTour = () => {
    const progress = getStoredProgress();
    if (progress && progress.stepIndex > 0) {
      setStoredProgress(progress);
      setShowResumeDialog(true);
    } else {
      startTour(true); // Force restart for fresh start
    }
  };

  const handleResumeTour = () => {
    setShowResumeDialog(false);
    if (storedProgress) {
      // Get the correct route for this step
      const targetRoute = getRouteForStep(storedProgress.stepIndex);
      console.log(
        `Resuming tour at step ${storedProgress.stepIndex}, target route: ${targetRoute}`
      );

      // Navigate to the correct page first
      if (targetRoute !== "/home") {
        navigate(targetRoute);
        // Wait for navigation, then start tour
        setTimeout(() => {
          setState({
            run: true,
            tourActive: true,
            stepIndex: storedProgress.stepIndex,
          });
        }, 300);
      } else {
        // Already on home page, start immediately
        setTimeout(() => {
          setState({
            run: true,
            tourActive: true,
            stepIndex: storedProgress.stepIndex,
          });
        }, 100);
      }
    }
  };

  const handleRestartTour = () => {
    setShowResumeDialog(false);
    startTour(true); // Force restart
  };

  const handleCancelTour = () => {
    setShowResumeDialog(false);
    setStoredProgress(null);
  };

  const handleCollision = (mol1: Molecule, mol2: Molecule): void => {
    const dx = mol2.x - mol1.x;
    const dy = mol2.y - mol1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
      mol2.x += 0.1;
      mol2.y += 0.1;
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;

    const vx = mol2.velocityX - mol1.velocityX;
    const vy = mol2.velocityY - mol1.velocityY;

    const relativeVelocity = vx * nx + vy * ny;

    if (relativeVelocity > 0) return;

    const restitution = 1;
    const impulseScalar =
      (-(1 + restitution) * relativeVelocity) / (1 / mol1.mass + 1 / mol2.mass);

    const impulseX = impulseScalar * nx;
    const impulseY = impulseScalar * ny;

    if (!isNaN(impulseX) && !isNaN(impulseY)) {
      mol1.velocityX -= impulseX / mol1.mass;
      mol1.velocityY -= impulseY / mol1.mass;
      mol2.velocityX += impulseX / mol2.mass;
      mol2.velocityY += impulseY / mol2.mass;
    }

    const overlap = mol1.radius + mol2.radius - distance;
    if (overlap > 0) {
      const separationX = (overlap * nx) / 2;
      const separationY = (overlap * ny) / 2;

      if (!isNaN(separationX) && !isNaN(separationY)) {
        mol1.x -= separationX;
        mol1.y -= separationY;
        mol2.x += separationX;
        mol2.y += separationY;
      }
    }
  };

  useEffect(() => {
    if (molecules.length === 0 || containerSize.width === 0) return;

    const updateMolecules = () => {
      timeRef.current += 1;

      setMolecules((prevMolecules) => {
        const updatedMolecules = [...prevMolecules].filter(
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

            const dx = mol2.x - mol1.x;
            const dy = mol2.y - mol1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= mol1.radius + mol2.radius) {
              handleCollision(mol1, mol2);
            }
          }
        }

        const baseVelocityScale = 0.5;
        const rmsVelocity =
          Math.sqrt((3 * BASE_TEMPERATURE) / 100) * baseVelocityScale;

        const thermalKickScale = 0.05;

        const bounds: Bounds = {
          left: CONTAINER_PADDING,
          right: containerSize.width - CONTAINER_PADDING,
          top: CONTAINER_PADDING,
          bottom: containerSize.height - CONTAINER_PADDING,
        };

        updatedMolecules.forEach((molecule) => {
          if (
            isNaN(molecule.x) ||
            isNaN(molecule.y) ||
            isNaN(molecule.velocityX) ||
            isNaN(molecule.velocityY)
          ) {
            return;
          }

          molecule.x += molecule.velocityX * baseVelocityScale;
          molecule.y += molecule.velocityY * baseVelocityScale;

          const currentSpeed = Math.sqrt(
            molecule.velocityX * molecule.velocityX +
              molecule.velocityY * molecule.velocityY
          );

          if (!isNaN(currentSpeed)) {
            molecule.energy = 0.5 * molecule.mass * currentSpeed * currentSpeed;
          }

          const thermalKick = thermalKickScale;
          molecule.velocityX += (Math.random() - 0.5) * thermalKick;
          molecule.velocityY += (Math.random() - 0.5) * thermalKick;

          const pressureFactor = 0.8;

          if (molecule.x - molecule.radius <= bounds.left) {
            molecule.x = bounds.left + molecule.radius;
            molecule.velocityX = Math.abs(molecule.velocityX) * pressureFactor;
          }

          if (molecule.x + molecule.radius >= bounds.right) {
            molecule.x = bounds.right - molecule.radius;
            molecule.velocityX = -Math.abs(molecule.velocityX) * pressureFactor;
          }

          if (molecule.y - molecule.radius <= bounds.top) {
            molecule.y = bounds.top + molecule.radius;
            molecule.velocityY = Math.abs(molecule.velocityY) * pressureFactor;
          }

          if (molecule.y + molecule.radius >= bounds.bottom) {
            molecule.y = bounds.bottom - molecule.radius;
            molecule.velocityY = -Math.abs(molecule.velocityY) * pressureFactor;
          }

          if (!isNaN(molecule.energy) && molecule.energy !== 0) {
            const targetEnergy =
              0.5 * molecule.mass * rmsVelocity * rmsVelocity;
            const energyRatio = Math.sqrt(targetEnergy / molecule.energy);

            const maxEnergyChange = 1.1;
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

      animationRef.current = requestAnimationFrame(updateMolecules);
    };

    animationRef.current = requestAnimationFrame(updateMolecules);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [molecules.length, containerSize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev === 0 ? GAS_LAWS.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === GAS_LAWS.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left
        setActiveIndex((prev) => (prev === GAS_LAWS.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe right
        setActiveIndex((prev) => (prev === 0 ? GAS_LAWS.length - 1 : prev - 1));
      }
      setIsTouching(false);
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  const handleCloseApp = () => {
    const storedPreference = localStorage.getItem("exitWithoutConfirm");

    if (storedPreference === "true") {
      closeApp();
    } else {
      setIsAlertOpen(true);
    }
  };

  const closeApp = () => {
    if (rememberChoice) {
      localStorage.setItem("exitWithoutConfirm", "true");
    }
    window.close();
  };

  return (
    <div
      className="walkthrough-home w-full h-screen bg-gradient-to-b from-blue-900 to-black overflow-hidden flex items-center justify-center"
      id="home-walkthrough"
      ref={containerRef}
    >
      <div
        className="relative"
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
      >
        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          <rect
            x={CONTAINER_PADDING - 10}
            y={CONTAINER_PADDING - 10}
            width={containerSize.width - 2 * CONTAINER_PADDING + 20}
            height={containerSize.height - 2 * CONTAINER_PADDING + 20}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10,5"
            rx="8"
          />

          {molecules.map((molecule) => {
            const MoleculeTemplate = moleculeTypes.find(
              (m) => m.type === molecule.type
            )?.template;
            return MoleculeTemplate ? (
              <MoleculeTemplate
                key={molecule.id}
                x={molecule.x}
                y={molecule.y}
              />
            ) : null;
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 z-10 space-y-2">
          <h1 className="text-5xl md:text-7xl uppercase font-sciFi text-center font-black">
            Gas Law
            <br />
            Simulation
          </h1>
          <p className="text-center text-sm md:text-base">
            Explore the fascinating behavior of gas molecules under different
            condition
          </p>
          <div>
            <div
              className={`absolute inset-0 bg-gradient-to-br ${activeLaw.bgColor} opacity-30 transition-all duration-500`}
            />

            {/* CHANGE RESPONSIVENESS WHEN DEPLOYED ON WEB! */}
            <div
              className="relative w-[80vw] h-md:w-[70vw] flex justify-center items-center h-64 h-md:h-96 mb-8"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-center justify-center relative w-full md:w-[70vw]">
                {GAS_LAWS.map((law, index) => {
                  const isActive = index === activeIndex;
                  // Calculate position based on distance from active index
                  const position = index - activeIndex;
                  const translateX =
                    position * (window.innerHeight < 768 ? 120 : 200);
                  return (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            key={law.id}
                            to={isActive ? law.link : ""}
                            className={`absolute w-32 h-md:w-56 h-44 h-md:h-72 rounded-xl overflow-hidden shadow-lg transition-all duration-500 ease-out cursor-pointer
                      ${
                        isActive
                          ? "z-20 ring-4 ring-white"
                          : "z-10 opacity-70 hover:opacity-90"
                      }`}
                            style={{
                              transform: `translateX(${translateX}px) scale(${
                                isActive ? 1.2 : 0.8
                              })`,
                            }}
                            onClick={() => setActiveIndex(index)}
                          >
                            <div
                              className={`w-full h-full bg-gradient-to-br ${law.bgColor} flex flex-col items-center justify-between p-3 relative`}
                            >
                              {/* Image overlay */}
                              {law.image && (
                                <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                                  <img
                                    src={law.image}
                                    alt={law.contributor}
                                    className="w-full h-full object-cover pointer-events-none"
                                  />
                                </div>
                              )}

                              <div className="text-center z-10">
                                <h3 className="text-xs md:text-sm font-bold text-white">
                                  {law.name}
                                </h3>
                                <p className="text-xs text-white/80">
                                  {law.year}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        {isActive && (
                          <TooltipContent>
                            <div className="p-2">
                              <h3 className="text-sm font-bold">{law.name}</h3>
                              <p className="text-xs">{law.description}</p>
                              <p className="text-xs mt-1">
                                <strong>Contributor:</strong> {law.contributor}
                              </p>
                              <p className="text-xs">
                                <strong>Year:</strong> {law.year}
                              </p>
                              <p className="text-xs">
                                <strong>Formula:</strong> {law.formula}
                              </p>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
              {/* Navigation arrows */}
              <button
                className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-30"
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === 0 ? GAS_LAWS.length - 1 : prev - 1
                  )
                }
              >
                <ChevronLeft className="text-white" />
              </button>
              <button
                className="absolute right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-30"
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === GAS_LAWS.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <ChevronRight className="text-white" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              className="home-tour-start w-32 md:w-56 md:block hidden z-10 bg-green-600 hover:bg-green-500"
              onClick={handleStartTour}
            >
              Start Guide
            </Button>
            <Button className="w-32 md:w-56 z-10">
              <Link to="/settings">Settings</Link>
            </Button>
            <Button
              className="w-32 md:w-56 z-10 hidden"
              variant="destructive"
              onClick={handleCloseApp}
            >
              Exit
            </Button>
          </div>
        </div>
      </div>

      <ExitDialog
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        rememberChoice={rememberChoice}
        setRememberChoice={setRememberChoice}
        closeApp={closeApp}
      />

      <TourResumeDialog
        isOpen={showResumeDialog}
        onResume={handleResumeTour}
        onRestart={handleRestartTour}
        onCancel={handleCancelTour}
        stepIndex={storedProgress?.stepIndex || 0}
        totalSteps={steps.length}
        timestamp={storedProgress?.timestamp || Date.now()}
      />

      <AccessibilityButton />
    </div>
  );
}
