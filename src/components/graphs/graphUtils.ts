import { GraphDataPoint, AxisVariable, VARIABLE_INFO, UNIT_DISPLAY } from "./types";

// Temperature conversion utilities
export const celsiusToKelvin = (celsius: number): number => celsius + 273.15;
export const fahrenheitToKelvin = (fahrenheit: number): number =>
  ((fahrenheit - 32) * 5) / 9 + 273.15;

export const getKelvinTemperature = (temperature: number, unit: string): number => {
  if (unit === "C" || unit === "°C" || unit === "celsius") {
    return celsiusToKelvin(temperature);
  } else if (unit === "F" || unit === "°F" || unit === "fahrenheit") {
    return fahrenheitToKelvin(temperature);
  }
  return temperature;
};

// Generate data points for inverse relationship (Boyle's Law: PV = k)
export function generateInverseData(
  constant: number,
  xMin: number,
  xMax: number,
  numPoints: number = 50
): GraphDataPoint[] {
  const points: GraphDataPoint[] = [];
  const step = (xMax - xMin) / numPoints;
  
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    if (x > 0) {
      const y = constant / x;
      points.push({ x, y });
    }
  }
  
  return points;
}

// Generate data points for linear relationship (Charles', Gay-Lussac's, Avogadro's)
export function generateLinearData(
  slope: number,
  xMin: number,
  xMax: number,
  numPoints: number = 50,
  yIntercept: number = 0
): GraphDataPoint[] {
  const points: GraphDataPoint[] = [];
  const step = (xMax - xMin) / numPoints;
  
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    const y = slope * x + yIntercept;
    if (y >= 0) {
      points.push({ x, y });
    }
  }
  
  return points;
}

// Calculate range for graph axes with padding
export function calculateAxisRange(
  value: number,
  paddingFactor: number = 0.3
): { min: number; max: number } {
  if (value <= 0) {
    return { min: 0, max: 10 };
  }
  
  const padding = value * paddingFactor;
  const min = Math.max(0, value - padding);
  const max = value + padding;
  
  return { min, max };
}

// Format axis label with variable symbol, name, and unit
export function formatAxisLabel(
  variable: AxisVariable,
  unit: string
): string {
  const info = VARIABLE_INFO[variable];
  const unitDisplay = UNIT_DISPLAY[unit] || unit;
  return `${info.symbol} (${info.fullName}) [${unitDisplay}]`;
}

// Format short axis label (for compact displays)
export function formatShortAxisLabel(
  variable: AxisVariable,
  unit: string
): string {
  const info = VARIABLE_INFO[variable];
  const unitDisplay = UNIT_DISPLAY[unit] || unit;
  return `${info.symbol} [${unitDisplay}]`;
}

// Get the appropriate constant for each gas law
export function calculateConstant(
  lawType: string,
  values: Record<string, string>,
  units: Record<string, string>,
  graphMode?: string,
  result?: { target: string; value: string } | null
): { value: number; label: string; unit: string } | null {
  // Helper to get value, considering calculated result
  const getVal = (key: string) => {
    if (result?.target === key) {
      return parseFloat(result.value) || 0;
    }
    return parseFloat(values[key]) || 0;
  };

  switch (lawType) {
    case "boyles": {
      // PV = k
      const p1 = getVal("p1");
      const v1 = getVal("v1");
      const p2 = getVal("p2");
      const v2 = getVal("v2");
      
      let k = 0;
      if (p1 > 0 && v1 > 0) {
        k = p1 * v1;
      } else if (p2 > 0 && v2 > 0) {
        k = p2 * v2;
      }
      
      return {
        value: k,
        label: "k = PV",
        unit: `${units.p1 || "atm"}·${units.v1 || "L"}`,
      };
    }
    
    case "charles": {
      // V/T = k
      const v1 = getVal("v1");
      const t1 = getKelvinTemperature(getVal("t1"), units.t1);
      const v2 = getVal("v2");
      const t2 = getKelvinTemperature(getVal("t2"), units.t2);
      
      let k = 0;
      if (v1 > 0 && t1 > 0) {
        k = v1 / t1;
      } else if (v2 > 0 && t2 > 0) {
        k = v2 / t2;
      }
      
      return {
        value: k,
        label: "k = V/T",
        unit: `${units.v1 || "L"}/K`,
      };
    }
    
    case "gayLussac": {
      // P/T = k
      const p1 = getVal("p1");
      const t1 = getKelvinTemperature(getVal("t1"), units.t1);
      const p2 = getVal("p2");
      const t2 = getKelvinTemperature(getVal("t2"), units.t2);
      
      let k = 0;
      if (p1 > 0 && t1 > 0) {
        k = p1 / t1;
      } else if (p2 > 0 && t2 > 0) {
        k = p2 / t2;
      }
      
      return {
        value: k,
        label: "k = P/T",
        unit: `${units.p1 || "atm"}/K`,
      };
    }
    
    case "avogadro": {
      // V/n = k
      const v1 = getVal("v1");
      const n1 = getVal("n1");
      const v2 = getVal("v2");
      const n2 = getVal("n2");
      
      let k = 0;
      if (v1 > 0 && n1 > 0) {
        k = v1 / n1;
      } else if (v2 > 0 && n2 > 0) {
        k = v2 / n2;
      }
      
      return {
        value: k,
        label: "k = V/n",
        unit: `${units.v1 || "L"}/mol`,
      };
    }
    
    case "ideal": {
      // PV = nRT -> For graphing, we calculate based on the graph mode
      const p = getVal("p");
      const v = getVal("v");
      const n = getVal("n");
      const t = getKelvinTemperature(getVal("t"), units.t || "K");
      
      // R constant (using L·atm/mol·K)
      const R = 0.0821;
      
      let k = 0;
      let label = "k";
      let unit = "";
      
      // Calculate constant based on graph mode
      if (graphMode === "V_vs_T") {
        // V = (nR/P) * T -> slope = nR/P
        if (n > 0 && p > 0) {
          k = (n * R) / p;
          label = "k = nR/P";
          unit = `${units.v || "L"}/K`;
        } else if (v > 0 && t > 0) {
          k = v / t;
          label = "k = V/T";
          unit = `${units.v || "L"}/K`;
        }
      } else if (graphMode === "P_vs_T") {
        // P = (nR/V) * T -> slope = nR/V
        if (n > 0 && v > 0) {
          k = (n * R) / v;
          label = "k = nR/V";
          unit = `${units.p || "atm"}/K`;
        } else if (p > 0 && t > 0) {
          k = p / t;
          label = "k = P/T";
          unit = `${units.p || "atm"}/K`;
        }
      } else {
        // P vs V (inverse): PV = nRT = k
        if (p > 0 && v > 0) {
          k = p * v;
          label = "k = PV";
          unit = `${units.p || "atm"}·${units.v || "L"}`;
        } else if (n > 0 && t > 0) {
          k = n * R * t;
          label = "k = nRT";
          unit = `${units.p || "atm"}·${units.v || "L"}`;
        }
      }
      
      return { value: k, label, unit };
    }
    
    case "combined": {
      // P1V1/T1 = P2V2/T2 = k
      const p1 = getVal("p1");
      const v1 = getVal("v1");
      const t1 = getKelvinTemperature(getVal("t1"), units.t1 || "K");
      const p2 = getVal("p2");
      const v2 = getVal("v2");
      const t2 = getKelvinTemperature(getVal("t2"), units.t2 || "K");
      
      let k = 0;
      let label = "k";
      let unit = "";
      
      // Calculate constant based on graph mode
      if (graphMode === "V_vs_T") {
        // V/T = k at constant P
        if (v1 > 0 && t1 > 0) {
          k = v1 / t1;
        } else if (v2 > 0 && t2 > 0) {
          k = v2 / t2;
        }
        label = "k = V/T";
        unit = `${units.v1 || "L"}/K`;
      } else if (graphMode === "P_vs_V") {
        // PV = k at constant T
        if (p1 > 0 && v1 > 0) {
          k = p1 * v1;
        } else if (p2 > 0 && v2 > 0) {
          k = p2 * v2;
        }
        label = "k = PV";
        unit = `${units.p1 || "atm"}·${units.v1 || "L"}`;
      } else {
        // P vs T (linear): P/T = k at constant V
        if (p1 > 0 && t1 > 0) {
          k = p1 / t1;
        } else if (p2 > 0 && t2 > 0) {
          k = p2 / t2;
        }
        label = "k = P/T";
        unit = `${units.p1 || "atm"}/K`;
      }
      
      return { value: k, label, unit };
    }
    
    default:
      return null;
  }
}

// Get current state point for the graph
export function getCurrentStatePoint(
  lawType: string,
  values: Record<string, string>,
  units: Record<string, string>,
  result?: { target: string; value: string } | null,
  graphMode?: string
): { initial: { x: number; y: number } | null; final: { x: number; y: number } | null } {
  const getVal = (key: string) => {
    if (result?.target === key) {
      return parseFloat(result.value) || 0;
    }
    return parseFloat(values[key]) || 0;
  };

  switch (lawType) {
    case "boyles": {
      const v1 = getVal("v1");
      const p1 = getVal("p1");
      const v2 = getVal("v2");
      const p2 = getVal("p2");
      
      return {
        initial: v1 > 0 && p1 > 0 ? { x: v1, y: p1 } : null,
        final: v2 > 0 && p2 > 0 ? { x: v2, y: p2 } : null,
      };
    }
    
    case "charles": {
      const t1 = getKelvinTemperature(getVal("t1"), units.t1);
      const v1 = getVal("v1");
      const t2 = getKelvinTemperature(getVal("t2"), units.t2);
      const v2 = getVal("v2");
      
      return {
        initial: t1 > 0 && v1 > 0 ? { x: t1, y: v1 } : null,
        final: t2 > 0 && v2 > 0 ? { x: t2, y: v2 } : null,
      };
    }
    
    case "gayLussac": {
      const t1 = getKelvinTemperature(getVal("t1"), units.t1);
      const p1 = getVal("p1");
      const t2 = getKelvinTemperature(getVal("t2"), units.t2);
      const p2 = getVal("p2");
      
      return {
        initial: t1 > 0 && p1 > 0 ? { x: t1, y: p1 } : null,
        final: t2 > 0 && p2 > 0 ? { x: t2, y: p2 } : null,
      };
    }
    
    case "avogadro": {
      const n1 = getVal("n1");
      const v1 = getVal("v1");
      const n2 = getVal("n2");
      const v2 = getVal("v2");
      
      return {
        initial: n1 > 0 && v1 > 0 ? { x: n1, y: v1 } : null,
        final: n2 > 0 && v2 > 0 ? { x: n2, y: v2 } : null,
      };
    }
    
    case "ideal": {
      // For ideal gas law, we show a single state point based on graph mode
      const p = getVal("p");
      const v = getVal("v");
      const t = getKelvinTemperature(getVal("t"), units.t || "K");
      
      // Determine x and y based on graph mode
      if (graphMode === "V_vs_T") {
        return {
          initial: t > 0 && v > 0 ? { x: t, y: v } : null,
          final: null,
        };
      } else if (graphMode === "P_vs_T") {
        return {
          initial: t > 0 && p > 0 ? { x: t, y: p } : null,
          final: null,
        };
      }
      // Default: P vs V
      return {
        initial: v > 0 && p > 0 ? { x: v, y: p } : null,
        final: null,
      };
    }
    
    case "combined": {
      // Combined gas law has initial and final states
      const p1 = getVal("p1");
      const v1 = getVal("v1");
      const t1 = getKelvinTemperature(getVal("t1"), units.t1 || "K");
      const p2 = getVal("p2");
      const v2 = getVal("v2");
      const t2 = getKelvinTemperature(getVal("t2"), units.t2 || "K");
      
      // Determine x and y based on graph mode
      if (graphMode === "V_vs_T") {
        return {
          initial: t1 > 0 && v1 > 0 ? { x: t1, y: v1 } : null,
          final: t2 > 0 && v2 > 0 ? { x: t2, y: v2 } : null,
        };
      } else if (graphMode === "P_vs_V") {
        return {
          initial: v1 > 0 && p1 > 0 ? { x: v1, y: p1 } : null,
          final: v2 > 0 && p2 > 0 ? { x: v2, y: p2 } : null,
        };
      }
      // Default: P vs T
      return {
        initial: t1 > 0 && p1 > 0 ? { x: t1, y: p1 } : null,
        final: t2 > 0 && p2 > 0 ? { x: t2, y: p2 } : null,
      };
    }
    
    default:
      return { initial: null, final: null };
  }
}

// Check if we have enough data to display a graph
export function hasEnoughDataForGraph(
  lawType: string,
  values: Record<string, string>,
  result?: { target: string; value: string } | null
): boolean {
  const getVal = (key: string) => {
    if (result?.target === key) {
      return parseFloat(result.value) || 0;
    }
    return parseFloat(values[key]) || 0;
  };

  switch (lawType) {
    case "boyles": {
      const p1 = getVal("p1");
      const v1 = getVal("v1");
      const p2 = getVal("p2");
      const v2 = getVal("v2");
      // Need at least one valid point to calculate constant
      return (p1 > 0 && v1 > 0) || (p2 > 0 && v2 > 0);
    }
    
    case "charles": {
      const v1 = getVal("v1");
      const t1 = getVal("t1");
      const v2 = getVal("v2");
      const t2 = getVal("t2");
      return (v1 > 0 && t1 > 0) || (v2 > 0 && t2 > 0);
    }
    
    case "gayLussac": {
      const p1 = getVal("p1");
      const t1 = getVal("t1");
      const p2 = getVal("p2");
      const t2 = getVal("t2");
      return (p1 > 0 && t1 > 0) || (p2 > 0 && t2 > 0);
    }
    
    case "avogadro": {
      const v1 = getVal("v1");
      const n1 = getVal("n1");
      const v2 = getVal("v2");
      const n2 = getVal("n2");
      return (v1 > 0 && n1 > 0) || (v2 > 0 && n2 > 0);
    }
    
    case "ideal": {
      const p = getVal("p");
      const v = getVal("v");
      const n = getVal("n");
      const t = getVal("t");
      // Need at least 2 values for ideal gas law graph
      const validCount = [p, v, n, t].filter(x => x > 0).length;
      return validCount >= 2;
    }
    
    case "combined": {
      const p1 = getVal("p1");
      const v1 = getVal("v1");
      const t1 = getVal("t1");
      const p2 = getVal("p2");
      const v2 = getVal("v2");
      const t2 = getVal("t2");
      // Need at least 3 values
      const validCount = [p1, v1, t1, p2, v2, t2].filter(x => x > 0).length;
      return validCount >= 3;
    }
    
    default:
      return false;
  }
}
