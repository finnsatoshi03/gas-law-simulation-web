/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useGasLaw } from "@/contexts/GasLawProvider";
import GasLawsSimulation from "@/components/model/Model";
import GasLawInputGroup from "@/components/model/Parameters";
import { CollissionCounter } from "@/components/model/CollissionCounter";
import { InfoSheet } from "@/components/InfoSheet";
import { AVOGADROS_LAW_INFO } from "@/lib/constants";
import { GasLawType, SolutionSheet } from "@/components/SolutionSheet";
import ProblemsSlide from "@/components/ProblemsSlide";

export default function Avogadros() {
  const { result } = useGasLaw();
  const [values, setValues] = useState<Record<string, string>>({
    v1: "",
    n1: "",
    v2: "",
    n2: "",
    t: "300",
    p: "1",
  });
  const [units, setUnits] = useState<Record<string, string>>({
    v1: "L",
    n1: "mol",
    v2: "L",
    n2: "mol",
    t: "K",
    p: "atm",
  });

  const handleSimulationVolumeChange = (volume: number) => {
    const roundedVolume = Math.round(volume * 100) / 100;
    if (result?.target === "v1") {
      setValues((prev) => ({ ...prev, v2: roundedVolume.toString() }));
    } else if (result?.target === "v2") {
      setValues((prev) => ({ ...prev, v1: roundedVolume.toString() }));
    } else {
      setValues((prev) => ({ ...prev, v1: roundedVolume.toString() }));
    }
  };

  const handleSimulationMoleculeCountChange = (count: number) => {
    // Round to nearest whole number since we can't have partial molecules
    const roundedCount = Math.round(count);
    if (result?.target === "n1") {
      setValues((prev) => ({ ...prev, n2: roundedCount.toString() }));
    } else if (result?.target === "n2") {
      setValues((prev) => ({ ...prev, n1: roundedCount.toString() }));
    } else {
      setValues((prev) => ({ ...prev, n1: roundedCount.toString() }));
    }
  };

  const simulationProps = useMemo(() => {
    const props: any = {
      gasLaw: "avogadro",
      initialVolume: parseFloat(values.v1) || 0,
      finalVolume: parseFloat(values.v2) || 0,
      volumeUnit: units.v1,
      moleculeCount: parseFloat(values.n2) || 0,
      temperature: parseFloat(values.t) || 0,
      temperatureUnit: units.t,
      pressure: parseFloat(values.p) || 0,
      pressureUnit: units.p,
      onVolumeChange: handleSimulationVolumeChange,
      onMoleculeCountChange: handleSimulationMoleculeCountChange,
    };

    if (result?.target === "v1") {
      props.initialVolume = parseFloat(result.value) || 0;
      props.finalVolume = parseFloat(values.v2) || 0;
    } else if (result?.target === "v2") {
      props.initialVolume = parseFloat(values.v1) || 0;
      props.finalVolume = parseFloat(result.value) || 0;
    } else if (result?.target === "n2") {
      props.moleculeCount = parseFloat(result.value) || 0;
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
          lawType="avogadro"
          values={values}
          units={units}
          onValueChange={handleValueChange}
          onUnitChange={handleUnitChange}
          disabledFields={result?.target ? [result.target] : []}
        />
        <CollissionCounter />
      </div>
      <div className="absolute top-4 z-10 right-2 flex items-end flex-col gap-2">
        <InfoSheet {...AVOGADROS_LAW_INFO} />
        <SolutionSheet
          lawType={GasLawType.AVOGADROS_LAW}
          result={result ?? undefined}
          values={values}
          units={units}
        />
        <ProblemsSlide type="avogadros" />
      </div>
      <GasLawsSimulation {...simulationProps} />
    </div>
  );
}
