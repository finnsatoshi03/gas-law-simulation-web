import { GasLawType } from "@/lib/types";
import { UNITS, UnitTypes } from "../Parameters";
import { GAS_CONSTANTS } from "@/lib/constants";

export const GAS_CONSTANT = 0.08206;

type UnitConverter = {
  toBase: number | ((value: number) => number);
};

const convertToBase = (
  value: string,
  unitType: keyof UnitTypes,
  unit: string
): number | null => {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return null;

  const converter = UNITS[unitType][unit] as UnitConverter;
  if (!converter) return null;

  return typeof converter.toBase === "function"
    ? converter.toBase(num)
    : num * (converter.toBase as number);
};

const convertFromBase = (
  value: number,
  unitType: keyof UnitTypes,
  unit: string
): number => {
  const converter = UNITS[unitType][unit] as UnitConverter;

  if (typeof converter.toBase === "function") {
    if (unitType === "temperature") {
      if (unit === "C") return value - 273.15;
      if (unit === "F") return ((value - 273.15) * 9) / 5 + 32;
    }
    return value;
  }
  return value / (converter.toBase as number);
};

const calculateMoles = (p: number, v: number, t: number): number | null => {
  if (!p || !v || !t || t <= 0) return null;
  return (p * v) / (GAS_CONSTANT * t);
};

const formatResult = (
  target: string,
  value: number,
  units: Record<string, string>,
  moles?: number
) => ({
  target,
  value: convertFromBase(
    value,
    target.startsWith("t")
      ? "temperature"
      : target.startsWith("p")
      ? "pressure"
      : target.startsWith("v")
      ? "volume"
      : "moles",
    units[target]
  ).toFixed(4),
  originalUnit: units[target],
  ...(moles !== undefined && {
    moles: convertFromBase(moles, "moles", units.n).toFixed(4),
  }),
});

const convertValues = (
  values: Record<string, string>,
  units: Record<string, string>
) => {
  const converted: Record<string, number | null> = {};
  for (const key in values) {
    if (values[key]) {
      converted[key] = convertToBase(
        values[key],
        key.startsWith("t")
          ? "temperature"
          : key.startsWith("p")
          ? "pressure"
          : key.startsWith("v")
          ? "volume"
          : "moles",
        units[key]
      );
    }
  }
  return converted;
};

interface GasLawConfig {
  vars: string[];
  requiredCount: number;
  calculate: (c: Record<string, number>, missing: string) => number | null;
  calculateMoles?: (c: Record<string, number>, missing: string) => number;
}

const GAS_LAW_CONFIGS: Record<GasLawType, GasLawConfig> = {
  boyles: {
    vars: ["p1", "v1", "p2", "v2", "t"],
    requiredCount: 4,
    calculate: (c, missing) =>
      missing === "v2"
        ? (c.p1 * c.v1) / c.p2
        : missing === "p2"
        ? (c.p1 * c.v1) / c.v2
        : missing === "v1"
        ? (c.p2 * c.v2) / c.p1
        : missing === "p1"
        ? (c.p2 * c.v2) / c.v1
        : null,
    calculateMoles: (c, missing) => {
      const moles = calculateMoles(
        c[missing === "p1" || missing === "v1" ? "p2" : "p1"],
        c[missing === "p1" || missing === "v1" ? "v2" : "v1"],
        c.t
      );
      return moles !== null ? moles : 0;
    },
  },
  charles: {
    vars: ["v1", "t1", "v2", "t2"],
    requiredCount: 3,
    calculate: (c, missing) =>
      missing === "t2"
        ? (c.v2 * c.t1) / c.v1
        : missing === "v2"
        ? (c.v1 * c.t2) / c.t1
        : missing === "t1"
        ? (c.v1 * c.t2) / c.v2
        : missing === "v1"
        ? (c.v2 * c.t1) / c.t2
        : null,
    calculateMoles: (c, missing) => {
      const moles = c.p
        ? calculateMoles(
            c.p,
            missing.startsWith("v") ? c[missing === "v1" ? "v2" : "v1"] : c.v1,
            missing.startsWith("t") ? c[missing === "t1" ? "t2" : "t1"] : c.t1
          )
        : null;
      return moles !== null ? moles : 0;
    },
  },
  gayLussac: {
    vars: ["p1", "t1", "p2", "t2"],
    requiredCount: 3,
    calculate: (c, missing) =>
      missing === "t2"
        ? (c.p2 * c.t1) / c.p1
        : missing === "p2"
        ? (c.p1 * c.t2) / c.t1
        : missing === "t1"
        ? (c.p1 * c.t2) / c.p2
        : missing === "p1"
        ? (c.p2 * c.t1) / c.t2
        : null,
  },
  avogadro: {
    vars: ["v1", "n1", "v2", "n2"],
    requiredCount: 3,
    calculate: (c, missing) =>
      missing === "n2"
        ? (c.v2 * c.n1) / c.v1
        : missing === "v2"
        ? (c.v1 * c.n2) / c.n1
        : missing === "n1"
        ? (c.v1 * c.n2) / c.v2
        : missing === "v1"
        ? (c.v2 * c.n1) / c.n2
        : null,
  },
  combined: {
    vars: ["p1", "v1", "t1", "p2", "v2", "t2"],
    requiredCount: 5,
    calculate: (c, missing) =>
      missing === "p2"
        ? (c.p1 * c.v1 * c.t2) / (c.t1 * c.v2)
        : missing === "v2"
        ? (c.p1 * c.v1 * c.t2) / (c.t1 * c.p2)
        : missing === "t2"
        ? (c.p2 * c.v2 * c.t1) / (c.p1 * c.v1)
        : missing === "p1"
        ? (c.p2 * c.v2 * c.t1) / (c.t2 * c.v1)
        : missing === "v1"
        ? (c.p2 * c.v2 * c.t1) / (c.t2 * c.p1)
        : missing === "t1"
        ? (c.p2 * c.v2 * c.t2) / (c.p1 * c.v1)
        : null,
  },
  ideal: {
    vars: ["p", "v", "n", "t"],
    requiredCount: 3,
    calculate: (c, missing, pressureUnit = "atm") => {
      const gasConstant: number =
        parseFloat(
          GAS_CONSTANTS[pressureUnit as keyof typeof GAS_CONSTANTS]?.value
        ) || parseFloat(GAS_CONSTANTS.atm.value);

      return missing === "p"
        ? (c.n * gasConstant * c.t) / c.v
        : missing === "v"
        ? (c.n * gasConstant * c.t) / c.p
        : missing === "n"
        ? (c.p * c.v) / (gasConstant * c.t)
        : missing === "t"
        ? (c.p * c.v) / (c.n * gasConstant)
        : null;
    },
  },
};

export const calculateGasLaw = (
  lawType: GasLawType,
  values: Record<string, string>,
  units: Record<string, string>
) => {
  const config = GAS_LAW_CONFIGS[lawType];
  if (!config) return null;

  const vars = config.vars;
  const missing = vars.find((v) => !values[v]);
  if (!missing || vars.filter((v) => values[v]).length !== config.requiredCount)
    return null;

  const converted = convertValues(values, units);
  const c = converted as Record<string, number>;
  const result = config.calculate(c, missing);

  if (!result) return null;

  const moles = config.calculateMoles
    ? config.calculateMoles(c, missing)
    : undefined;
  return formatResult(missing, result, units, moles);
};
