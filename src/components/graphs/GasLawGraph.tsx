import React, { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GasLawGraphProps, GraphMode, UNIT_DISPLAY } from "./types";
import {
  generateInverseData,
  generateLinearData,
  calculateConstant,
  getCurrentStatePoint,
  hasEnoughDataForGraph,
} from "./graphUtils";

// Color palette for the graph
const GRAPH_COLORS = {
  curve: "#6366f1", // Indigo
  curveGradient: "url(#curveGradient)",
  initialPoint: "#22c55e", // Green
  finalPoint: "#f97316", // Orange
  grid: "#e5e7eb",
  axis: "#374151",
  background: "#fafafa",
};

interface GraphConfig {
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  curveType: "inverse" | "linear";
  xVariable: string;
  yVariable: string;
}

interface ModeOption {
  value: GraphMode;
  label: string;
  description: string;
  constants: string[];
}

const IDEAL_MODES: ModeOption[] = [
  {
    value: "P_vs_V",
    label: "P vs V",
    description: "Pressure vs Volume (Boyle's relationship)",
    constants: ["n", "T"],
  },
  {
    value: "V_vs_T",
    label: "V vs T",
    description: "Volume vs Temperature (Charles' relationship)",
    constants: ["P", "n"],
  },
  {
    value: "P_vs_T",
    label: "P vs T",
    description: "Pressure vs Temperature (Gay-Lussac's relationship)",
    constants: ["V", "n"],
  },
];

const COMBINED_MODES: ModeOption[] = [
  {
    value: "P_vs_V",
    label: "P vs V",
    description: "Pressure vs Volume at constant T",
    constants: ["T"],
  },
  {
    value: "V_vs_T",
    label: "V vs T",
    description: "Volume vs Temperature at constant P",
    constants: ["P"],
  },
  {
    value: "P_vs_T",
    label: "P vs T",
    description: "Pressure vs Temperature at constant V",
    constants: ["V"],
  },
];

function getGraphConfig(
  lawType: string,
  units: Record<string, string>,
  graphMode?: GraphMode
): GraphConfig {
  switch (lawType) {
    case "boyles":
      return {
        xLabel: "Volume (V)",
        yLabel: "Pressure (P)",
        xUnit: UNIT_DISPLAY[units.v1] || units.v1 || "L",
        yUnit: UNIT_DISPLAY[units.p1] || units.p1 || "atm",
        curveType: "inverse",
        xVariable: "V",
        yVariable: "P",
      };

    case "charles":
      return {
        xLabel: "Temperature (T)",
        yLabel: "Volume (V)",
        xUnit: "K", // Always display in Kelvin for graph
        yUnit: UNIT_DISPLAY[units.v1] || units.v1 || "L",
        curveType: "linear",
        xVariable: "T",
        yVariable: "V",
      };

    case "gayLussac":
      return {
        xLabel: "Temperature (T)",
        yLabel: "Pressure (P)",
        xUnit: "K",
        yUnit: UNIT_DISPLAY[units.p1] || units.p1 || "atm",
        curveType: "linear",
        xVariable: "T",
        yVariable: "P",
      };

    case "avogadro":
      return {
        xLabel: "Moles (n)",
        yLabel: "Volume (V)",
        xUnit: UNIT_DISPLAY[units.n1] || units.n1 || "mol",
        yUnit: UNIT_DISPLAY[units.v1] || units.v1 || "L",
        curveType: "linear",
        xVariable: "n",
        yVariable: "V",
      };

    case "ideal":
      // Default to P vs V mode
      if (graphMode === "V_vs_T") {
        return {
          xLabel: "Temperature (T)",
          yLabel: "Volume (V)",
          xUnit: "K",
          yUnit: UNIT_DISPLAY[units.v] || units.v || "L",
          curveType: "linear",
          xVariable: "T",
          yVariable: "V",
        };
      } else if (graphMode === "P_vs_T") {
        return {
          xLabel: "Temperature (T)",
          yLabel: "Pressure (P)",
          xUnit: "K",
          yUnit: UNIT_DISPLAY[units.p] || units.p || "atm",
          curveType: "linear",
          xVariable: "T",
          yVariable: "P",
        };
      }
      return {
        xLabel: "Volume (V)",
        yLabel: "Pressure (P)",
        xUnit: UNIT_DISPLAY[units.v] || units.v || "L",
        yUnit: UNIT_DISPLAY[units.p] || units.p || "atm",
        curveType: "inverse",
        xVariable: "V",
        yVariable: "P",
      };

    case "combined":
      // Dynamic based on graph mode
      if (graphMode === "V_vs_T") {
        return {
          xLabel: "Temperature (T)",
          yLabel: "Volume (V)",
          xUnit: "K",
          yUnit: UNIT_DISPLAY[units.v1] || units.v1 || "L",
          curveType: "linear",
          xVariable: "T",
          yVariable: "V",
        };
      } else if (graphMode === "P_vs_V") {
        return {
          xLabel: "Volume (V)",
          yLabel: "Pressure (P)",
          xUnit: UNIT_DISPLAY[units.v1] || units.v1 || "L",
          yUnit: UNIT_DISPLAY[units.p1] || units.p1 || "atm",
          curveType: "inverse",
          xVariable: "V",
          yVariable: "P",
        };
      }
      return {
        xLabel: "Temperature (T)",
        yLabel: "Pressure (P)",
        xUnit: "K",
        yUnit: UNIT_DISPLAY[units.p1] || units.p1 || "atm",
        curveType: "linear",
        xVariable: "T",
        yVariable: "P",
      };

    default:
      return {
        xLabel: "X",
        yLabel: "Y",
        xUnit: "",
        yUnit: "",
        curveType: "linear",
        xVariable: "x",
        yVariable: "y",
      };
  }
}

// Custom tooltip component
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: number;
  xUnit: string;
  yUnit: string;
  xVariable: string;
  yVariable: string;
}> = ({ active, payload, label, xUnit, yUnit, xVariable, yVariable }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium text-gray-700">
          {xVariable}: {label?.toFixed(2)} {xUnit}
        </p>
        <p className="text-indigo-600 font-semibold">
          {yVariable}: {payload[0].value.toFixed(4)} {yUnit}
        </p>
      </div>
    );
  }
  return null;
};

// Get law display name
function getLawDisplayName(lawType: string): string {
  switch (lawType) {
    case "boyles":
      return "Boyle's Law";
    case "charles":
      return "Charles' Law";
    case "gayLussac":
      return "Gay-Lussac's Law";
    case "avogadro":
      return "Avogadro's Law";
    case "ideal":
      return "Ideal Gas Law";
    case "combined":
      return "Combined Gas Law";
    default:
      return "Gas Law";
  }
}

const GasLawGraph: React.FC<GasLawGraphProps> = ({
  lawType,
  values,
  units,
  result,
  graphMode: initialGraphMode = "P_vs_V",
  className,
}) => {
  const [showPulsing, setShowPulsing] = useState(false);
  const [graphMode, setGraphMode] = useState<GraphMode>(initialGraphMode);

  // Check if this law type supports graph mode selection
  const supportsGraphMode = lawType === "ideal" || lawType === "combined";
  const modes = lawType === "ideal" ? IDEAL_MODES : COMBINED_MODES;

  const config = useMemo(
    () => getGraphConfig(lawType, units, graphMode),
    [lawType, units, graphMode]
  );

  const hasData = useMemo(
    () => hasEnoughDataForGraph(lawType, values, result),
    [lawType, values, result]
  );

  const constantInfo = useMemo(
    () => calculateConstant(lawType, values, units, graphMode, result),
    [lawType, values, units, graphMode, result]
  );

  const statePoints = useMemo(
    () => getCurrentStatePoint(lawType, values, units, result, graphMode),
    [lawType, values, units, result, graphMode]
  );

  const graphData = useMemo(() => {
    if (!hasData || !constantInfo || constantInfo.value <= 0) {
      return [];
    }

    // Determine axis range based on state points
    let xMin = 0.1;
    let xMax = 10;

    if (statePoints.initial || statePoints.final) {
      const points = [statePoints.initial, statePoints.final].filter(Boolean);
      const xValues = points.map((p) => p!.x);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);

      xMin = Math.max(0.01, minX * 0.3);
      xMax = maxX * 1.5;
    }

    if (config.curveType === "inverse") {
      return generateInverseData(constantInfo.value, xMin, xMax, 100);
    } else {
      // For linear relationships, slope = constant
      return generateLinearData(constantInfo.value, xMin, xMax, 100);
    }
  }, [hasData, constantInfo, statePoints, config]);

  // Calculate Y-axis domain
  const yDomain = useMemo(() => {
    if (graphData.length === 0) return [0, 10];

    const yValues = graphData.map((d) => d.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    return [Math.max(0, minY * 0.8), maxY * 1.2];
  }, [graphData]);

  // Calculate X-axis domain
  const xDomain = useMemo(() => {
    if (graphData.length === 0) return [0, 10];

    const xValues = graphData.map((d) => d.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    return [minX, maxX];
  }, [graphData]);

  // Pulse animation when data becomes available
  useEffect(() => {
    if (hasData) {
      setShowPulsing(true);
      const timer = setTimeout(() => setShowPulsing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasData]);

  // Get constant display for graph mode
  const getConstantDisplay = (constantId: string): string => {
    const valueMap: Record<string, string> = {
      P: values.p || values.p1 || "",
      V: values.v || values.v1 || "",
      T: values.t || values.t1 || "",
      n: values.n || values.n1 || "",
    };

    const unitMap: Record<string, string> = {
      P: units.p || units.p1 || "atm",
      V: units.v || units.v1 || "L",
      T: units.t || units.t1 || "K",
      n: units.n || units.n1 || "mol",
    };

    const value = parseFloat(valueMap[constantId]);
    if (isNaN(value) || value === 0) return `${constantId} = ?`;

    return `${constantId} = ${value.toFixed(2)} ${unitMap[constantId]}`;
  };

  // Don't render anything if no data
  if (!hasData) return null;

  return (
    <Dialog>
      <UITooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              className={cn(
                "w-fit text-white bg-indigo-500 hover:bg-indigo-400",
                showPulsing && "animate-pulse",
                className
              )}
            >
              <TrendingUp className="size-4" />
              Graph
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>View the relationship graph for {getLawDisplayName(lawType)}</p>
        </TooltipContent>
      </UITooltip>

      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-indigo-500" />
              <h2 className="text-xl font-bold">
                {getLawDisplayName(lawType)} Graph
              </h2>
            </div>

            {/* Graph Mode Selector (for Ideal and Combined) */}
            {supportsGraphMode && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Mode:</span>
                <Select
                  value={graphMode}
                  onValueChange={(value) => setGraphMode(value as GraphMode)}
                >
                  <SelectTrigger className="w-28 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modes.map((mode) => (
                      <SelectItem
                        key={mode.value}
                        value={mode.value}
                        className="text-sm"
                      >
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Constants display for graph mode */}
          {supportsGraphMode && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="font-medium">Constants:</span>
              {modes
                .find((m) => m.value === graphMode)
                ?.constants.map((c, i, arr) => (
                  <span key={c} className="text-indigo-600 font-mono">
                    {getConstantDisplay(c)}
                    {i < arr.length - 1 && ","}
                  </span>
                ))}
            </div>
          )}

          {/* Constant display (k value) */}
          {constantInfo && constantInfo.value > 0 && (
            <div className="px-4 py-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-700 font-medium">
                {constantInfo.label} = {constantInfo.value.toFixed(4)}{" "}
                {constantInfo.unit}
              </p>
            </div>
          )}

          {/* Graph */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={graphData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <defs>
                  <linearGradient
                    id="curveGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={GRAPH_COLORS.grid}
                  opacity={0.7}
                />
                <XAxis
                  dataKey="x"
                  stroke={GRAPH_COLORS.axis}
                  fontSize={12}
                  domain={xDomain}
                  type="number"
                  tickFormatter={(value) => value.toFixed(1)}
                  label={{
                    value: `${config.xLabel} [${config.xUnit}]`,
                    position: "bottom",
                    offset: 5,
                    fontSize: 12,
                    fill: GRAPH_COLORS.axis,
                  }}
                />
                <YAxis
                  stroke={GRAPH_COLORS.axis}
                  fontSize={12}
                  domain={yDomain}
                  tickFormatter={(value) => value.toFixed(2)}
                  label={{
                    value: `${config.yLabel} [${config.yUnit}]`,
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 12,
                    fill: GRAPH_COLORS.axis,
                  }}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      xUnit={config.xUnit}
                      yUnit={config.yUnit}
                      xVariable={config.xVariable}
                      yVariable={config.yVariable}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={GRAPH_COLORS.curve}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: GRAPH_COLORS.curve }}
                  isAnimationActive={false}
                />

                {/* Initial state point */}
                {statePoints.initial && (
                  <ReferenceDot
                    x={statePoints.initial.x}
                    y={statePoints.initial.y}
                    r={8}
                    fill={GRAPH_COLORS.initialPoint}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}

                {/* Final state point */}
                {statePoints.final && (
                  <ReferenceDot
                    x={statePoints.final.x}
                    y={statePoints.final.y}
                    r={8}
                    fill={GRAPH_COLORS.finalPoint}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}

                <Legend
                  verticalAlign="top"
                  height={36}
                  content={() => (
                    <div className="flex justify-center gap-6 text-sm mt-1">
                      {statePoints.initial && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: GRAPH_COLORS.initialPoint,
                            }}
                          />
                          <span className="text-gray-600">Initial State</span>
                        </div>
                      )}
                      {statePoints.final && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: GRAPH_COLORS.finalPoint }}
                          />
                          <span className="text-gray-600">Final State</span>
                        </div>
                      )}
                    </div>
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Relationship description */}
          <div className="text-center bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-600">
              {config.curveType === "inverse" ? (
                <>
                  <span className="font-semibold text-indigo-600">
                    Inverse relationship:
                  </span>{" "}
                  As {config.xVariable} increases, {config.yVariable} decreases
                </>
              ) : (
                <>
                  <span className="font-semibold text-indigo-600">
                    Direct relationship:
                  </span>{" "}
                  As {config.xVariable} increases, {config.yVariable} increases
                </>
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GasLawGraph;
