/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, RefreshCw } from "lucide-react";
import Draggable, { DraggableEvent } from "react-draggable";

import {
  GasLawConfig,
  GasLawInputGroupProps,
  GasLawInputProps,
  UnitTypes,
} from "@/lib/types";
import { GAS_CONSTANTS } from "@/lib/constants";

import { useGasLaw } from "@/contexts/GasLawProvider";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import CalculationHistoryDrawer from "../CalculationHistory";

const UNITS: UnitTypes = {
  pressure: {
    atm: { label: "atm", toBase: 1 },
    mmHg: { label: "mmHg", toBase: 1 / 760 },
    torr: { label: "torr", toBase: 1 / 760 },
    pascal: { label: "Pa", toBase: 1 / 101325 },
    bar: { label: "bar", toBase: 0.986923 },
    kPa: { label: "kPa", toBase: 1 / 101.325 },
  },
  volume: {
    L: { label: "L", toBase: 1 },
    mL: { label: "mL", toBase: 0.001 },
    m3: { label: "m³", toBase: 1000 },
    cm3: { label: "cm³", toBase: 0.001 },
    ft3: { label: "ft³", toBase: 28.3168 },
  },
  temperature: {
    K: { label: "K", toBase: (t: number) => t },
    C: { label: "°C", toBase: (t: number) => t + 273.15 },
    F: { label: "°F", toBase: (t: number) => ((t - 32) * 5) / 9 + 273.15 },
  },
  moles: {
    mol: { label: "mol", toBase: 1 },
    mmol: { label: "mmol", toBase: 0.001 },
    µmol: { label: "µmol", toBase: 0.000001 },
    nmol: { label: "nmol", toBase: 0.000000001 },
    kmol: { label: "kmol", toBase: 1000 },
  },
};

const GAS_LAW_CONFIGS: Record<string, GasLawConfig> = {
  boyles: {
    name: "Boyle's Law",
    variables: [
      {
        id: "p1",
        label: "Pressure 1",
        unitType: "pressure",
        group: "initial",
        className: "input-pressure-1",
      },
      {
        id: "v1",
        label: "Volume 1",
        unitType: "volume",
        group: "initial",
        className: "input-volume-1",
      },
      {
        id: "p2",
        label: "Pressure 2",
        unitType: "pressure",
        group: "final",
        className: "input-pressure-2",
      },
      {
        id: "v2",
        label: "Volume 2",
        unitType: "volume",
        group: "final",
        className: "input-volume-2",
      },
    ],
    constants: [
      { id: "t", label: "Temperature", unitType: "temperature" },
      { id: "n", label: "Number of Mol (n)", unitType: "moles" },
    ],
    groups: [
      {
        id: "initial-parameters-group",
        label: "Initial Parameters",
        variables: ["v1", "p1"],
      },
      {
        id: "final-parameters-group",
        label: "Final Parameters",
        variables: ["v2", "p2"],
      },
    ],
  },
  charles: {
    name: "Charles's Law",
    variables: [
      { id: "v1", label: "Volume 1", unitType: "volume" },
      { id: "t1", label: "Temperature 1", unitType: "temperature" },
      { id: "v2", label: "Volume 2", unitType: "volume" },
      { id: "t2", label: "Temperature 2", unitType: "temperature" },
    ],
    constants: [
      { id: "p", label: "Pressure", unitType: "pressure" },
      { id: "n", label: "Number of Mol (n)", unitType: "moles" },
    ],
  },
  gayLussac: {
    name: "Gay-Lussac's Law",
    variables: [
      { id: "p1", label: "Pressure 1", unitType: "pressure" },
      { id: "t1", label: "Temperature 1", unitType: "temperature" },
      { id: "p2", label: "Pressure 2", unitType: "pressure" },
      { id: "t2", label: "Temperature 2", unitType: "temperature" },
    ],
    constants: [
      { id: "v", label: "Volume", unitType: "volume" },
      { id: "n", label: "Number of Mol (n)", unitType: "moles" },
    ],
  },
  avogadro: {
    name: "Avogadro's Law",
    variables: [
      { id: "v1", label: "Volume 1", unitType: "volume" },
      { id: "n1", label: "Number of Mol (n) 1", unitType: "moles" },
      { id: "v2", label: "Volume 2", unitType: "volume" },
      { id: "n2", label: "Number of Mol (n) 2", unitType: "moles" },
    ],
    constants: [
      { id: "v", label: "Pressure", unitType: "pressure" },
      { id: "n", label: "Temperature", unitType: "temperature" },
    ],
  },
  combined: {
    name: "Combined Gas Law",
    variables: [
      { id: "p1", label: "Pressure 1", unitType: "pressure" },
      { id: "v1", label: "Volume 1", unitType: "volume" },
      { id: "t1", label: "Temperature 1", unitType: "temperature" },
      { id: "p2", label: "Pressure 2", unitType: "pressure" },
      { id: "v2", label: "Volume 2", unitType: "volume" },
      { id: "t2", label: "Temperature 2", unitType: "temperature" },
    ],
    constants: [{ id: "n", label: "Number of Mol (n)", unitType: "moles" }],
  },
  ideal: {
    name: "Ideal Gas Law",
    variables: [
      { id: "p", label: "Pressure", unitType: "pressure" },
      { id: "v", label: "Volume", unitType: "volume" },
      { id: "n", label: "Number of Mol (n)", unitType: "moles" },
      { id: "t", label: "Temperature", unitType: "temperature" },
    ],
    constants: [],
  },
};

const convertValue = (
  value: string,
  fromUnit: string,
  toUnit: string,
  unitType: keyof typeof UNITS
): string => {
  if (!value || isNaN(parseFloat(value))) return value;

  const numValue = parseFloat(value);
  const fromConverter = UNITS[unitType][fromUnit];
  const toConverter = UNITS[unitType][toUnit];

  if (!fromConverter || !toConverter) return value;

  // Convert to base unit first
  let baseValue: number;
  if (typeof fromConverter.toBase === "function") {
    baseValue = fromConverter.toBase(numValue);
  } else {
    baseValue = numValue * (fromConverter.toBase as number);
  }

  // Convert from base unit to target unit
  let finalValue: number;
  if (typeof toConverter.toBase === "function") {
    // Handle special case for temperature
    if (unitType === "temperature") {
      if (toUnit === "C") finalValue = baseValue - 273.15;
      else if (toUnit === "F") finalValue = ((baseValue - 273.15) * 9) / 5 + 32;
      else finalValue = baseValue;
    } else {
      finalValue = baseValue;
    }
  } else {
    finalValue = baseValue / (toConverter.toBase as number);
  }

  return finalValue.toFixed(4);
};

const GasLawInput: React.FC<
  GasLawInputProps & { result?: { target?: string; value?: string } }
> = ({
  id,
  label,
  unitType,
  value,
  selectedUnit,
  onValueChange,
  onUnitChange,
  disabled,
  isCalculated,
  result,
  defaultValue,
  className,
}) => {
  const availableUnits = UNITS[unitType];

  const getTooltipContent = () => {
    switch (unitType) {
      case "pressure":
        return `Pressure measurements (${Object.values(availableUnits)
          .map((u) => u.label)
          .join(", ")})`;
      case "volume":
        return `Volume measurements (${Object.values(availableUnits)
          .map((u) => u.label)
          .join(", ")})`;
      case "temperature":
        return `Temperature measurements (${Object.values(availableUnits)
          .map((u) => u.label)
          .join(", ")})`;
      case "moles":
        return `Amount of substance (${Object.values(availableUnits)
          .map((u) => u.label)
          .join(", ")})`;
      default:
        return `Enter a value for ${label}`;
    }
  };

  return (
    <div className={`space-y-1 sm:space-y-2 ${className}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Label
            htmlFor={id}
            className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 cursor-help"
          >
            {label}
            {result?.target === id && (
              <span className="text-xs text-blue-500 text-muted-foreground">
                (Calculated)
              </span>
            )}
            {disabled && (
              <span className="text-xs text-muted-foreground">(Fixed)</span>
            )}
          </Label>
        </TooltipTrigger>
        <TooltipContent>{getTooltipContent()}</TooltipContent>
      </Tooltip>
      <div className="flex gap-1 sm:gap-2 w-full max-w-72">
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              id={id}
              type="number"
              step="any"
              defaultValue={defaultValue}
              value={result?.target === id ? result.value : value}
              onChange={(e) => onValueChange(id, e.target.value)}
              className={`flex-1 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3 ${
                isCalculated ? "bg-muted text-blue-500" : ""
              } ${className}`}
              placeholder={`Enter ${label.toLowerCase()}`}
              disabled={disabled}
            />
          </TooltipTrigger>
          <TooltipContent>
            {result?.target === id
              ? "This value is calculated automatically"
              : `Enter a value for ${label}`}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-20 sm:w-28 input-unit-pressure-1-selector">
              <Select
                value={selectedUnit}
                onValueChange={(value) => onUnitChange(id, value)}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="input-unit-pressure-1-selector-content text-xs sm:text-sm">
                  {Object.entries(availableUnits).map(
                    ([unit, { label: unitLabel }]) => (
                      <SelectItem key={unit} value={unit}>
                        {unitLabel}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>Select unit of measurement</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

const GasLawInputGroup: React.FC<GasLawInputGroupProps> = ({
  lawType,
  values,
  units,
  disabledFields = [],
  onValueChange,
  onUnitChange,
  className,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const { result, calculateResult, clearResult } = useGasLaw();

  const config = GAS_LAW_CONFIGS[lawType];

  useEffect(() => {
    calculateResult(lawType, values, units);
  }, [lawType, values, units]);

  const handleValueChange = (id: string, value: string) => {
    let newValue = value;

    if (id === "t" || id === "t1" || id === "t2") {
      const unit = units[id];
      let maxTemp = 600;

      if (unit === "C") {
        maxTemp = 600 - 273.15;
      } else if (unit === "F") {
        maxTemp = ((600 - 273.15) * 9) / 5 + 32;
      }

      if (parseFloat(value) > maxTemp) {
        newValue = maxTemp.toString();
      }
    }

    if (result?.target === id) {
      clearResult();
    }
    if (result?.moles && lawType === "ideal") {
      onValueChange("n", result.moles);
    }
    onValueChange(id, newValue);
  };

  const handleUnitChange = (id: string, newUnit: string) => {
    const variable =
      config.variables.find((v) => v.id === id) ||
      config.constants?.find((c) => c.id === id);
    if (!variable) return;

    const oldUnit = units[id];
    const currentValue = values[id];
    const convertedValue = convertValue(
      currentValue,
      oldUnit,
      newUnit,
      variable.unitType
    );

    // Update both the unit and the converted value for the variable
    onUnitChange(id, newUnit);
    onValueChange(id, convertedValue);

    // Find related variables that might need unit synchronization
    const relatedVariables = config.variables.filter(
      (v) => v.unitType === variable.unitType && v.id !== id
    );

    // Update related variables with the same unit conversion
    relatedVariables.forEach((relatedVar) => {
      const relatedValue = values[relatedVar.id];
      const relatedOldUnit = units[relatedVar.id];

      if (!disabledFields.includes(relatedVar.id)) {
        const synchronizedValue = convertValue(
          relatedValue,
          relatedOldUnit,
          newUnit,
          variable.unitType
        );

        onUnitChange(relatedVar.id, newUnit);
        onValueChange(relatedVar.id, synchronizedValue);
      }
    });
  };

  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleDragStart = (e: DraggableEvent) => {
    // Check if the click target is an input, select, or button
    const isInteractiveElement = (e.target as HTMLElement).closest(
      "input, select, button, .select-trigger"
    );
    if (isInteractiveElement) {
      e.stopPropagation();
      return false;
    }
    // Only allow dragging from the grip handle
    const isDragHandle = (e.target as HTMLElement).closest(".drag-handle");
    if (!isDragHandle) {
      return false;
    }
  };

  const renderConstants = () => {
    if (lawType === "ideal") {
      const pressureUnit = units["p"] || "atm";
      const constant =
        GAS_CONSTANTS[pressureUnit as keyof typeof GAS_CONSTANTS];

      return (
        <div className="grid gap-2 mt-6 pt-4 border-t">
          <div className="font-medium text-sm">Constants</div>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label className="text-sm font-normal flex items-center gap-2 cursor-help">
                  - R = {constant.value} {constant.unit}
                </Label>
              </TooltipTrigger>
              <TooltipContent>
                Universal gas constant (R) in current pressure units
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      );
    }

    const config = GAS_LAW_CONFIGS[lawType];
    if (config.constants && config.constants.length > 0) {
      return (
        <div className="grid gap-2 mt-6 pt-4 border-t">
          <div className="font-medium text-sm">Constants</div>
          {config.constants.map((constant) => (
            <div key={constant.id} className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor={constant.id}
                    className="text-sm font-normal flex items-center gap-2 cursor-help"
                  >
                    - {constant.label}
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  {constant.unitType === "temperature"
                    ? "Temperature is held constant in this law"
                    : constant.unitType === "pressure"
                    ? "Pressure is held constant in this law"
                    : constant.unitType === "volume"
                    ? "Volume is held constant in this law"
                    : constant.unitType === "moles"
                    ? "Amount of substance is held constant in this law"
                    : `${constant.label} is constant in this law`}
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderInputGroup = () => {
    // If no groups are defined, render all variables
    if (!config.groups) {
      return (
        <div className="grid gap-2 no-drag">
          <div className="flex w-full justify-between items-center">
            <div className="font-medium text-sm mb-2">Variables</div>
            <CalculationHistoryDrawer lawType={lawType} />
          </div>
          {config.variables.map((variable) => (
            <div key={variable.id} className="space-y-2">
              <GasLawInput
                id={variable.id}
                label={variable.label}
                unitType={variable.unitType}
                value={values[variable.id]}
                selectedUnit={units[variable.id]}
                onValueChange={handleValueChange}
                onUnitChange={handleUnitChange}
                disabled={disabledFields.includes(variable.id)}
                result={result ?? undefined}
                defaultValue={variable.defaultValue}
                className={variable.className}
                isCalculated={result?.target === variable.id}
              />
            </div>
          ))}
        </div>
      );
    }

    // If groups are defined, render variables by groups
    return (
      <div className="grid gap-2 no-drag note-initial-final-difference">
        <div className="flex w-full justify-between items-center">
          <div className="font-medium text-sm mb-2">Variables</div>
          <CalculationHistoryDrawer lawType={lawType} />
        </div>
        {config.groups.map((group) => (
          <div
            key={group.id}
            className={`parameter-group ${group.id} space-y-2`}
          >
            {config.variables
              .filter((variable) =>
                group.variables ? group.variables.includes(variable.id) : true
              )
              .map((variable) => (
                <div key={variable.id} className="space-y-2">
                  <GasLawInput
                    id={variable.id}
                    label={variable.label}
                    unitType={variable.unitType}
                    value={values[variable.id]}
                    selectedUnit={units[variable.id]}
                    onValueChange={handleValueChange}
                    onUnitChange={handleUnitChange}
                    disabled={disabledFields.includes(variable.id)}
                    result={result ?? undefined}
                    defaultValue={variable.defaultValue}
                    className={variable.className}
                    isCalculated={result?.target === variable.id}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onDrag={handleDrag}
      handle=".drag-handle"
      onStart={handleDragStart}
      cancel=".no-drag"
    >
      <div
        ref={nodeRef}
        className={cn(
          "space-y-4 p-2 sm:p-4 bg-sidebar rounded-lg border border-sidebar-border shadow-md w-full mx-auto",
          className
        )}
        style={{
          width: "320px",
          maxWidth: "100%",
        }}
      >
        <div className="flex justify-between items-center gap-2 sm:gap-8">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <GripVertical className="size-4 text-muted-foreground drag-handle cursor-grab active:cursor-grabbing" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Drag to move parameter</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="flex h-fit w-fit p-0 items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  {isMinimized ? (
                    <ChevronDown className="size-3 sm:size-4" />
                  ) : (
                    <ChevronUp className="size-3 sm:size-4" />
                  )}
                  {isMinimized ? "Show Parameters" : "Minimize"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isMinimized
                    ? "Expand parameter panel"
                    : "Collapse parameter panel"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  Object.keys(values).forEach((key) => {
                    if (!disabledFields.includes(key)) {
                      onValueChange(
                        key,
                        lawType === "boyles" && key === "t" ? "275" : ""
                      );
                    }
                  });
                  clearResult();
                }}
                className="reset-button flex items-center gap-1 sm:gap-2 p-0 w-fit h-fit no-drag text-xs sm:text-sm"
              >
                <RefreshCw className="size-3" />
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset all values to default</TooltipContent>
          </Tooltip>
        </div>

        {!isMinimized && (
          <>
            {renderInputGroup()}
            {renderConstants()}
          </>
        )}
      </div>
    </Draggable>
  );
};

export { GAS_LAW_CONFIGS, GasLawInput, GasLawInputGroup, UNITS };
export type { UnitTypes };
export default GasLawInputGroup;
