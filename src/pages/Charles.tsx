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
      gasLaw: "charles",
      initialVolume: parseFloat(values.v1) || 0,
      finalVolume: parseFloat(values.v2) || 0,
      volumeUnit: units.v1,
      moleculeCount: 0,
      temperatureUnit: units.t1,
      finalPressure: 0,
      pressureUnit: units.p,
      onVolumeChange: handleSimulationVolumeChange,
      onTemperatureChange: handleTemperatureChange,
    };

    if (result?.target === "v1") {
      props.initialVolume = parseFloat(result.value) || 0;
      props.finalVolume = parseFloat(values.v2) || 0;
      props.initialTemperature = parseFloat(values.t1) || 295;
      props.finalTemperature = parseFloat(values.t2) || 295;
    } else if (result?.target === "v2") {
      props.initialVolume = parseFloat(values.v1) || 0;
      props.finalVolume = parseFloat(result.value) || 0;
      props.initialTemperature = parseFloat(values.t1) || 295;
      props.finalTemperature = parseFloat(values.t2) || 295;
    } else if (result?.target === "t1") {
      props.initialVolume = parseFloat(values.v1) || 0;
      props.finalVolume = parseFloat(values.v2) || 0;
      props.initialTemperature = parseFloat(result.value) || 295;
      props.finalTemperature = parseFloat(values.t2) || 295;
    } else if (result?.target === "t2") {
      props.initialVolume = parseFloat(values.v1) || 0;
      props.finalVolume = parseFloat(values.v2) || 0;
      props.initialTemperature = parseFloat(values.t1) || 295;
      props.finalTemperature = parseFloat(result.value) || 295;
    } else {
      props.initialVolume = parseFloat(values.v1) || 0;
      props.finalVolume = parseFloat(values.v2) || 0;
      props.initialTemperature = parseFloat(values.t1) || 295;
      props.finalTemperature = parseFloat(values.t2) || 295;
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
        />
        <CollissionCounter />
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
