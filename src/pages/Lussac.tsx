/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useGasLaw } from "@/contexts/GasLawProvider";

import GasLawsSimulation from "@/components/model/Model";
import GasLawInputGroup from "@/components/model/Parameters";
import { CollissionCounter } from "@/components/model/CollissionCounter";
import { InfoSheet } from "@/components/InfoSheet";
import { LUSSAC_LAW_INFO } from "@/lib/constants";
import { GasLawType, SolutionSheet } from "@/components/SolutionSheet";
import ProblemsSlide from "@/components/ProblemsSlide";
import SimulationControlSelector, {
  SimulationControlState,
  ControlType,
  ValueType,
} from "@/components/model/SimulationControlSelector";

export default function Lussac() {
  const { result } = useGasLaw();
  const [values, setValues] = useState<Record<string, string>>({
    p1: "",
    t1: "",
    p2: "",
    t2: "",
    v: "100",
    n: "0",
  });
  const [units, setUnits] = useState<Record<string, string>>({
    p1: "atm",
    t1: "K",
    p2: "atm",
    t2: "K",
    v: "L",
    n: "mol",
  });
  const [controlState, setControlState] = useState<SimulationControlState>({
    volume: "initial",
    temperature: "initial",
    pressure: "initial",
    pump: "initial",
  });

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
      gasLaw: "gayLussac",
      initialTemperature: parseFloat(values.t1) || 0,
      finalTemperature: parseFloat(values.t2) || 0,
      temperatureUnit: units.t1,
      moleculeCount: 0,
      finalVolume: 10,
      volumeUnit: "L",
      initialPressure: parseFloat(values.p1) || 0,
      finalPressure: parseFloat(values.p2) || 0,
      pressureUnit: units.p1,
      onPressureChange: handleSimulationPressureChange,
      onTemperatureChange: handleTemperatureChange,
      controlState: controlState,
    };

    if (result?.target === "t1") {
      props.initialTemperature = parseFloat(result.value) || 0;
      props.finalTemperature = parseFloat(values.t2) || 0;
    } else if (result?.target === "t2") {
      props.initialTemperature = parseFloat(values.t1) || 0;
      props.finalTemperature = parseFloat(result.value) || 0;
    } else if (result?.target === "p1") {
      props.initialPressure = parseFloat(result.value) || 0;
      props.finalPressure = parseFloat(values.p2) || 0;
    } else if (result?.target === "p2") {
      props.initialPressure = parseFloat(values.p1) || 0;
      props.finalPressure = parseFloat(result.value) || 0;
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
            gasLaw="gayLussac"
            controlState={controlState}
            onControlStateChange={handleControlStateChange}
          />
          <GasLawInputGroup
            lawType="gayLussac"
            values={values}
            units={units}
            onValueChange={handleValueChange}
            onUnitChange={handleUnitChange}
            disabledFields={[
              "v",
              "n",
              ...(result?.target ? [result.target] : []),
            ]}
          />
          <CollissionCounter />
        </div>
      </div>
      <div className="absolute top-4 z-10 right-2 flex items-end flex-col gap-2">
        <InfoSheet {...LUSSAC_LAW_INFO} />
        <SolutionSheet
          lawType={GasLawType.GAY_LUSSACS_LAW}
          result={result ?? undefined}
          values={values}
          units={units}
        />
        <ProblemsSlide type="gay-lussac" />
      </div>
      <GasLawsSimulation {...simulationProps} />
    </div>
  );
}
