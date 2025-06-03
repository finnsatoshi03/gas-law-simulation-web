/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useGasLaw } from "@/contexts/GasLawProvider";
import GasLawsSimulation from "@/components/model/Model";
import GasLawInputGroup from "@/components/model/Parameters";
import { CollissionCounter } from "@/components/model/CollissionCounter";
import { InfoSheet } from "@/components/InfoSheet";
import { COMBINED_LAW_INFO } from "@/lib/constants";
import { GasLawType, SolutionSheet } from "@/components/SolutionSheet";
import ProblemsSlide from "@/components/ProblemsSlide";
import SimulationControlSelector, {
  SimulationControlState,
  ControlType,
  ValueType,
} from "@/components/model/SimulationControlSelector";

export default function Combined() {
  const { result } = useGasLaw();
  const [values, setValues] = useState<Record<string, string>>({
    p1: "",
    t1: "",
    v1: "",
    p2: "",
    t2: "",
    v2: "",
    n: "0",
  });
  const [units, setUnits] = useState<Record<string, string>>({
    p1: "atm",
    t1: "K",
    v1: "L",
    p2: "atm",
    t2: "K",
    v2: "L",
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

  const handleTemperatureChange = (
    temperature: number,
    target: "initial" | "final"
  ) => {
    // Round to 1 decimal place for better UX
    const roundedTemp = Math.round(temperature * 10) / 10;

    // Update based on the target parameter from control state
    if (target === "initial") {
      setValues((prev) => ({ ...prev, t1: roundedTemp.toString() }));
    } else {
      setValues((prev) => ({ ...prev, t2: roundedTemp.toString() }));
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
      gasLaw: "combined",
      initialTemperature: parseFloat(values.t1) || 0,
      finalTemperature: parseFloat(values.t2) || 0,
      temperatureUnit: units.t1,
      initialPressure: parseFloat(values.p1) || 0,
      finalPressure: parseFloat(values.p2) || 0,
      pressureUnit: units.p1,
      initialVolume: parseFloat(values.v1) || 0,
      finalVolume: parseFloat(values.v2) || 0,
      volumeUnit: units.v1,
      moleculeCount: 0,
      onVolumeChange: handleSimulationVolumeChange,
      onPressureChange: handleSimulationPressureChange,
      onTemperatureChange: handleTemperatureChange,
      controlState: controlState,
    };

    // Handle calculated values from gas law context
    if (result?.target) {
      switch (result.target) {
        case "p1":
          props.initialPressure = parseFloat(result.value) || 0;
          break;
        case "p2":
          props.finalPressure = parseFloat(result.value) || 0;
          break;
        case "t1":
          props.initialTemperature = parseFloat(result.value) || 0;
          break;
        case "t2":
          props.finalTemperature = parseFloat(result.value) || 0;
          break;
        case "v1":
          props.initialVolume = parseFloat(result.value) || 0;
          break;
        case "v2":
          props.finalVolume = parseFloat(result.value) || 0;
          break;
      }
    }

    return props;
  }, [result, values, units]);

  const handleValueChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleUnitChange = (id: string, unit: string) => {
    setUnits((prev) => ({ ...prev, [id]: unit }));
  };

  return (
    <div className="flex items-center w-full justify-center h-[95%] relative">
      <div className="absolute top-4 z-10 left-2">
        <div className="space-y-2">
          <SimulationControlSelector
            gasLaw="combined"
            controlState={controlState}
            onControlStateChange={handleControlStateChange}
          />
          <GasLawInputGroup
            lawType="combined"
            values={values}
            units={units}
            onValueChange={handleValueChange}
            onUnitChange={handleUnitChange}
            disabledFields={["n", ...(result?.target ? [result.target] : [])]}
          />
          <CollissionCounter />
        </div>
      </div>
      <div className="absolute top-4 z-10 right-2 flex items-end flex-col gap-2">
        <InfoSheet {...COMBINED_LAW_INFO} />
        <SolutionSheet
          lawType={GasLawType.COMBINED_GAS_LAW}
          result={result ?? undefined}
          values={values}
          units={units}
        />
        <ProblemsSlide type="combined" />
      </div>
      <GasLawsSimulation {...simulationProps} />
    </div>
  );
}
