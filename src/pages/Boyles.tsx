/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";

import { BOYLES_LAW_INFO } from "@/lib/constants";

import { useGasLaw } from "@/contexts/GasLawProvider";
import { CollissionCounter } from "@/components/model/CollissionCounter";
import { InfoSheet } from "@/components/InfoSheet";

import GasLawsSimulation from "@/components/model/Model";
import GasLawInputGroup from "@/components/model/Parameters";
import { GasLawType, SolutionSheet } from "@/components/SolutionSheet";
import ProblemsSlide from "@/components/ProblemsSlide";
import SimulationControlSelector, {
  SimulationControlState,
  ControlType,
  ValueType,
} from "@/components/model/SimulationControlSelector";

export default function BoylesLaw() {
  const { result } = useGasLaw();
  const [values, setValues] = useState<Record<string, string>>({
    v1: "",
    p1: "",
    v2: "",
    p2: "",
    t: "295",
    n: "0",
  });
  const [units, setUnits] = useState<Record<string, string>>({
    v1: "L",
    p1: "atm",
    v2: "L",
    p2: "atm",
    t: "K",
    n: "mol",
  });
  const [controlState, setControlState] = useState<SimulationControlState>({
    volume: "initial",
    temperature: "initial",
    pressure: "initial",
    pump: "initial",
  });

  const handleSimulationVolumeChange = (
    volume: number,
    target: "initial" | "final"
  ) => {
    // Round to 2 decimal places for better UX
    const roundedVolume = Math.round(volume * 100) / 100;

    // Update based on the target parameter from control state
    if (target === "initial") {
      setValues((prev) => ({ ...prev, v1: roundedVolume.toString() }));
    } else {
      setValues((prev) => ({ ...prev, v2: roundedVolume.toString() }));
    }
  };

  const handleSimulationPressureChange = (
    pressure: number,
    target: "initial" | "final"
  ) => {
    // Round to 2 decimal places for better UX
    const roundedPressure = Math.round(pressure * 100) / 100;

    // Update based on the target parameter from control state
    if (target === "initial") {
      setValues((prev) => ({ ...prev, p1: roundedPressure.toString() }));
    } else {
      setValues((prev) => ({ ...prev, p2: roundedPressure.toString() }));
    }
  };

  const handleControlStateChange = (
    controlType: ControlType,
    valueType: ValueType
  ) => {
    setControlState((prev) => ({
      ...prev,
      [controlType]: valueType,
    }));
  };

  const simulationProps = useMemo(() => {
    const props: any = {
      gasLaw: "boyles",
      initialVolume: parseFloat(values.v1) || 0,
      finalVolume: parseFloat(values.v2) || 0,
      volumeUnit: units.v1,
      moleculeCount: 0,
      temperatureUnit: units.t,
      initialPressure: parseFloat(values.p1) || 0,
      finalPressure: parseFloat(values.p2) || 0,
      pressureUnit: units.p1,
      onVolumeChange: handleSimulationVolumeChange,
      onPressureChange: handleSimulationPressureChange,
      controlState: controlState,
    };

    if (result?.target === "v1") {
      props.initialVolume = parseFloat(result.value) || 0;
      props.finalVolume = parseFloat(values.v2) || 0;
    } else if (result?.target === "v2") {
      props.initialVolume = parseFloat(values.v1) || 0;
      props.finalVolume = parseFloat(result.value) || 0;
    } else if (result?.target === "p1") {
      props.initialPressure = parseFloat(result.value) || 0;
      props.finalPressure = parseFloat(values.p2) || 0;
    } else if (result?.target === "p2") {
      props.initialPressure = parseFloat(values.p1) || 0;
      props.finalPressure = parseFloat(result.value) || 0;
    }
    return props;
  }, [result, values, units, controlState]);

  const handleValueChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleUnitChange = (id: string, unit: string) => {
    setUnits((prev) => ({ ...prev, [id]: unit }));
  };

  return (
    <div className="flex items-center w-full justify-center h-[95%] relative info-sheet-tour-start">
      <div className="absolute top-4 z-10 left-2">
        <div className="space-y-2">
          <SimulationControlSelector
            gasLaw="boyles"
            controlState={controlState}
            onControlStateChange={handleControlStateChange}
            calculatedResult={result}
          />
          <GasLawInputGroup
            lawType="boyles"
            values={values}
            units={units}
            onValueChange={handleValueChange}
            onUnitChange={handleUnitChange}
            disabledFields={[
              "n",
              "t",
              ...(result?.target ? [result.target] : []),
            ]}
            className="boyles-law-input-group"
            onControlStateChange={handleControlStateChange}
            controlState={controlState}
          />
          <CollissionCounter />
        </div>
      </div>
      <div className="absolute top-4 z-10 right-2 flex items-end flex-col gap-2">
        <InfoSheet {...BOYLES_LAW_INFO} />
        <SolutionSheet
          lawType={GasLawType.BOYLES_LAW}
          result={result ?? undefined}
          values={values}
          units={units}
        />
        <ProblemsSlide type="boyles" />
      </div>
      <GasLawsSimulation {...simulationProps} />
    </div>
  );
}
