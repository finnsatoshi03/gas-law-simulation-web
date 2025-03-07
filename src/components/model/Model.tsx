import { useState, useRef, useEffect } from "react";
import { Pause, Play } from "lucide-react";

import "@/styles/model.css";

import { PressureUnit, VolumeUnit } from "@/lib/types";
import { pressureConversions, volumeConversions } from "@/lib/helpers";

import { useSimulationSettings } from "@/contexts/SettingsProvider";

import {
  AirPump,
  Barometer,
  CarbonDioxide,
  HandPump,
  Nitrogen,
  Oxygen,
  Thermometer,
  Volume,
} from "./Paths";
import { LinearGradients } from "./LinearGradients";
import CylinderWithMole from "./CylinderWithMoles";
import TemperatureSlider from "./TemperatureSlider";
import BarometerSlider from "./BarometerSlider";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Define types for type safety
type GasLaw =
  | "boyles"
  | "charles"
  | "gayLussac"
  | "avogadro"
  | "combined"
  | "ideal";

export interface Props {
  gasLaw: GasLaw;
  initialVolume?: number;
  finalVolume?: number;
  initialTemperature?: number;
  finalTemperature?: number;
  initialPressure?: number;
  finalPressure?: number;
  volumeUnit?: VolumeUnit;
  pressureUnit?: PressureUnit;
  moleculeCount?: number;
  temperatureUnit?: "K" | "C" | "F";
  onVolumeChange?: (volume: number) => void;
  onPressureChange?: (pressure: number) => void;
  onTemperatureChange?: (temperature: number) => void;
  onMoleculeCountChange?: (count: number) => void;
  className?: string;
}

const GasLawsSimulation: React.FC<Props> = ({
  gasLaw,
  initialVolume = 0,
  finalVolume = 0,
  volumeUnit = "L",
  moleculeCount = 0,
  initialTemperature,
  finalTemperature,
  initialPressure = 0,
  finalPressure = 0,
  pressureUnit = "atm",
  temperatureUnit,
  onVolumeChange,
  onPressureChange,
  onTemperatureChange,
  onMoleculeCountChange,
  className,
}) => {
  const { settings } = useSimulationSettings();
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserControlling, setIsUserControlling] = useState(false);

  const [isPumpDragging, setIsPumpDragging] = useState(false);
  const [pumpStartY, setPumpStartY] = useState(0);
  const [pumpOffset, setPumpOffset] = useState(0);
  const [temperature, setTemperature] = useState(295);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const [volumeStartY, setVolumeStartY] = useState(0);
  const [volumePosition, setVolumePosition] = useState(0);
  const [selectedGases, setSelectedGases] = useState<string[]>(["oxygen"]);

  const [currentPressure, setCurrentPressure] = useState(initialPressure);
  const [animatingVolume, setAnimatingVolume] = useState(false);

  const [barometerAngle, setBarometerAngle] = useState(0);
  const [handShake, setHandShake] = useState(0);

  const [pumpMoleculeCount, setPumpMoleculeCount] = useState(0);
  const lastPumpActionTime = useRef(Date.now());
  const PUMP_COOLDOWN = 300;

  const animationFrameRef = useRef<number | null>(null);
  const pressureAnimationRef = useRef<number | null>(null);

  // Convert initial and final volumes to standard liters
  const convertedInitialVolume = initialVolume * volumeConversions[volumeUnit];
  const convertedFinalVolume = finalVolume * volumeConversions[volumeUnit];
  const convertedInitialPressure =
    initialPressure * pressureConversions[pressureUnit];
  const convertedFinalPressure =
    finalPressure * pressureConversions[pressureUnit];

  const lastPumpPosition = useRef(0);
  const isPumpingDown = useRef(false);

  const canControlPump = ![""].includes(gasLaw);
  const canControlVolume = !["gayLussac"].includes(gasLaw);
  const canControlTemperature = !["boyles", "avogadro"].includes(gasLaw);

  // Constants remain unchanged
  const MAX_PUMP_MOVEMENT = 80;
  const MIN_VOLUME_POSITION = 0;
  const MAX_VOLUME_POSITION = 350;
  // const PRESSURE_DECAY_RATE = 0.5;
  const MAX_BAROMETER_ANGLE = 300;
  const MAX_SIMULATION_VOLUME = settings.maxSimulationVolume;
  const MAX_MOLECULE_COUNT = 500;
  const MIN_MOLECULE_COUNT = 0;

  const constrainedMoleculeCount = Math.max(
    MIN_MOLECULE_COUNT,
    Math.min(MAX_MOLECULE_COUNT, moleculeCount)
  );

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setIsUserControlling(false);
  };

  // Handle both mouse and touch events for pump
  const handlePumpMouseDown = (e: React.MouseEvent) => {
    if (!canControlPump) return;
    e.preventDefault();
    setIsPumpDragging(true);
    setPumpStartY(e.clientY - pumpOffset);
    lastPumpPosition.current = pumpOffset;
  };

  const handlePumpTouchStart = (e: React.TouchEvent) => {
    if (!canControlPump) return;
    e.preventDefault();
    setIsPumpDragging(true);
    setPumpStartY(e.touches[0].clientY - pumpOffset);
    lastPumpPosition.current = pumpOffset;
  };

  // Volume event handlers
  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    if (!canControlVolume) return;
    e.preventDefault();
    setIsUserControlling(true);
    setIsVolumeDragging(true);
    setVolumeStartY(e.clientY);
  };

  const handleVolumeTouchStart = (e: React.TouchEvent) => {
    if (!canControlVolume) return;
    e.preventDefault();
    setIsUserControlling(true);
    setIsVolumeDragging(true);
    setVolumeStartY(e.touches[0].clientY);
  };

  const handlePumpRelease = () => {
    const currentTime = Date.now();
    if (currentTime - lastPumpActionTime.current >= PUMP_COOLDOWN) {
      const newMoleculeCount =
        pumpMoleculeCount + 5 * settings.moleculeRatio.scale; // Add 5 molecules per pump
      setPumpMoleculeCount(newMoleculeCount);
      onMoleculeCountChange?.(newMoleculeCount);
      lastPumpActionTime.current = currentTime;
    }
  };

  const toggleGasSelection = (gas: string) => {
    setSelectedGases((prev) => {
      if (prev.includes(gas)) {
        if (prev.length === 1) return prev;
        return prev.filter((g) => g !== gas);
      }
      return prev.length < 3 ? [...prev, gas] : prev;
    });
  };

  const getGasOpacity = (gas: string) => {
    return selectedGases.includes(gas) ? 1 : 0.3;
  };

  // Calculate initial volume position
  const calculateVolumePosition = (volume: number) => {
    // Ensure volume is non-negative
    const safeVolume = Math.max(0, volume);

    // Invert the position calculation:
    // - When volume is 0, position should be MAX_VOLUME_POSITION (350)
    // - When volume is MAX_SIMULATION_VOLUME, position should be MIN_VOLUME_POSITION (0)
    const position =
      MAX_VOLUME_POSITION -
      (safeVolume / MAX_SIMULATION_VOLUME) * MAX_VOLUME_POSITION;

    // Constrain position to valid range
    return Math.min(
      MAX_VOLUME_POSITION,
      Math.max(MIN_VOLUME_POSITION, position)
    );
  };

  const calculateVolumeFromPosition = (position: number) => {
    // Invert the volume calculation from position
    const volumePercentage =
      (MAX_VOLUME_POSITION - position) / MAX_VOLUME_POSITION;
    const volume = volumePercentage * MAX_SIMULATION_VOLUME;
    return Math.max(0, Math.min(MAX_SIMULATION_VOLUME, volume));
  };

  const pressureToSliderValue = (p: number) => {
    return (p / settings.maxDisplayPressure) * 100;
  };

  // Convert slider value to pressure
  const sliderValueToPressure = (value: number) => {
    return (value / 100) * settings.maxDisplayPressure;
  };

  // Calculate barometer angle from pressure
  const calculateBarometerAngle = (pressure: number) => {
    const maxDisplayPressure = settings.maxDisplayPressure;
    const normalizedPressure = Math.min(pressure, maxDisplayPressure);

    const angle =
      (normalizedPressure / maxDisplayPressure) * MAX_BAROMETER_ANGLE;

    return Math.min(MAX_BAROMETER_ANGLE, Math.max(0, angle));
  };

  // Handle slider change
  const handleSliderChange = (value: number) => {
    setIsUserControlling(true);
    const newPressure = Math.min(
      sliderValueToPressure(value),
      settings.maxDisplayPressure
    );
    setCurrentPressure(newPressure);
    setBarometerAngle(calculateBarometerAngle(newPressure));
    onPressureChange?.(newPressure);
  };

  const sliderValue = pressureToSliderValue(
    Math.min(currentPressure, settings.maxDisplayPressure)
  );

  useEffect(() => {
    const shakeInterval = setInterval(() => {
      const maxShake = Math.min((constrainedMoleculeCount / 500) * 10, 10); // Increase the multiplier to 10
      const newShake = Math.sin(Date.now() * 0.1) * maxShake; // Increase the frequency multiplier to 0.1
      setHandShake(newShake);
    }, 50);

    return () => clearInterval(shakeInterval);
  }, [constrainedMoleculeCount]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pressureAnimationRef.current) {
        cancelAnimationFrame(pressureAnimationRef.current);
      }
      return;
    }

    // Volume animation
    if (convertedInitialVolume !== convertedFinalVolume) {
      setAnimatingVolume(true);
      const startPosition = calculateVolumePosition(convertedInitialVolume);
      const endPosition = calculateVolumePosition(convertedFinalVolume);
      const duration = 2000;
      const startTime = performance.now();

      const animateVolume = (currentTime: number) => {
        if (!isPlaying) {
          setAnimatingVolume(false);
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress =
          progress < 0.5
            ? 4 * progress ** 3
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const newPosition =
          startPosition + (endPosition - startPosition) * easedProgress;
        setVolumePosition(newPosition);

        if (progress < 1 && isPlaying) {
          animationFrameRef.current = requestAnimationFrame(animateVolume);
        } else {
          setVolumePosition(endPosition);
          setAnimatingVolume(false);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateVolume);
    }

    // Pressure animation
    const clampedInitialPressure = Math.min(
      convertedInitialPressure,
      settings.maxDisplayPressure
    );
    const clampedFinalPressure = Math.min(
      convertedFinalPressure,
      settings.maxDisplayPressure
    );
    const startAngle = calculateBarometerAngle(clampedInitialPressure);
    const endAngle = calculateBarometerAngle(clampedFinalPressure);
    const duration = 2000;
    const startTime = performance.now();

    const animatePressure = (currentTime: number) => {
      if (!isPlaying) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const smoothStep = progress * progress * (3 - 2 * progress);
      const newAngle = startAngle + (endAngle - startAngle) * smoothStep;
      const animatedPressure = Math.min(
        clampedInitialPressure +
          (clampedFinalPressure - clampedInitialPressure) * smoothStep,
        settings.maxDisplayPressure
      );

      setCurrentPressure(animatedPressure);
      setBarometerAngle(newAngle);

      if (progress < 1 && isPlaying) {
        pressureAnimationRef.current = requestAnimationFrame(animatePressure);
      }
    };

    pressureAnimationRef.current = requestAnimationFrame(animatePressure);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pressureAnimationRef.current) {
        cancelAnimationFrame(pressureAnimationRef.current);
      }
    };
  }, [
    isPlaying,
    convertedInitialVolume,
    convertedFinalVolume,
    convertedInitialPressure,
    convertedFinalPressure,
  ]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pressureAnimationRef.current) {
        cancelAnimationFrame(pressureAnimationRef.current);
      }
      return;
    }

    if (isUserControlling) return;

    if (pressureAnimationRef.current) {
      cancelAnimationFrame(pressureAnimationRef.current);
      pressureAnimationRef.current = null;
    }

    // Clamp initial and final pressures to maximum display pressure
    const clampedInitialPressure = Math.min(
      convertedInitialPressure,
      settings.maxDisplayPressure
    );
    const clampedFinalPressure = Math.min(
      convertedFinalPressure,
      settings.maxDisplayPressure
    );

    const startAngle = calculateBarometerAngle(clampedInitialPressure);
    const endAngle = calculateBarometerAngle(clampedFinalPressure);

    if (Math.abs(startAngle - endAngle) < 0.1) {
      setBarometerAngle(endAngle);
      setCurrentPressure(clampedFinalPressure);
      return;
    }

    const duration = 2000;
    const startTime = performance.now();

    const animatePressure = (currentTime: number) => {
      if (isUserControlling) {
        if (pressureAnimationRef.current) {
          cancelAnimationFrame(pressureAnimationRef.current);
          pressureAnimationRef.current = null;
        }
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const smoothStep = progress * progress * (3 - 2 * progress);
      const newAngle = startAngle + (endAngle - startAngle) * smoothStep;

      // Calculate and clamp the animated pressure
      const animatedPressure = Math.min(
        clampedInitialPressure +
          (clampedFinalPressure - clampedInitialPressure) * smoothStep,
        settings.maxDisplayPressure
      );

      setCurrentPressure(animatedPressure);
      setBarometerAngle(newAngle);

      if (progress < 1) {
        pressureAnimationRef.current = requestAnimationFrame(animatePressure);
      } else {
        setBarometerAngle(endAngle);
        setCurrentPressure(clampedFinalPressure);
        pressureAnimationRef.current = null;
      }
    };

    pressureAnimationRef.current = requestAnimationFrame(animatePressure);

    return () => {
      if (pressureAnimationRef.current) {
        cancelAnimationFrame(pressureAnimationRef.current);
        pressureAnimationRef.current = null;
      }
    };
  }, [
    isPlaying,
    convertedInitialPressure,
    convertedFinalPressure,
    isUserControlling,
    settings.maxDisplayPressure,
  ]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isPumpDragging) {
        setPumpOffset(0);
        lastPumpPosition.current = 0;
        isPumpingDown.current = false;
        handlePumpRelease();
      }
      setIsPumpDragging(false);
      setIsVolumeDragging(false);
      setIsUserControlling(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPumpDragging && canControlPump) {
        const currentY = e.clientY;
        const newOffset = currentY - pumpStartY;
        const constrainedOffset = Math.max(
          -MAX_PUMP_MOVEMENT,
          Math.min(0, newOffset)
        );
        setPumpOffset(constrainedOffset);
      }

      if (isVolumeDragging && canControlVolume) {
        const deltaY = e.clientY - volumeStartY;
        setVolumePosition((prev) => {
          const newPosition = Math.max(
            MIN_VOLUME_POSITION,
            Math.min(MAX_VOLUME_POSITION, prev + deltaY)
          );

          // Calculate and emit the new volume
          const newVolume = calculateVolumeFromPosition(newPosition);
          onVolumeChange?.(newVolume);

          return newPosition;
        });
        setVolumeStartY(e.clientY);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    isPumpDragging,
    isVolumeDragging,
    pumpStartY,
    volumeStartY,
    canControlPump,
    canControlVolume,
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPumpDragging && canControlPump) {
        const newOffset = e.clientY - pumpStartY;
        const constrainedOffset = Math.max(
          -MAX_PUMP_MOVEMENT,
          Math.min(0, newOffset)
        );
        setPumpOffset(constrainedOffset);
      }

      if (isVolumeDragging && canControlVolume) {
        const deltaY = e.clientY - volumeStartY;
        setVolumePosition((prev) => {
          const newPosition = Math.max(
            MIN_VOLUME_POSITION,
            Math.min(MAX_VOLUME_POSITION, prev + deltaY)
          );
          const newVolume = calculateVolumeFromPosition(newPosition);
          onVolumeChange?.(newVolume);
          return newPosition;
        });
        setVolumeStartY(e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isPumpDragging && canControlPump) {
        const newOffset = e.touches[0].clientY - pumpStartY;
        const constrainedOffset = Math.max(
          -MAX_PUMP_MOVEMENT,
          Math.min(0, newOffset)
        );
        setPumpOffset(constrainedOffset);
      }

      if (isVolumeDragging && canControlVolume) {
        const deltaY = e.touches[0].clientY - volumeStartY;
        setVolumePosition((prev) => {
          const newPosition = Math.max(
            MIN_VOLUME_POSITION,
            Math.min(MAX_VOLUME_POSITION, prev + deltaY)
          );
          const newVolume = calculateVolumeFromPosition(newPosition);
          onVolumeChange?.(newVolume);
          return newPosition;
        });
        setVolumeStartY(e.touches[0].clientY);
      }
    };

    // Common end handlers
    const handleEnd = () => {
      if (isPumpDragging) {
        setPumpOffset(0);
        lastPumpPosition.current = 0;
        isPumpingDown.current = false;
        handlePumpRelease();
      }
      setIsPumpDragging(false);
      setIsVolumeDragging(false);
      setIsUserControlling(false);
    };

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [
    isPumpDragging,
    isVolumeDragging,
    pumpStartY,
    volumeStartY,
    canControlPump,
    canControlVolume,
  ]);

  useEffect(() => {
    setPumpMoleculeCount(moleculeCount);
  }, [moleculeCount]);

  useEffect(() => {
    if (!isUserControlling) {
      setCurrentPressure(finalPressure || initialPressure);
    }
  }, [finalPressure, initialPressure, isUserControlling]);

  const pumpCursor = !canControlPump
    ? "not-allowed"
    : isPumpDragging
    ? "grabbing"
    : "grab";
  const volumeCursor = !canControlVolume
    ? "not-allowed"
    : isVolumeDragging
    ? "grabbing"
    : animatingVolume
    ? "wait"
    : "grab";

  return (
    <div
      className={cn(
        `boyles-simulation relative h-[90vh] w-full select-none`,
        className
      )}
    >
      <svg
        viewBox="0 0 783.9 890.8"
        className="w-full h-full"
        transform={isMobile ? "translate(0, -100)" : undefined}
      >
        <defs>
          <LinearGradients />
          <linearGradient
            id="temperatureGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "#0000FF" }} />
            <stop offset="50%" style={{ stopColor: "#FFFFFF" }} />
            <stop offset="100%" style={{ stopColor: "#FF0000" }} />
          </linearGradient>
        </defs>

        <g id="SVGRepo_iconCarrier" transform="translate(0, -100)">
          <g className="simulation-gas-tanks">
            <Tooltip>
              <TooltipTrigger asChild>
                <g
                  id="Nitrogen"
                  onClick={() => toggleGasSelection("nitrogen")}
                  style={{
                    cursor: "pointer",
                    opacity: getGasOpacity("nitrogen"),
                  }}
                >
                  <Nitrogen />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Nitrogen (N₂) gas - Click to select/deselect nitrogen for the
                  simulation
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <g
                  id="CarbonDioxide"
                  onClick={() => toggleGasSelection("carbonDioxide")}
                  style={{
                    cursor: "pointer",
                    opacity: getGasOpacity("carbonDioxide"),
                  }}
                >
                  <CarbonDioxide />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Carbon Dioxide (CO₂) gas - Click to select/deselect carbon
                  dioxide for the simulation
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <g
                  id="Oxygen"
                  onClick={() => toggleGasSelection("oxygen")}
                  style={{
                    cursor: "pointer",
                    opacity: getGasOpacity("oxygen"),
                  }}
                >
                  <Oxygen />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Oxygen (O₂) gas - Click to select/deselect oxygen for the
                  simulation
                </p>
              </TooltipContent>
            </Tooltip>
          </g>

          <Tooltip>
            <TooltipTrigger asChild>
              <g id="AirPump" className="simulation-air-pump">
                <AirPump />
                <g
                  id="HandPump"
                  transform={`translate(0,${pumpOffset})`}
                  style={{ cursor: pumpCursor }}
                  onMouseDown={handlePumpMouseDown}
                  onTouchStart={handlePumpTouchStart}
                >
                  <HandPump />
                </g>
                <polygon
                  className="cls-20"
                  points="477.2 660.7 507.5 660.7 507.5 650.6 477.2 650.6 477.2 660.7"
                />
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Air pump - Drag the handle up and down to add gas molecules to
                the system
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <g id="Barometer" className="simulation-barometer">
                <Barometer />
                <path
                  id="Hand"
                  className="cls-28"
                  transform={`rotate(${
                    barometerAngle + handShake
                  }, 451.09, 440.5)`}
                  d="m437.39,468.06l21.4-36.4c.57-.95.2-2.24-.88-2.76l-2.25-1.09c-.99-.48-2.19-.07-2.67.92l-17.36,38.37c-.35,1.17,1.14,2,1.75.97Z"
                />
                <circle className="cls-17" cx="451.1" cy="440.5" r="4.3" />
                <path
                  className="cls-20"
                  d="m401.6,439.4c0,4.6.6,9,1.8,13.3h-37.4v-27.3h37.6c-1.3,4.4-2,9.1-2,14Z"
                />
                <circle className="cls-18" cx="451.2" cy="439.2" r="44.7" />
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Barometer - Measures pressure in the system. Use the slider on
                the right to adjust pressure directly
              </p>
            </TooltipContent>
          </Tooltip>
        </g>
        <Tooltip>
          <TooltipTrigger asChild>
            <foreignObject x="500" y="265" width="50" height="150">
              <div className="h-full flex items-center justify-center simulation-barometer-slider">
                <BarometerSlider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  disabled={gasLaw === "charles" || gasLaw === "avogadro"}
                />
              </div>
            </foreignObject>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Pressure slider - Drag up or down to adjust the system pressure
              directly
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Cylinder */}
        <g
          id="Cylinder"
          transform="translate(0, -100)"
          className="simulation-cylinder"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <foreignObject
                x={isMobile ? "25" : "-32"}
                y={isMobile ? "250" : "760"}
                width="50"
                height="50"
              >
                <Button
                  onClick={togglePlayPause}
                  className={`simulation-play-pause ${
                    !isPlaying
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white p-2 transition-colors`}
                  aria-label={isPlaying ? "Pause animation" : "Play animation"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
              </foreignObject>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isPlaying
                  ? "Pause molecular motion animation"
                  : "Start molecular motion animation to visualize gas behavior"}
              </p>
            </TooltipContent>
          </Tooltip>

          <CylinderWithMole
            pumpOffset={pumpOffset}
            volumePosition={volumePosition}
            isVolumeDragging={isVolumeDragging}
            temperature={temperature}
            temperatureUnit={temperatureUnit}
            moleculeCount={constrainedMoleculeCount}
            selectedGases={selectedGases}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <g
                id="Volume"
                transform={`translate(0,${volumePosition})`}
                style={{ cursor: volumeCursor }}
                onMouseDown={handleVolumeMouseDown}
                onTouchStart={handleVolumeTouchStart}
              >
                <Volume />
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Volume control - Drag upward to decrease volume or downward to
                increase the container volume
              </p>
            </TooltipContent>
          </Tooltip>
          <path
            className="cls-14"
            d="m172.7,370s-119.1,3.4-146.5,26.9c-3.8,3.6-9.1,8.7.8,16.9,11.2,6.1,29.3,21,157.4,26.1,23.4.6,68,.5,119.2-6.6,26.5-4.3,59.4-9.9,73.3-23.4,2.1-5.3,13.4-17.3-66.4-32.7-49-6.1-68.2-6.8-78.6-7.1"
          />
        </g>
        <Tooltip>
          <TooltipTrigger asChild>
            <g
              id="Thermometer"
              transform="translate(0, -100)"
              className="simulation-thermometer"
            >
              <Thermometer
                temperature={temperature}
                unit={temperatureUnit}
                initialTemperature={initialTemperature}
                finalTemperature={finalTemperature}
              />
            </g>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Thermometer - Shows the system temperature. Use the slider to
              adjust temperature
            </p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <TemperatureSlider
              temperature={temperature}
              setTemperature={(temp) => {
                setTemperature(temp);
                onTemperatureChange?.(temp);
              }}
              unit={temperatureUnit || "K"}
              disabled={!canControlTemperature}
              className="simulation-temperature-slider"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Temperature slider - Drag left or right to adjust the system
              temperature
            </p>
          </TooltipContent>
        </Tooltip>
      </svg>
    </div>
  );
};

export default GasLawsSimulation;
