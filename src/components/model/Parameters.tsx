/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, RefreshCw } from "lucide-react";
import Draggable, { DraggableEvent } from "react-draggable";

import {
  GasLawConfig,
  GasLawInputProps,
  GasLawInputGroupProps,
  UnitTypes,
} from "@/lib/types";
import { cn } from "@/lib/utils";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "../ui/button";
import CalculationHistoryDrawer from "../CalculationHistory";
import { useIsMobile } from "@/hooks/use-mobile";

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
  GasLawInputProps & {
    result?: { target?: string; value?: string; originalUnit?: string };
  }
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
  const isMobile = useIsMobile();
  const availableUnits = UNITS[unitType];

  // Helper function to get the display value for calculated fields
  const getDisplayValue = () => {
    if (result?.target === id && result.value) {
      // Get the original unit the result was calculated in
      const originalUnit = result.originalUnit || selectedUnit;
      const currentUnit = selectedUnit;

      // If the units are different, convert the result value
      if (originalUnit !== currentUnit) {
        return convertValue(result.value, originalUnit, currentUnit, unitType);
      }
      return result.value;
    }
    return value;
  };

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
                {isMobile ? "(Calc)" : "(Calculated)"}
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
              value={getDisplayValue()}
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
            <div className="w-14 sm:w-28 input-unit-pressure-1-selector">
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
  onControlStateChange,
  controlState,
}) => {
  const isMobile = useIsMobile();
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);
  const nodeRef = useRef(null);

  const { result, calculateResult, clearResult } = useGasLaw();

  const config = GAS_LAW_CONFIGS[lawType];

  // Helper function to map variable ID to control type
  const mapVariableToControlType = (varId: string) => {
    if (varId.startsWith("v")) return "volume" as const;
    if (varId.startsWith("t")) return "temperature" as const;
    if (varId.startsWith("p")) return "pressure" as const;
    if (varId.startsWith("n")) return "pump" as const;
    return null;
  };

  // Helper function to determine if a variable is initial or final
  const getValueType = (varId: string): "initial" | "final" => {
    // Variables ending with 1 are initial, 2 are final
    // For ideal gas law, all variables are considered as having a single state
    if (lawType === "ideal") return "initial";
    return varId.endsWith("1") ? "initial" : "final";
  };

  // Sync control state when result changes
  useEffect(() => {
    // Only update if we have both a result and the onControlStateChange function
    if (result?.target && onControlStateChange && controlState) {
      const controlType = mapVariableToControlType(result.target);
      if (controlType) {
        // If the calculated value is for an initial parameter, set control to final and vice versa
        const calculatedValueType = getValueType(result.target);
        const oppositeValueType =
          calculatedValueType === "initial" ? "final" : "initial";

        // Only update if the current control state is different
        if (controlState[controlType] !== oppositeValueType) {
          onControlStateChange(controlType, oppositeValueType);
        }
      }
    }
  }, [result, onControlStateChange, controlState]);

  useEffect(() => {
    // Define required count based on gas law type
    const requiredCountMap = {
      boyles: 3, // Need 3 out of 4 variables (p1, v1, p2, v2)
      charles: 3, // Need 3 out of 4 variables (v1, t1, v2, t2)
      gayLussac: 3, // Need 3 out of 4 variables (p1, t1, p2, t2)
      avogadro: 3, // Need 3 out of 4 variables (v1, n1, v2, n2)
      combined: 5, // Need 5 out of 6 variables (p1, v1, t1, p2, v2, t2)
      ideal: 3, // Need 3 out of 4 variables (p, v, n, t)
    } as const;

    // Count filled variables that are part of the calculation (not constants)
    const filledVariables = config.variables.filter(
      (v) => !disabledFields.includes(v.id) && values[v.id]?.trim() !== ""
    ).length;

    // Use the required count for the current law type or default to variables.length - 1
    const requiredCount =
      lawType in requiredCountMap
        ? requiredCountMap[lawType as keyof typeof requiredCountMap]
        : config.variables.length - 1;

    if (filledVariables >= requiredCount) {
      calculateResult(lawType, values, units);
    } else if (result) {
      // Clear result if we don't have enough filled variables
      clearResult();
    }
  }, [
    lawType,
    values,
    units,
    calculateResult,
    clearResult,
    result,
    config.variables,
    disabledFields,
  ]);

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
      const isCalculatedField = result?.target === relatedVar.id;

      // Synchronize units for all related variables, including calculated ones
      if (!disabledFields.includes(relatedVar.id) || isCalculatedField) {
        // Always update the unit first
        onUnitChange(relatedVar.id, newUnit);

        // For calculated fields, we need to handle unit conversion differently
        if (isCalculatedField) {
          // The calculated field's display value will be handled by the component render
          // We just need to ensure the unit is updated
        } else {
          // For non-calculated fields, convert and update the value
          const synchronizedValue = convertValue(
            relatedValue,
            relatedOldUnit,
            newUnit,
            variable.unitType
          );
          onValueChange(relatedVar.id, synchronizedValue);
        }
      }
    });

    // Only clear result if we change units for a non-calculated field
    // For calculated fields, the display value will be converted automatically
    if (
      result?.target !== id &&
      !relatedVariables.some((v) => result?.target === v.id)
    ) {
      // If this unit change affects variables that might be used in calculation,
      // clear result to trigger recalculation
      const hasFilledRelatedVariables = relatedVariables.some(
        (relatedVar) =>
          values[relatedVar.id] && values[relatedVar.id].trim() !== ""
      );

      if (hasFilledRelatedVariables) {
        setTimeout(() => {
          clearResult();
        }, 10);
      }
    }
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
        <div className="grid gap-2 mt-6 pt-4 border-t text-xs md:text-sm">
          <div className="font-medium">Constants</div>
          <div className="space-y-1 md:space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label className="font-normal text-xs md:text-sm flex items-center cursor-help">
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
        <div className="grid gap-2 mt-6 pt-4 border-t text-xs md:text-sm">
          <div className="font-medium">Constants</div>
          {config.constants.map((constant) => (
            <div key={constant.id} className="md:space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor={constant.id}
                    className="font-normal text-xs md:text-sm flex items-center gap-0 cursor-help"
                  >
                    - {constant.label}
                  </Label>
                </TooltipTrigger>
                <TooltipContent className="text-xs md:text-sm">
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
        <div
          className={cn(
            "grid gap-2 no-drag",
            isHorizontalLayout && "grid-cols-2"
          )}
        >
          <div
            className={cn(
              "flex w-full justify-between items-center",
              isHorizontalLayout && "col-span-2"
            )}
          >
            <div className="font-medium text-xs  md:text-sm mb-2">
              Variables
            </div>
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
      <div
        className={cn(
          "grid gap-2 no-drag note-initial-final-difference",
          isHorizontalLayout && "grid-cols-2"
        )}
      >
        <div
          className={cn(
            "flex w-full justify-between items-center",
            isHorizontalLayout && "col-span-2"
          )}
        >
          <div className="font-medium text-xs md:text-sm mb-2">Variables</div>
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
          "space-y-4 p-2 sm:p-4 bg-zinc-100 rounded-lg border border-sidebar-border shadow-md max-w-full mx-auto",
          className
        )}
        style={{
          width: isHorizontalLayout
            ? isMobile
              ? "350px"
              : "550px"
            : isMobile
            ? "250px"
            : "320px",
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-1 no-drag">
              <Switch
                id="layout-mode"
                checked={isHorizontalLayout}
                onCheckedChange={setIsHorizontalLayout}
                className="data-[state=checked]:bg-blue-500"
              />
              <Label
                htmlFor="layout-mode"
                className="text-xs sm:text-sm cursor-pointer"
              >
                {isHorizontalLayout ? "Horizontal" : "Vertical"}
              </Label>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <CalculationHistoryDrawer lawType={lawType} />

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
