/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useGasLaw } from "@/contexts/GasLawProvider";
import GasLawsSimulation from "@/components/model/Model";
import GasLawInputGroup from "@/components/model/Parameters";
import { CollissionCounter } from "@/components/model/CollissionCounter";
import { InfoSheet } from "@/components/InfoSheet";
import { CHARLES_LAW_INFO } from "@/lib/constants";
import { GasLawType, SolutionSheet } from "@/components/SolutionSheet";
import ProblemsSlide from "@/components/ProblemsSlide";
import SimulationControlSelector, {
  SimulationControlState,
  ControlType,
  ValueType,
} from "@/components/model/SimulationControlSelector";

export default function Charles() {
  const { result } = useGasLaw();
  const [values, setValues] = useState<Record<string, string>>({
    v1: "",
    t1: "",
    v2: "",
    t2: "",
    p: "1",
    n: "0",
  });
  const [units, setUnits] = useState<Record<string, string>>({
    v1: "L",
    t1: "K",
    v2: "L",
    t2: "K",
    p: "atm",
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

  const handleTemperatureChange = (
    temperature: number,
    target: "initial" | "final"
  ) => {
    // Round to 1 decimal place for better UX
    const roundedTemp = Math.round(temperature * 10) / 10;

    // Update based on the target parameter
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
    // Create simulation props object
    const props: any = {
      gasLaw: "charles",
      initialVolume: parseFloat(values.v1) || 0,
      finalVolume: parseFloat(values.v2) || 0,
      volumeUnit: units.v1,
      initialTemperature: parseFloat(values.t1) || 0,
      finalTemperature: parseFloat(values.t2) || 0,
      temperatureUnit: units.t1,
      moleculeCount: 0,
      onVolumeChange: handleSimulationVolumeChange,
      onTemperatureChange: handleTemperatureChange,
      controlState: controlState,
    };

    // Update with calculation results if available
    if (result?.target === "v1") {
      props.initialVolume = parseFloat(result.value) || 0;
    } else if (result?.target === "v2") {
      props.finalVolume = parseFloat(result.value) || 0;
    } else if (result?.target === "t1") {
      props.initialTemperature = parseFloat(result.value) || 0;
    } else if (result?.target === "t2") {
      props.finalTemperature = parseFloat(result.value) || 0;
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
    <div className="flex items-center w-full justify-center h-[95%] relative">
      <div className="absolute top-4 z-10 left-2">
        <div className="space-y-2">
          <SimulationControlSelector
            gasLaw="charles"
            controlState={controlState}
            onControlStateChange={handleControlStateChange}
            calculatedResult={result}
          />
          <GasLawInputGroup
            lawType="charles"
            values={values}
            units={units}
            onValueChange={handleValueChange}
            onUnitChange={handleUnitChange}
            disabledFields={[
              "n",
              "p",
              ...(result?.target ? [result.target] : []),
            ]}
            onControlStateChange={handleControlStateChange}
            controlState={controlState}
          />
          <CollissionCounter />
        </div>
      </div>
      <div className="absolute top-4 z-10 right-2 flex items-end flex-col gap-2">
        <InfoSheet {...CHARLES_LAW_INFO} />
        <SolutionSheet
          lawType={GasLawType.CHARLES_LAW}
          result={result ?? undefined}
          values={values}
          units={units}
        />
        <ProblemsSlide type="charles" />
      </div>
      <GasLawsSimulation {...simulationProps} />
    </div>
  );
}
