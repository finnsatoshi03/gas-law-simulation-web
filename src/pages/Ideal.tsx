/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useGasLaw } from "@/contexts/GasLawProvider";
import GasLawsSimulation from "@/components/model/Model";
import GasLawInputGroup from "@/components/model/Parameters";
import { CollissionCounter } from "@/components/model/CollissionCounter";
import { InfoSheet } from "@/components/InfoSheet";
import { IDEAL_LAW_INFO } from "@/lib/constants";
import { GasLawType, SolutionSheet } from "@/components/SolutionSheet";
import ProblemsSlide from "@/components/ProblemsSlide";
import SimulationControlSelector, {
  SimulationControlState,
  ControlType,
  ValueType,
} from "@/components/model/SimulationControlSelector";

export default function Ideal() {
  const { result } = useGasLaw();
  const [values, setValues] = useState<Record<string, string>>({
    p: "",
    v: "",
    n: "",
    t: "",
  });
  const [units, setUnits] = useState<Record<string, string>>({
    p: "atm",
    v: "L",
    n: "mol",
    t: "K",
  });
  const [controlState, setControlState] = useState<SimulationControlState>({
    volume: "initial",
    temperature: "initial",
    pressure: "initial",
    pump: "initial",
  });

  const handleSimulationVolumeChange = (
    volume: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    target: "initial" | "final"
  ) => {
    // Round to 2 decimal places for better UX
    const roundedVolume = Math.round(volume * 100) / 100;

    // Only update if volume is not the calculated result
    if (result?.target !== "v") {
      setValues((prev) => ({ ...prev, v: roundedVolume.toString() }));
    }
  };

  const handleSimulationPressureChange = (
    pressure: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    target: "initial" | "final"
  ) => {
    // Round to 2 decimal places for better UX
    const roundedPressure = Math.round(pressure * 100) / 100;

    // For ideal gas law, we only have single values, so ignore target parameter
    // Only update if pressure is not the calculated result
    if (result?.target !== "p") {
      setValues((prev) => ({ ...prev, p: roundedPressure.toString() }));
    }
  };

  const handleTemperatureChange = (
    temperature: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    target: "initial" | "final"
  ) => {
    // Round to 1 decimal place for better UX
    const roundedTemp = Math.round(temperature * 10) / 10;

    // For ideal gas law, we only have single values, so ignore target parameter
    // Only update if temperature is not the calculated result
    if (result?.target !== "t") {
      setValues((prev) => ({ ...prev, t: roundedTemp.toString() }));
    }
  };

  const handleSimulationMoleculeCountChange = (count: number) => {
    // Only update if number of moles is not the calculated result
    if (result?.target !== "n") {
      setValues((prev) => ({ ...prev, n: count.toString() }));
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
      gasLaw: "ideal",
      finalPressure: parseFloat(values.p) || 0,
      finalVolume: parseFloat(values.v) || 0,
      finalTemperature: parseFloat(values.t) || 0,
      moleculeCount: parseFloat(values.n) || 0,
      pressureUnit: units.p,
      volumeUnit: units.v,
      temperatureUnit: units.t,
      onVolumeChange: handleSimulationVolumeChange,
      onPressureChange: handleSimulationPressureChange,
      onTemperatureChange: handleTemperatureChange,
      onMoleculeCountChange: handleSimulationMoleculeCountChange,
      controlState: controlState,
    };

    // Handle calculated values from gas law context
    if (result?.target) {
      switch (result.target) {
        case "p":
          props.finalPressure = parseFloat(result.value) || 0;
          break;
        case "v":
          props.finalVolume = parseFloat(result.value) || 0;
          break;
        case "n":
          props.moleculeCount = parseFloat(result.value) || 0;
          break;
        case "t":
          props.finalTemperature = parseFloat(result.value) || 0;
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
            gasLaw="ideal"
            controlState={controlState}
            onControlStateChange={handleControlStateChange}
          />
          <GasLawInputGroup
            lawType="ideal"
            values={values}
            units={units}
            onValueChange={handleValueChange}
            onUnitChange={handleUnitChange}
            disabledFields={result?.target ? [result.target] : []}
          />
          <CollissionCounter />
        </div>
      </div>
      <div className="absolute top-4 z-10 right-2 flex items-end flex-col gap-2">
        <InfoSheet {...IDEAL_LAW_INFO} />
        <SolutionSheet
          lawType={GasLawType.IDEAL_GAS_LAW}
          result={result ?? undefined}
          values={values}
          units={units}
        />
        <ProblemsSlide type="ideal" />
      </div>
      <GasLawsSimulation {...simulationProps} />
    </div>
  );
}
