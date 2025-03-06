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
