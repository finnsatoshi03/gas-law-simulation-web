import { GAS_LAW_CONFIGS, UNITS } from "@/components/model/Parameters";

export interface CalculatedValue {
  target: string;
  value: string;
}

// Unit conversion factors and available units
export interface UnitConverter {
  label: string;
  toBase: number | ((value: number) => number);
}

export interface UnitGroup {
  [key: string]: UnitConverter;
}

export interface UnitTypes {
  pressure: UnitGroup;
  volume: UnitGroup;
  temperature: UnitGroup;
  moles: UnitGroup;
}

export interface Variable {
  id: string;
  label: string;
  group?: string;
  className?: string;
  unitType: keyof typeof UNITS;
  defaultValue?: string;
}

export interface Group {
  id: string;
  label: string;
  variables: string[];
}

export interface GasLawConfig {
  name: string;
  variables: Variable[];
  constants?: Array<{
    id: string;
    label: string;
    unitType: keyof typeof UNITS;
  }>;
  optional?: Array<{
    id: string;
    label: string;
    unitType: keyof typeof UNITS;
  }>;
  groups?: Group[];
}

export interface GasLawInputProps {
  id: string;
  label: string;
  unitType: keyof typeof UNITS;
  value: string;
  selectedUnit: string;
  onValueChange: (id: string, value: string) => void;
  onUnitChange: (id: string, unit: string) => void;
  disabled: boolean;
  isCalculated: boolean;
  defaultValue?: string;
  className?: string;
}

export interface GasLawInputGroupProps {
  lawType: keyof typeof GAS_LAW_CONFIGS;
  values: Record<string, string>;
  units: Record<string, string>;
  disabledFields?: string[];
  onValueChange: (id: string, value: string) => void;
  onUnitChange: (id: string, unit: string) => void;
  className?: string;
}

export type GasLawType =
  | string
  | "boyles"
  | "charles"
  | "gayLussac"
  | "avogadro"
  | "combined"
  | "ideal";
export type VolumeUnit = "L" | "mL" | "m³" | "cm³" | "ft³";
export type PressureUnit = "atm" | "mmHg" | "torr" | "Pa" | "bar" | "kPa";
export type TemperatureUnit = "K" | "C" | "F";

export interface Problem {
  id: string;
  type: string;
  title: string;
  question: string;
  hint: string;
  solution: string;
}
