import React, { useMemo, useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import katex from "katex";
import "katex/dist/katex.min.css";

import { GAS_CONSTANTS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

// Enum for Gas Law Types
export enum GasLawType {
  BOYLES_LAW = "Boyle's Law",
  CHARLES_LAW = "Charles' Law",
  COMBINED_GAS_LAW = "Combined Gas Law",
  IDEAL_GAS_LAW = "Ideal Gas Law",
  AVOGADROS_LAW = "Avogadro's Law",
  GAY_LUSSACS_LAW = "Gay-Lussac's Law",
}

interface SolutionSheetProps {
  className?: string;
  result?: {
    target: string;
    value: string | number;
  };
  lawType: GasLawType;
  values: Record<string, string>;
  units: Record<string, string>;
}

export const SolutionSheet: React.FC<SolutionSheetProps> = ({
  className = "",
  result,
  lawType,
  values,
  units,
}) => {
  const [showPulsing, setShowPulsing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [solutionAuthenticated, setSolutionAuthenticated] = useState(false);
  const [rememberSolution, setRememberSolution] = useState(false);
  const [showSolutionContent, setShowSolutionContent] = useState(false);

  const authSchema = z.object({
    password: z.string(),
  });

  useEffect(() => {
    const savedSolutionAuth = localStorage.getItem("solutionSheetAuth");
    if (savedSolutionAuth) {
      setSolutionAuthenticated(true);
      setShowSolutionContent(true);
    }
  }, []);

  // Form setup
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof authSchema>) => {
    const SOLUTION_PASSWORD = import.meta.env.VITE_APP_PASSWORD;

    if (data.password === SOLUTION_PASSWORD) {
      setSolutionAuthenticated(true);

      if (rememberSolution) {
        localStorage.setItem("solutionSheetAuth", "true");
      }
    } else {
      form.setError("password", {
        type: "manual",
        message: "Invalid solution password",
      });
    }
  };

  const calculatedVariable = useMemo(() => {
    if (!result) return null;
    return result.target;
  }, [result]);

  const solutionSteps = useMemo(() => {
    if (!result || !calculatedVariable) return null;

    // Convert values to numbers
    const p1 = parseFloat(values.p1 || values.p || "0");
    const v1 = parseFloat(values.v1 || values.v || "0");
    const p2 = parseFloat(values.p2 || values.p || "0");
    const v2 = parseFloat(values.v2 || values.v || "0");
    const t1 = parseFloat(values.t1 || values.t || "0");
    const t2 = parseFloat(values.t2 || values.t || "0");
    const n1 = parseFloat(values.n1 || values.n || "0");
    const n2 = parseFloat(values.n2 || values.n || "0");

    const generateSolutionSteps = () => {
      switch (lawType) {
        case GasLawType.BOYLES_LAW:
          return boylesLawSolution(p1, v1, p2, v2, calculatedVariable!, units);

        case GasLawType.CHARLES_LAW:
          return charlesLawSolution(v1, t1, v2, t2, calculatedVariable!, units);

        case GasLawType.COMBINED_GAS_LAW:
          return combinedGasLawSolution(
            p1,
            v1,
            t1,
            p2,
            v2,
            t2,
            calculatedVariable!,
            units
          );

        case GasLawType.IDEAL_GAS_LAW:
          return idealGasLawSolution(
            p1,
            v1,
            n1,
            t1,
            calculatedVariable!,
            units
          );

        case GasLawType.AVOGADROS_LAW:
          return avogadrosLawSolution(
            v1,
            n1,
            v2,
            n2,
            calculatedVariable!,
            units
          );

        case GasLawType.GAY_LUSSACS_LAW:
          return gayLussacsLawSolution(
            p1,
            t1,
            p2,
            t2,
            calculatedVariable!,
            units
          );

        default:
          return null;
      }
    };

    return generateSolutionSteps();
  }, [result, values, units, calculatedVariable, lawType]);

  useEffect(() => {
    if (result) {
      setShowPulsing(true);
      const timer = setTimeout(() => setShowPulsing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const renderEquation = (equation: string) => {
    try {
      return katex.renderToString(equation, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (error) {
      return `Error rendering equation: ${equation} ${error}`;
    }
  };

  if (!result) return null;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setShowSolutionContent(false);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              className={`
                w-fit text-zinc-800 bg-yellow-400 hover:bg-yellow-300 
                ${showPulsing ? "animate-pulse" : ""}
                ${className}
              `}
            >
              <Lightbulb /> Solution
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to view the solution steps for the selected gas law.</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="max-w-[800px] overflow-y-auto p-6">
        {!solutionAuthenticated ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Solution Authentication</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter solution-specific password"
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-solution"
                    checked={rememberSolution}
                    onCheckedChange={() =>
                      setRememberSolution(!rememberSolution)
                    }
                  />
                  <label
                    htmlFor="remember-solution"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember Solution Access
                  </label>
                </div>
                {form.formState.errors.password && (
                  <Alert variant="destructive">
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>
                      {form.formState.errors.password.message}
                    </AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Unlock Solution
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {lawType} Calculation Solution
              </h2>
              <div className="flex gap-2">
                {result && solutionSteps && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSolutionContent(!showSolutionContent)}
                    className="flex items-center gap-2"
                  >
                    {showSolutionContent ? (
                      <>
                        <ChevronUp size={16} /> Hide Solution
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} /> Show Solution
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {result && solutionSteps && showSolutionContent && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                {Object.entries(solutionSteps).map(([key, step]) => (
                  <div key={key}>
                    <h3 className="font-semibold mb-2 capitalize">
                      {key.replace(/_/g, " ")}
                    </h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderEquation(step),
                      }}
                    />
                  </div>
                ))}

                <div className="mt-4 p-3 bg-green-100 rounded">
                  <h4 className="font-medium">Calculated Value</h4>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: renderEquation(
                        `${
                          calculatedVariable?.includes("1")
                            ? calculatedVariable[0].toUpperCase() +
                              calculatedVariable.substring(1).replace("1", "_1")
                            : calculatedVariable?.includes("2")
                            ? calculatedVariable[0].toUpperCase() +
                              calculatedVariable.substring(1).replace("2", "_2")
                            : calculatedVariable
                            ? calculatedVariable[0].toUpperCase() +
                              calculatedVariable.substring(1)
                            : ""
                        } = ${result.value}\\text{ ${
                          units[calculatedVariable!]
                        }}`
                      ),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const boylesLawSolution = (
  p1: number,
  v1: number,
  p2: number,
  v2: number,
  target: string,
  units: Record<string, string>
) => {
  const equationText = "\\text{Boyle's Law: } P_1V_1 = P_2V_2";

  switch (target) {
    case "v1":
      return {
        equation: equationText,
        rearranged_equation: `V_1 = \\frac{P_2V_2}{P_1} \\quad \\Rightarrow \\frac{(${p2}\\text{ ${units.p2}})(${v2}\\text{ ${units.v2}})}{${p1}\\text{ ${units.p1}}}`,
        numerator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${v2}\\text{ ${units.v2}}) = ${p2 * v2}\\text{ ${
          units.p2
        }⋅${units.v2}}`,
        denominator_calculation: `(${p1}\\text{ ${units.p1}}) = ${p1}\\text{ ${units.p1}}`,
        final_calculation: `\\frac{${p2}${
          units.p2 === units.p1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p2}}}}`
            : `\\text{ ${units.p2}}`
        } \\times ${v2}\\text{ ${units.v2}}}{${p1}${
          units.p2 === units.p1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p1}}}}`
            : `\\text{ ${units.p1}}`
        }} = ${((p2 * v2) / p1).toFixed(2)}\\text{ ${units.v1}}`,
      };
    case "p1":
      return {
        equation: equationText,
        rearranged_equation: `P_1 = \\frac{P_2V_2}{V_1} \\quad \\Rightarrow \\frac{(${p2}\\text{ ${units.p2}})(${v2}\\text{ ${units.v2}})}{${v1}\\text{ ${units.v1}}}`,
        numerator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${v2}\\text{ ${units.v2}}) = ${p2 * v2}\\text{ ${
          units.p2
        }⋅${units.v2}}`,
        denominator_calculation: `(${v1}\\text{ ${units.v1}}) = ${v1}\\text{ ${units.v1}}`,
        final_calculation: `\\frac{${p2}\\text{ ${units.p2}} \\times ${v2}${
          units.v2 === units.v1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v2}}}}`
            : `\\text{ ${units.v2}}`
        }}{${v1}${
          units.v2 === units.v1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v1}}}}`
            : `\\text{ ${units.v1}}`
        }} = ${((p2 * v2) / v1).toFixed(2)}\\text{ ${units.p1}}`,
      };
    case "v2":
      return {
        equation: equationText,
        rearranged_equation: `V_2 = \\frac{P_1V_1}{P_2} \\quad \\Rightarrow \\frac{(${p1}\\text{ ${units.p1}})(${v1}\\text{ ${units.v1}})}{${p2}\\text{ ${units.p2}}}`,
        numerator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${v1}\\text{ ${units.v1}}) = ${p1 * v1}\\text{ ${
          units.p1
        }⋅${units.v1}}`,
        denominator_calculation: `(${p2}\\text{ ${units.p2}}) = ${p2}\\text{ ${units.p2}}`,
        final_calculation: `\\frac{${p1}${
          units.p1 === units.p2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p1}}}}`
            : `\\text{ ${units.p1}}`
        } \\times ${v1}\\text{ ${units.v1}}}{${p2}${
          units.p1 === units.p2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p2}}}}`
            : `\\text{ ${units.p2}}`
        }} = ${((p1 * v1) / p2).toFixed(2)}\\text{ ${units.v2}}`,
      };
    case "p2":
      return {
        equation: equationText,
        rearranged_equation: `P_2 = \\frac{P_1V_1}{V_2} \\quad \\Rightarrow \\frac{(${p1}\\text{ ${units.p1}})(${v1}\\text{ ${units.v1}})}{${v2}\\text{ ${units.v2}}}`,
        numerator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${v1}\\text{ ${units.v1}}) = ${p1 * v1}\\text{ ${
          units.p1
        }⋅${units.v1}}`,
        denominator_calculation: `(${v2}\\text{ ${units.v2}}) = ${v2}\\text{ ${units.v2}}`,
        final_calculation: `\\frac{${p1}\\text{ ${units.p1}} \\times ${v1}${
          units.v1 === units.v2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v1}}}}`
            : `\\text{ ${units.v1}}`
        }}{${v2}${
          units.v1 === units.v2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v2}}}}`
            : `\\text{ ${units.v2}}`
        }} = ${((p1 * v1) / v2).toFixed(2)}\\text{ ${units.p2}}`,
      };
    default:
      return null;
  }
};

const charlesLawSolution = (
  v1: number,
  t1: number,
  v2: number,
  t2: number,
  target: string,
  units: Record<string, string>
) => {
  const equationText =
    "\\text{Charles' Law: } \\frac{V_1}{T_1} = \\frac{V_2}{T_2}";

  switch (target) {
    case "v1":
      return {
        equation: equationText,
        rearranged_equation: `V_1 = \\frac{V_2T_1}{T_2} \\quad \\Rightarrow \\frac{(${v2}\\text{ ${units.v2}})(${t1}\\text{ ${units.t1}})}{${t2}\\text{ ${units.t2}}}`,
        numerator_calculation: `(${v2}\\text{ ${
          units.v2
        }}) \\times (${t1}\\text{ ${units.t1}}) = ${v2 * t1}\\text{ ${
          units.v2
        }⋅${units.t1}}`,
        denominator_calculation: `(${t2}\\text{ ${units.t2}}) = ${t2}\\text{ ${units.t2}}`,
        final_calculation: `V_1 = \\frac{${v2}\\text{ ${
          units.v2
        }} \\times ${t1}${
          units.t1 === units.t2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t1}}}}`
            : `\\text{ ${units.t1}}`
        }}{${t2}${
          units.t1 === units.t2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t2}}}}`
            : `\\text{ ${units.t2}}`
        }} = ${((v2 * t1) / t2).toFixed(2)}\\text{ ${units.v1}}`,
      };
    case "v2":
      return {
        equation: equationText,
        rearranged_equation: `V_2 = \\frac{V_1T_2}{T_1} \\quad \\Rightarrow \\frac{(${v1}\\text{ ${units.v1}})(${t2}\\text{ ${units.t2}})}{${t1}\\text{ ${units.t1}}}`,
        numerator_calculation: `(${v1}\\text{ ${
          units.v1
        }}) \\times (${t2}\\text{ ${units.t2}}) = ${v1 * t2}\\text{ ${
          units.v1
        }⋅${units.t2}}`,
        denominator_calculation: `(${t1}\\text{ ${units.t1}}) = ${t1}\\text{ ${units.t1}}`,
        final_calculation: `V_2 = \\frac{${v1}\\text{ ${
          units.v1
        }} \\times ${t2}${
          units.t2 === units.t1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t2}}}}`
            : `\\text{ ${units.t2}}`
        }}{${t1}${
          units.t2 === units.t1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t1}}}}`
            : `\\text{ ${units.t1}}`
        }} = ${((v1 * t2) / t1).toFixed(2)}\\text{ ${units.v2}}`,
      };
    case "t1":
      return {
        equation: equationText,
        rearranged_equation: `T_1 = \\frac{V_1T_2}{V_2} \\quad \\Rightarrow \\frac{(${v1}\\text{ ${units.v1}})(${t2}\\text{ ${units.t2}})}{${v2}\\text{ ${units.v2}}}`,
        numerator_calculation: `(${v1}\\text{ ${
          units.v1
        }}) \\times (${t2}\\text{ ${units.t2}}) = ${v1 * t2}\\text{ ${
          units.v1
        }⋅${units.t2}}`,
        denominator_calculation: `(${v2}\\text{ ${units.v2}}) = ${v2}\\text{ ${units.v2}}`,
        final_calculation: `T_1 = \\frac{${v1}${
          units.v1 === units.v2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v1}}}}`
            : `\\text{ ${units.v1}}`
        } \\times ${t2}\\text{ ${units.t2}}}{${v2}${
          units.v1 === units.v2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v2}}}}`
            : `\\text{ ${units.v2}}`
        }} = ${((v1 * t2) / v2).toFixed(2)}\\text{ ${units.t1}}`,
      };
    case "t2":
      return {
        equation: equationText,
        rearranged_equation: `T_2 = \\frac{V_2T_1}{V_1} \\quad \\Rightarrow \\frac{(${v2}\\text{ ${units.v2}})(${t1}\\text{ ${units.t1}})}{${v1}\\text{ ${units.v1}}}`,
        numerator_calculation: `(${v2}\\text{ ${
          units.v2
        }}) \\times (${t1}\\text{ ${units.t1}}) = ${v2 * t1}\\text{ ${
          units.v2
        }⋅${units.t1}}`,
        denominator_calculation: `(${v1}\\text{ ${units.v1}}) = ${v1}\\text{ ${units.v1}}`,
        final_calculation: `T_2 = \\frac{${v2}${
          units.v2 === units.v1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v2}}}}`
            : `\\text{ ${units.v2}}`
        } \\times ${t1}\\text{ ${units.t1}}}{${v1}${
          units.v2 === units.v1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v1}}}}`
            : `\\text{ ${units.v1}}`
        }} = ${((v2 * t1) / v1).toFixed(2)}\\text{ ${units.t2}}`,
      };
    default:
      return null;
  }
};

const combinedGasLawSolution = (
  p1: number,
  v1: number,
  t1: number,
  p2: number,
  v2: number,
  t2: number,
  target: string,
  units: Record<string, string>
) => {
  const equationText =
    "\\text{Combined Gas Law: } \\frac{P_1V_1}{T_1} = \\frac{P_2V_2}{T_2}";

  switch (target) {
    case "p1":
      return {
        equation: equationText,
        rearranged_equation: `P_1 = \\frac{P_2V_2T_1}{V_1T_2} \\quad \\Rightarrow \\frac{(${p2}\\text{ ${units.p2}})(${v2}\\text{ ${units.v2}})(${t1}\\text{ ${units.t1}})}{(${v1}\\text{ ${units.v1}})(${t2}\\text{ ${units.t2}})}`,
        numerator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${v2}\\text{ ${units.v2}}) \\times (${t1}\\text{ ${
          units.t1
        }}) = ${p2 * v2 * t1}\\text{ ${units.p2}⋅${units.v2}⋅${units.t1}}`,
        denominator_calculation: `(${v1}\\text{ ${
          units.v1
        }}) \\times (${t2}\\text{ ${units.t2}}) = ${v1 * t2}\\text{ ${
          units.v1
        }⋅${units.t2}}`,
        final_calculation: `\\frac{${p2}${
          units.p2 === units.p1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p2}}}}`
            : `\\text{ ${units.p2}}`
        } \\times ${v2}${
          units.v2 === units.v1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v2}}}}`
            : `\\text{ ${units.v2}}`
        } \\times ${t1}${
          units.t1 === units.t2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t1}}}}`
            : `\\text{ ${units.t1}}`
        }}{${v1}${
          units.v1 === units.v2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v1}}}}`
            : `\\text{ ${units.v1}}`
        } \\times ${t2}${
          units.t2 === units.t1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t2}}}}`
            : `\\text{ ${units.t2}}`
        }} = ${((p2 * v2 * t1) / (v1 * t2)).toFixed(2)}\\text{ ${units.p1}}`,
      };
    case "v1":
      return {
        equation: equationText,
        rearranged_equation: `V_1 = \\frac{P_2V_2T_1}{P_1T_2} \\quad \\Rightarrow \\frac{(${p2}\\text{ ${units.p2}})(${v2}\\text{ ${units.v2}})(${t1}\\text{ ${units.t1}})}{(${p1}\\text{ ${units.p1}})(${t2}\\text{ ${units.t2}})}`,
        numerator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${v2}\\text{ ${units.v2}}) \\times (${t1}\\text{ ${
          units.t1
        }}) = ${p2 * v2 * t1}\\text{ ${units.p2}⋅${units.v2}⋅${units.t1}}`,
        denominator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${t2}\\text{ ${units.t2}}) = ${p1 * t2}\\text{ ${
          units.p1
        }⋅${units.t2}}`,
        final_calculation: `\\frac{${p2}${
          units.p2 === units.p1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p2}}}}`
            : `\\text{ ${units.p2}}`
        } \\times ${v2}\\text{ ${units.v2}} \\times ${t1}${
          units.t1 === units.t2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t1}}}}`
            : `\\text{ ${units.t1}}`
        }}{${p1}${
          units.p1 === units.p2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p1}}}}`
            : `\\text{ ${units.p1}}`
        } \\times ${t2}${
          units.t2 === units.t1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t2}}}}`
            : `\\text{ ${units.t2}}`
        }} = ${((p2 * v2 * t1) / (p1 * t2)).toFixed(2)}\\text{ ${units.v1}}`,
      };
    case "t1":
      return {
        equation: equationText,
        rearranged_equation: `T_1 = \\frac{P_1V_1T_2}{P_2V_2} \\quad \\Rightarrow \\frac{(${p1}\\text{ ${units.p1}})(${v1}\\text{ ${units.v1}})(${t2}\\text{ ${units.t2}})}{(${p2}\\text{ ${units.p2}})(${v2}\\text{ ${units.v2}})}`,
        numerator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${v1}\\text{ ${units.v1}}) \\times (${t2}\\text{ ${
          units.t2
        }}) = ${p1 * v1 * t2}\\text{ ${units.p1}⋅${units.v1}⋅${units.t2}}`,
        denominator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${v2}\\text{ ${units.v2}}) = ${p2 * v2}\\text{ ${
          units.p2
        }⋅${units.v2}}`,
        final_calculation: `\\frac{${p1}${
          units.p1 === units.p2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p1}}}}`
            : `\\text{ ${units.p1}}`
        } \\times ${v1}${
          units.v1 === units.v2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v1}}}}`
            : `\\text{ ${units.v1}}`
        } \\times ${t2}\\text{ ${units.t2}}}{${p2}${
          units.p2 === units.p1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p2}}}}`
            : `\\text{ ${units.p2}}`
        } \\times ${v2}${
          units.v2 === units.v1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v2}}}}`
            : `\\text{ ${units.v2}}`
        }} = ${((p1 * v1 * t2) / (p2 * v2)).toFixed(2)}\\text{ ${units.t1}}`,
      };
    case "p2":
      return {
        equation: equationText,
        rearranged_equation: `P_2 = \\frac{P_1V_1T_2}{V_2T_1} \\quad \\Rightarrow \\frac{(${p1}\\text{ ${units.p1}})(${v1}\\text{ ${units.v1}})(${t2}\\text{ ${units.t2}})}{(${v2}\\text{ ${units.v2}})(${t1}\\text{ ${units.t1}})}`,
        numerator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${v1}\\text{ ${units.v1}}) \\times (${t2}\\text{ ${
          units.t2
        }}) = ${p1 * v1 * t2}\\text{ ${units.p1}⋅${units.v1}⋅${units.t2}}`,
        denominator_calculation: `(${v2}\\text{ ${
          units.v2
        }}) \\times (${t1}\\text{ ${units.t1}}) = ${v2 * t1}\\text{ ${
          units.v2
        }⋅${units.t1}}`,
        final_calculation: `\\frac{${p1}\\text{ ${units.p1}} \\times ${v1}${
          units.v1 === units.v2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v1}}}}`
            : `\\text{ ${units.v1}}`
        } \\times ${t2}${
          units.t2 === units.t1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t2}}}}`
            : `\\text{ ${units.t2}}`
        }}{${v2}${
          units.v2 === units.v1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v2}}}}`
            : `\\text{ ${units.v2}}`
        } \\times ${t1}${
          units.t1 === units.t2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t1}}}}`
            : `\\text{ ${units.t1}}`
        }} = ${((p1 * v1 * t2) / (v2 * t1)).toFixed(2)}\\text{ ${units.p2}}`,
      };
    case "v2":
      return {
        equation: equationText,
        rearranged_equation: `V_2 = \\frac{P_1V_1T_2}{P_2T_1} \\quad \\Rightarrow \\frac{(${p1}\\text{ ${units.p1}})(${v1}\\text{ ${units.v1}})(${t2}\\text{ ${units.t2}})}{(${p2}\\text{ ${units.p2}})(${t1}\\text{ ${units.t1}})}`,
        numerator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${v1}\\text{ ${units.v1}}) \\times (${t2}\\text{ ${
          units.t2
        }}) = ${p1 * v1 * t2}\\text{ ${units.p1}⋅${units.v1}⋅${units.t2}}`,
        denominator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${t1}\\text{ ${units.t1}}) = ${p2 * t1}\\text{ ${
          units.p2
        }⋅${units.t1}}`,
        final_calculation: `\\frac{${p1}${
          units.p1 === units.p2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p1}}}}`
            : `\\text{ ${units.p1}}`
        } \\times ${v1}\\text{ ${units.v1}} \\times ${t2}${
          units.t2 === units.t1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t2}}}}`
            : `\\text{ ${units.t2}}`
        }}{${p2}${
          units.p2 === units.p1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p2}}}}`
            : `\\text{ ${units.p2}}`
        } \\times ${t1}${
          units.t1 === units.t2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.t1}}}}`
            : `\\text{ ${units.t1}}`
        }} = ${((p1 * v1 * t2) / (p2 * t1)).toFixed(2)}\\text{ ${units.v2}}`,
      };
    case "t2":
      return {
        equation: equationText,
        rearranged_equation: `T_2 = \\frac{P_2V_2T_1}{P_1V_1} \\quad \\Rightarrow \\frac{(${p2}\\text{ ${units.p2}})(${v2}\\text{ ${units.v2}})(${t1}\\text{ ${units.t1}})}{(${p1}\\text{ ${units.p1}})(${v1}\\text{ ${units.v1}})}`,
        numerator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${v2}\\text{ ${units.v2}}) \\times (${t1}\\text{ ${
          units.t1
        }}) = ${p2 * v2 * t1}\\text{ ${units.p2}⋅${units.v2}⋅${units.t1}}`,
        denominator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${v1}\\text{ ${units.v1}}) = ${p1 * v1}\\text{ ${
          units.p1
        }⋅${units.v1}}`,
        final_calculation: `\\frac{${p2}${
          units.p2 === units.p1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p2}}}}`
            : `\\text{ ${units.p2}}`
        } \\times ${v2}${
          units.v2 === units.v1
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v2}}}}`
            : `\\text{ ${units.v2}}`
        } \\times ${t1}\\text{ ${units.t1}}}{${p1}${
          units.p1 === units.p2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.p1}}}}`
            : `\\text{ ${units.p1}}`
        } \\times ${v1}${
          units.v1 === units.v2
            ? `\\textcolor{red}{\\cancel{\\text{ ${units.v1}}}}`
            : `\\text{ ${units.v1}}`
        }} = ${((p2 * v2 * t1) / (p1 * v1)).toFixed(2)}\\text{ ${units.t2}}`,
      };
    default:
      return null;
  }
};

const idealGasLawSolution = (
  p: number,
  v: number,
  n: number,
  t: number,
  target: string,
  units: Record<string, string>
) => {
  const equationText = "\\text{Ideal Gas Law: } PV = nRT";

  // Get the appropriate gas constant based on pressure units
  const pressureUnit = units.p;
  const R = parseFloat(
    GAS_CONSTANTS[pressureUnit as keyof typeof GAS_CONSTANTS]?.value || "0.0821"
  );
  const rUnit =
    GAS_CONSTANTS[pressureUnit as keyof typeof GAS_CONSTANTS]?.unit ||
    "L⋅atm/mol⋅K";

  switch (target) {
    case "p":
      return {
        equation: equationText,
        rearranged_equation: `P = \\frac{nRT}{V} \\quad \\Rightarrow \\frac{(${n}\\text{ mol})(${R}\\text{ ${rUnit}})(${t}\\text{ K})}{${v}\\text{ L}}`,
        numerator_calculation: `(${n}\\text{ mol}) \\times (${R}\\text{ ${rUnit}}) \\times (${t}\\text{ K}) = ${(
          n *
          R *
          t
        ).toFixed(4)}\\text{ ${units.p}⋅L}`,
        denominator_calculation: `${v}\\text{ L}`,
        final_calculation: `\\frac{${n}\\textcolor{red}{\\cancel{\\text{ mol}}} \\times ${R}\\text{ ${
          units.p
        }⋅}\\textcolor{red}{\\cancel{\\text{L}}}\\text{/}\\textcolor{red}{\\cancel{\\text{mol⋅K}}} \\times ${t}\\textcolor{red}{\\cancel{\\text{ K}}}}{${v}\\textcolor{red}{\\cancel{\\text{ L}}}} = ${(
          (n * R * t) /
          v
        ).toFixed(4)}\\text{ ${units.p}}`,
      };
    case "v":
      return {
        equation: equationText,
        rearranged_equation: `V = \\frac{nRT}{P} \\quad \\Rightarrow \\frac{(${n}\\text{ mol})(${R}\\text{ ${rUnit}})(${t}\\text{ K})}{${p}\\text{ ${units.p}}}`,
        numerator_calculation: `(${n}\\text{ mol}) \\times (${R}\\text{ ${rUnit}}) \\times (${t}\\text{ K}) = ${(
          n *
          R *
          t
        ).toFixed(4)}\\text{ ${units.p}⋅L}`,
        denominator_calculation: `${p}\\text{ ${units.p}}`,
        final_calculation: `\\frac{${n}\\textcolor{red}{\\cancel{\\text{ mol}}} \\times ${R}\\textcolor{red}{\\cancel{\\text{ ${
          units.p
        }}}}\\text{⋅L/}\\textcolor{red}{\\cancel{\\text{mol}}}\\text{⋅}\\textcolor{red}{\\cancel{\\text{K}}} \\times ${t}\\textcolor{red}{\\cancel{\\text{ K}}}}{${p}\\textcolor{red}{\\cancel{\\text{ ${
          units.p
        }}}}} = ${((n * R * t) / p).toFixed(4)}\\text{ L}`,
      };
    case "n":
      return {
        equation: equationText,
        rearranged_equation: `n = \\frac{PV}{RT} \\quad \\Rightarrow \\frac{(${p}\\text{ ${units.p}})(${v}\\text{ L})}{(${R}\\text{ ${rUnit}})(${t}\\text{ K})}`,
        numerator_calculation: `(${p}\\text{ ${
          units.p
        }}) \\times (${v}\\text{ L}) = ${(p * v).toFixed(4)}\\text{ ${
          units.p
        }⋅L}`,
        denominator_calculation: `(${R}\\text{ ${rUnit}}) \\times (${t}\\text{ K}) = ${(
          R * t
        ).toFixed(4)}\\text{ ${units.p}⋅L/mol⋅K}`,
        final_calculation: `\\frac{${p}\\textcolor{red}{\\cancel{\\text{ ${
          units.p
        }}}} \\times ${v}\\textcolor{red}{\\cancel{\\text{ L}}}}{${R}\\textcolor{red}{\\cancel{\\text{ ${
          units.p
        }}}}\\textcolor{red}{\\cancel{\\text{⋅L}}}\\text{/mol⋅}\\textcolor{red}{\\cancel{\\text{K}}} \\times ${t}\\textcolor{red}{\\cancel{\\text{ K}}}} = ${(
          (p * v) /
          (R * t)
        ).toFixed(4)}\\text{ mol}`,
      };
    case "t":
      return {
        equation: equationText,
        rearranged_equation: `T = \\frac{PV}{nR} \\quad \\Rightarrow \\frac{(${p}\\text{ ${units.p}})(${v}\\text{ L})}{(${n}\\text{ mol})(${R}\\text{ ${rUnit}})}`,
        numerator_calculation: `(${p}\\text{ ${
          units.p
        }}) \\times (${v}\\text{ L}) = ${(p * v).toFixed(4)}\\text{ ${
          units.p
        }⋅L}`,
        denominator_calculation: `(${n}\\text{ mol}) \\times (${R}\\text{ ${rUnit}}) = ${(
          n * R
        ).toFixed(4)}\\text{ ${units.p}⋅L/mol⋅K}`,
        final_calculation: `\\frac{${p}\\textcolor{red}{\\cancel{\\text{ ${
          units.p
        }}}} \\times ${v}\\textcolor{red}{\\cancel{\\text{ L}}}}{${n}\\textcolor{red}{\\cancel{\\text{ mol}}} \\times ${R}\\textcolor{red}{\\cancel{\\text{ ${
          units.p
        }}}}\\textcolor{red}{\\cancel{\\text{⋅L}}}\\text{/}\\textcolor{red}{\\cancel{\\text{mol}}}\\text{⋅K}} = ${(
          (p * v) /
          (n * R)
        ).toFixed(4)}\\text{ K}`,
      };
    default:
      return null;
  }
};

const avogadrosLawSolution = (
  v1: number,
  n1: number,
  v2: number,
  n2: number,
  target: string,
  units: Record<string, string>
) => {
  const equationText =
    "\\text{Avogadro's Law: } \\frac{V_1}{n_1} = \\frac{V_2}{n_2}";

  switch (target) {
    case "v1":
      return {
        equation: equationText,
        rearranged_equation: `V_1 = \\frac{V_2n_1}{n_2} \\quad \\Rightarrow \\frac{(${v2}\\text{ ${units.v2}})(${n1}\\text{ mol})}{${n2}\\text{ mol}}`,
        numerator_calculation: `(${v2}\\text{ ${
          units.v2
        }}) \\times (${n1}\\text{ mol}) = ${v2 * n1}\\text{ ${units.v2}⋅mol}`,
        denominator_calculation: `(${n2}\\text{ mol}) = ${n2}\\text{ mol}`,
        final_calculation: `\\frac{${v2}\\text{ ${
          units.v2
        }} \\times ${n1}\\textcolor{red}{\\cancel{\\text{ mol}}}}{${n2}\\textcolor{red}{\\cancel{\\text{ mol}}}} = ${(
          (v2 * n1) /
          n2
        ).toFixed(2)}\\text{ ${units.v1}}`,
      };
    case "v2":
      return {
        equation: equationText,
        rearranged_equation: `V_2 = \\frac{V_1n_2}{n_1} \\quad \\Rightarrow \\frac{(${v1}\\text{ ${units.v1}})(${n2}\\text{ mol})}{${n1}\\text{ mol}}`,
        numerator_calculation: `(${v1}\\text{ ${
          units.v1
        }}) \\times (${n2}\\text{ mol}) = ${v1 * n2}\\text{ ${units.v1}⋅mol}`,
        denominator_calculation: `(${n1}\\text{ mol}) = ${n1}\\text{ mol}`,
        final_calculation: `\\frac{${v1}\\text{ ${
          units.v1
        }} \\times ${n2}\\textcolor{red}{\\cancel{\\text{ mol}}}}{${n1}\\textcolor{red}{\\cancel{\\text{ mol}}}} = ${(
          (v1 * n2) /
          n1
        ).toFixed(2)}\\text{ ${units.v2}}`,
      };
    case "n1":
      return {
        equation: equationText,
        rearranged_equation: `n_1 = \\frac{V_1n_2}{V_2} \\quad \\Rightarrow \\frac{(${v1}\\text{ ${units.v1}})(${n2}\\text{ mol})}{${v2}\\text{ ${units.v2}}}`,
        numerator_calculation: `(${v1}\\text{ ${
          units.v1
        }}) \\times (${n2}\\text{ mol}) = ${v1 * n2}\\text{ ${units.v1}⋅mol}`,
        denominator_calculation: `(${v2}\\text{ ${units.v2}}) = ${v2}\\text{ ${units.v2}}`,
        final_calculation: `\\frac{${v1}\\textcolor{red}{\\cancel{\\text{ ${
          units.v1
        }}}} \\times ${n2}\\text{ mol}}{${v2}\\textcolor{red}{\\cancel{\\text{ ${
          units.v2
        }}}}} = ${((v1 * n2) / v2).toFixed(2)}\\text{ mol}`,
      };
    case "n2":
      return {
        equation: equationText,
        rearranged_equation: `n_2 = \\frac{V_2n_1}{V_1} \\quad \\Rightarrow \\frac{(${v2}\\text{ ${units.v2}})(${n1}\\text{ mol})}{${v1}\\text{ ${units.v1}}}`,
        numerator_calculation: `(${v2}\\text{ ${
          units.v2
        }}) \\times (${n1}\\text{ mol}) = ${v2 * n1}\\text{ ${units.v2}⋅mol}`,
        denominator_calculation: `(${v1}\\text{ ${units.v1}}) = ${v1}\\text{ ${units.v1}}`,
        final_calculation: `\\frac{${v2}\\textcolor{red}{\\cancel{\\text{ ${
          units.v2
        }}}} \\times ${n1}\\text{ mol}}{${v1}\\textcolor{red}{\\cancel{\\text{ ${
          units.v1
        }}}}} = ${((v2 * n1) / v1).toFixed(2)}\\text{ mol}`,
      };
    default:
      return null;
  }
};

const gayLussacsLawSolution = (
  p1: number,
  t1: number,
  p2: number,
  t2: number,
  target: string,
  units: Record<string, string>
) => {
  const equationText =
    "\\text{Gay-Lussac's Law: } \\frac{P_1}{T_1} = \\frac{P_2}{T_2}";
  switch (target) {
    case "p1":
      return {
        equation: equationText,
        rearranged_equation: `P_1 = \\frac{P_2T_1}{T_2} \\quad \\Rightarrow \\frac{(${p2}\\text{ ${units.p2}})(${t1}\\text{ ${units.t1}})}{${t2}\\text{ ${units.t2}}}`,
        numerator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${t1}\\text{ ${units.t1}}) = ${p2 * t1}\\text{ ${
          units.p2
        }⋅${units.t1}}`,
        denominator_calculation: `(${t2}\\text{ ${units.t2}}) = ${t2}\\text{ ${units.t2}}`,
        final_calculation: `\\frac{${p2}\\text{ ${
          units.p2
        }} \\times ${t1}\\textcolor{red}{\\cancel{\\text{ ${
          units.t1
        }}}}}{${t2}\\textcolor{red}{\\cancel{\\text{ ${units.t2}}}}} = ${(
          (p2 * t1) /
          t2
        ).toFixed(2)}\\text{ ${units.p1}}`,
      };
    case "p2":
      return {
        equation: equationText,
        rearranged_equation: `P_2 = \\frac{P_1T_2}{T_1} \\quad \\Rightarrow \\frac{(${p1}\\text{ ${units.p1}})(${t2}\\text{ ${units.t2}})}{${t1}\\text{ ${units.t1}}}`,
        numerator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${t2}\\text{ ${units.t2}}) = ${p1 * t2}\\text{ ${
          units.p1
        }⋅${units.t2}}`,
        denominator_calculation: `(${t1}\\text{ ${units.t1}}) = ${t1}\\text{ ${units.t1}}`,
        final_calculation: `\\frac{${p1}\\text{ ${
          units.p1
        }} \\times ${t2}\\textcolor{red}{\\cancel{\\text{ ${
          units.t2
        }}}}}{${t1}\\textcolor{red}{\\cancel{\\text{ ${units.t1}}}}} = ${(
          (p1 * t2) /
          t1
        ).toFixed(2)}\\text{ ${units.p2}}`,
      };
    case "t1":
      return {
        equation: equationText,
        rearranged_equation: `T_1 = \\frac{P_1T_2}{P_2} \\quad \\Rightarrow \\frac{(${p1}\\text{ ${units.p1}})(${t2}\\text{ ${units.t2}})}{${p2}\\text{ ${units.p2}}}`,
        numerator_calculation: `(${p1}\\text{ ${
          units.p1
        }}) \\times (${t2}\\text{ ${units.t2}}) = ${p1 * t2}\\text{ ${
          units.p1
        }⋅${units.t2}}`,
        denominator_calculation: `(${p2}\\text{ ${units.p2}}) = ${p2}\\text{ ${units.p2}}`,
        final_calculation: `\\frac{${p1}\\textcolor{red}{\\cancel{\\text{ ${
          units.p1
        }}}} \\times ${t2}\\text{ ${
          units.t2
        }}}{${p2}\\textcolor{red}{\\cancel{\\text{ ${units.p2}}}}} = ${(
          (p1 * t2) /
          p2
        ).toFixed(2)}\\text{ ${units.t1}}`,
      };
    case "t2":
      return {
        equation: equationText,
        rearranged_equation: `T_2 = \\frac{P_2T_1}{P_1} \\quad \\Rightarrow \\frac{(${p2}\\text{ ${units.p2}})(${t1}\\text{ ${units.t1}})}{${p1}\\text{ ${units.p1}}}`,
        numerator_calculation: `(${p2}\\text{ ${
          units.p2
        }}) \\times (${t1}\\text{ ${units.t1}}) = ${p2 * t1}\\text{ ${
          units.p2
        }⋅${units.t1}}`,
        denominator_calculation: `(${p1}\\text{ ${units.p1}}) = ${p1}\\text{ ${units.p1}}`,
        final_calculation: `\\frac{${p2}\\textcolor{red}{\\cancel{\\text{ ${
          units.p2
        }}}} \\times ${t1}\\text{ ${
          units.t1
        }}}{${p1}\\textcolor{red}{\\cancel{\\text{ ${units.p1}}}}} = ${(
          (p2 * t1) /
          p1
        ).toFixed(2)}\\text{ ${units.t2}}`,
      };
    default:
      return null;
  }
};
