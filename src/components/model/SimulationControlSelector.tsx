import React, { useState } from "react";
import {
  Settings2,
  Volume2,
  Thermometer,
  Gauge,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ControlType = "volume" | "temperature" | "pressure" | "pump";
export type ValueType = "initial" | "final";

export interface SimulationControlState {
  volume: ValueType;
  temperature: ValueType;
  pressure: ValueType;
  pump: ValueType;
}

interface SimulationControlSelectorProps {
  gasLaw: string;
  controlState: SimulationControlState;
  onControlStateChange: (
    controlType: ControlType,
    valueType: ValueType
  ) => void;
  className?: string;
}

const CONTROL_CONFIGS = {
  volume: {
    icon: Volume2,
    label: "Volume",
    description: "Container volume control",
    color: "bg-blue-500",
  },
  temperature: {
    icon: Thermometer,
    label: "Temperature",
    description: "System temperature control",
    color: "bg-red-500",
  },
  pressure: {
    icon: Gauge,
    label: "Pressure",
    description: "System pressure control",
    color: "bg-green-500",
  },
  pump: {
    icon: Zap,
    label: "Pump",
    description: "Molecule count control",
    color: "bg-purple-500",
  },
} as const;

const getAvailableControls = (gasLaw: string): ControlType[] => {
  switch (gasLaw) {
    case "boyles":
      return ["volume", "pressure", "pump"];
    case "charles":
      return ["volume", "temperature", "pump"];
    case "gayLussac":
      return ["pressure", "temperature", "pump"];
    case "avogadro":
      return ["volume", "pump"];
    case "combined":
      return ["volume", "temperature", "pressure", "pump"];
    case "ideal":
      return ["volume", "temperature", "pressure", "pump"];
    default:
      return ["volume", "temperature", "pressure", "pump"];
  }
};

const SimulationControlSelector: React.FC<SimulationControlSelectorProps> = ({
  gasLaw,
  controlState,
  onControlStateChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const availableControls = getAvailableControls(gasLaw);

  const handleControlChange = (
    controlType: ControlType,
    valueType: ValueType
  ) => {
    onControlStateChange(controlType, valueType);
  };

  const getControlBadgeText = (controlType: ControlType) => {
    const valueType = controlState[controlType];
    return valueType === "initial" ? "Initial" : "Final";
  };

  const getControlBadgeColor = (controlType: ControlType) => {
    const valueType = controlState[controlType];
    return valueType === "initial"
      ? "bg-blue-100 text-blue-800"
      : "bg-orange-100 text-orange-800";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2 bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white/95 transition-all duration-200",
                className
              )}
            >
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-medium">Control Mode</span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {availableControls.length}
              </span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Configure which values (initial or final) the simulation controls
            will modify
          </p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Simulation Control Mode</h3>
            <p className="text-xs text-muted-foreground">
              Choose whether each control sets initial or final values when you
              interact with the simulation.
            </p>
          </div>

          <div className="space-y-3">
            {availableControls.map((controlType) => {
              const config = CONTROL_CONFIGS[controlType];
              const Icon = config.icon;
              const currentValue = controlState[controlType];

              return (
                <div
                  key={controlType}
                  className="flex flex-col p-3 gap-2 rounded-lg border bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn("p-2 rounded-md text-white", config.color)}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{config.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {config.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        getControlBadgeColor(controlType)
                      )}
                    >
                      {getControlBadgeText(controlType)}
                    </span>
                    <div className="flex rounded-md border overflow-hidden">
                      <Button
                        variant={
                          currentValue === "initial" ? "default" : "ghost"
                        }
                        size="sm"
                        className="h-8 px-3 text-xs rounded-none"
                        onClick={() =>
                          handleControlChange(controlType, "initial")
                        }
                      >
                        Initial
                      </Button>
                      <Button
                        variant={currentValue === "final" ? "default" : "ghost"}
                        size="sm"
                        className="h-8 px-3 text-xs rounded-none"
                        onClick={() =>
                          handleControlChange(controlType, "final")
                        }
                      >
                        Final
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Initial values represent the starting state</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Final values represent the ending state</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SimulationControlSelector;
