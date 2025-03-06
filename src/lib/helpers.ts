import { GasLawType, PressureUnit, VolumeUnit } from "./types";

interface VariableInfo {
  symbol: string;
  fullName: string;
  description?: string;
}

export const convertTemperature = (
  temp: number,
  unit: "K" | "C" | "F"
): number => {
  switch (unit) {
    case "C":
      return temp + 273.15; // Convert Celsius to Kelvin
    case "F":
      return ((temp + 459.67) * 5) / 9; // Convert Fahrenheit to Kelvin
    case "K":
    default:
      return temp;
  }
};

export const volumeConversions: Record<VolumeUnit, number> = {
  L: 1,
  mL: 0.001,
  "m³": 1000,
  "cm³": 0.001,
  "ft³": 28.32,
};

export const pressureConversions: Record<PressureUnit, number> = {
  atm: 1,
  mmHg: 0.00131579, // 1 atm = 760 mmHg
  torr: 0.00131579, // torr is equivalent to mmHg
  Pa: 0.0000098692, // 1 atm = 101325 Pa
  bar: 0.986923, // 1 atm ≈ 1.01325 bar
  kPa: 0.0986923, // 1 atm ≈ 101.325 kPa
};

export const temperatureConversions: Record<string, (temp: number) => number> =
  {
    C: (temp) => temp, // Celsius stays the same
    F: (temp) => ((temp - 32) * 5) / 9, // Fahrenheit to Celsius
    K: (temp) => temp - 273.15, // Kelvin to Celsius
  };

export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  conversionTable: Record<string, number>
): number {
  if (fromUnit === toUnit) return value;

  const baseValue = value * (1 / (conversionTable[fromUnit] || 1));
  return baseValue * (conversionTable[toUnit] || 1);
}

export const getVariableDetails = (
  lawType: GasLawType,
  variableId: string
): VariableInfo => {
  const commonVariables: Record<string, VariableInfo> = {
    p: {
      symbol: "P",
      fullName: "Pressure",
      description: "Total pressure of the system",
    },
    v: {
      symbol: "V",
      fullName: "Volume",
      description: "Total volume of the system",
    },
    t: {
      symbol: "T",
      fullName: "Temperature",
      description: "Absolute temperature",
    },
    n: {
      symbol: "n",
      fullName: "Number of Moles",
      description: "Amount of substance",
    },
  };

  const specificMappings: Record<GasLawType, Record<string, VariableInfo>> = {
    boyles: {
      p1: {
        symbol: "P₁",
        fullName: "Initial Pressure",
        description: "Pressure at initial state",
      },
      v1: {
        symbol: "V₁",
        fullName: "Initial Volume",
        description: "Volume at initial state",
      },
      p2: {
        symbol: "P₂",
        fullName: "Final Pressure",
        description: "Pressure at final state",
      },
      v2: {
        symbol: "V₂",
        fullName: "Final Volume",
        description: "Volume at final state",
      },
    },
    charles: {
      v1: {
        symbol: "V₁",
        fullName: "Initial Volume",
        description: "Volume at initial temperature",
      },
      t1: {
        symbol: "T₁",
        fullName: "Initial Temperature",
        description: "Initial absolute temperature",
      },
      v2: {
        symbol: "V₂",
        fullName: "Final Volume",
        description: "Volume at final temperature",
      },
      t2: {
        symbol: "T₂",
        fullName: "Final Temperature",
        description: "Final absolute temperature",
      },
    },
    gayLussac: {
      p1: {
        symbol: "P₁",
        fullName: "Initial Pressure",
        description: "Pressure at initial temperature",
      },
      t1: {
        symbol: "T₁",
        fullName: "Initial Temperature",
        description: "Initial absolute temperature",
      },
      p2: {
        symbol: "P₂",
        fullName: "Final Pressure",
        description: "Pressure at final temperature",
      },
      t2: {
        symbol: "T₂",
        fullName: "Final Temperature",
        description: "Final absolute temperature",
      },
    },
    avogadro: {
      v1: {
        symbol: "V₁",
        fullName: "Initial Volume",
        description: "Volume at initial number of moles",
      },
      n1: {
        symbol: "n₁",
        fullName: "Initial Number of Moles",
        description: "Initial amount of substance",
      },
      v2: {
        symbol: "V₂",
        fullName: "Final Volume",
        description: "Volume at final number of moles",
      },
      n2: {
        symbol: "n₂",
        fullName: "Final Number of Moles",
        description: "Final amount of substance",
      },
    },
    combined: {
      p1: {
        symbol: "P₁",
        fullName: "Initial Pressure",
        description: "Pressure at initial state",
      },
      v1: {
        symbol: "V₁",
        fullName: "Initial Volume",
        description: "Volume at initial state",
      },
      t1: {
        symbol: "T₁",
        fullName: "Initial Temperature",
        description: "Initial absolute temperature",
      },
      p2: {
        symbol: "P₂",
        fullName: "Final Pressure",
        description: "Pressure at final state",
      },
      v2: {
        symbol: "V₂",
        fullName: "Final Volume",
        description: "Volume at final state",
      },
      t2: {
        symbol: "T₂",
        fullName: "Final Temperature",
        description: "Final absolute temperature",
      },
    },
    ideal: {
      p: {
        symbol: "P",
        fullName: "Pressure",
        description: "Total pressure of the system",
      },
      v: {
        symbol: "V",
        fullName: "Volume",
        description: "Total volume of the system",
      },
      n: {
        symbol: "n",
        fullName: "Number of Moles",
        description: "Amount of substance",
      },
      t: {
        symbol: "T",
        fullName: "Temperature",
        description: "Absolute temperature",
      },
    },
  };

  // First check specific mappings for the law type
  if (specificMappings[lawType] && specificMappings[lawType][variableId]) {
    return specificMappings[lawType][variableId];
  }

  // Then check common variables
  if (commonVariables[variableId]) {
    return commonVariables[variableId];
  }

  // Fallback
  return {
    symbol: variableId.toUpperCase(),
    fullName: variableId,
    description: `Variable ${variableId}`,
  };
};
