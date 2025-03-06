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

  const handleSimulationVolumeChange = (volume: number) => {
    // Round to 2 decimal places for better UX
    const roundedVolume = Math.round(volume * 100) / 100;

    // Determine which volume to update based on which one is not the result
    if (result?.target === "v1") {
      setValues((prev) => ({ ...prev, v2: roundedVolume.toString() }));
    } else if (result?.target === "v2") {
      setValues((prev) => ({ ...prev, v1: roundedVolume.toString() }));
    } else {
      // If no result is set, update v1 by default
      setValues((prev) => ({ ...prev, v1: roundedVolume.toString() }));
    }
  };

  const handleSimulationPressureChange = (pressure: number) => {
    // Round to 2 decimal places for better UX
    const roundedPressure = Math.round(pressure * 100) / 100;

    // Determine which pressure to update based on which one is not the result
    if (result?.target === "p1") {
      setValues((prev) => ({ ...prev, p2: roundedPressure.toString() }));
    } else if (result?.target === "p2") {
      setValues((prev) => ({ ...prev, p1: roundedPressure.toString() }));
    } else {
      // If no result is set, update p1 by default
      setValues((prev) => ({ ...prev, p1: roundedPressure.toString() }));
    }
  };

  const handleTemperatureChange = (temperature: number) => {
    // Round to 1 decimal place for better UX
    const roundedTemp = Math.round(temperature * 10) / 10;

    // Determine which temperature to update based on which one is not the result
    if (result?.target === "t1") {
      setValues((prev) => ({ ...prev, t2: roundedTemp.toString() }));
    } else if (result?.target === "t2") {
      setValues((prev) => ({ ...prev, t1: roundedTemp.toString() }));
    } else {
      // If no result is set, update t1 by default
      setValues((prev) => ({ ...prev, t1: roundedTemp.toString() }));
    }
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
