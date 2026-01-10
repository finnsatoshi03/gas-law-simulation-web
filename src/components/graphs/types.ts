import { GasLawType } from "@/lib/types";

export type GraphMode =
  | "P_vs_V" // Pressure vs Volume (Boyle's Law, Ideal Gas)
  | "V_vs_T" // Volume vs Temperature (Charles' Law, Ideal Gas)
  | "P_vs_T" // Pressure vs Temperature (Gay-Lussac's Law, Ideal Gas)
  | "V_vs_n" // Volume vs Moles (Avogadro's Law)
  | "combined"; // Combined Gas Law (dynamic based on isolation)

export type AxisVariable = "P" | "V" | "T" | "n";

export interface AxisConfig {
  variable: AxisVariable;
  label: string;
  fullName: string;
  unit: string;
}

export interface GraphDataPoint {
  x: number;
  y: number;
  isCurrentState?: boolean;
}

export interface GasLawGraphConfig {
  lawType: GasLawType;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  curveType: "inverse" | "linear";
  constantLabel?: string;
  constantValue?: number;
  constantUnit?: string;
}

export interface GraphState {
  currentPoint: { x: number; y: number } | null;
  constant: number;
  dataPoints: GraphDataPoint[];
}

// Variable metadata for axis labels
export const VARIABLE_INFO: Record<
  AxisVariable,
  { symbol: string; fullName: string }
> = {
  P: { symbol: "P", fullName: "Pressure" },
  V: { symbol: "V", fullName: "Volume" },
  T: { symbol: "T", fullName: "Temperature" },
  n: { symbol: "n", fullName: "Amount of Substance" },
};

// Unit display names
export const UNIT_DISPLAY: Record<string, string> = {
  atm: "atm",
  kPa: "kPa",
  Pa: "Pa",
  mmHg: "mmHg",
  torr: "torr",
  bar: "bar",
  L: "L",
  mL: "mL",
  m3: "m³",
  cm3: "cm³",
  ft3: "ft³",
  K: "K",
  C: "°C",
  F: "°F",
  mol: "mol",
  mmol: "mmol",
  µmol: "µmol",
};

export interface GasLawGraphProps {
  lawType: GasLawType;
  values: Record<string, string>;
  units: Record<string, string>;
  result?: {
    target: string;
    value: string;
  } | null;
  graphMode?: GraphMode;
  className?: string;
}

export interface SolutionTriggerProps {
  isVisible: boolean;
  onShowSolution: () => void;
  lawType: GasLawType;
  className?: string;
}

export interface SolutionPanelProps {
  lawType: GasLawType;
  values: Record<string, string>;
  units: Record<string, string>;
  result: {
    target: string;
    value: string;
  };
  isOpen: boolean;
  onClose: () => void;
}
