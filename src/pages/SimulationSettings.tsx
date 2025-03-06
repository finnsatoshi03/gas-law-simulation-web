import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";
import { useSimulationSettings } from "@/contexts/SettingsProvider";

const scaleOptions = [
  {
    value: "exact",
    label: "Exact (1:1)",
    scale: 1,
    description: "Simulate a balanced 1:1 molecule ratio",
  },
  {
    value: "scaled-0.1",
    label: "1 = 0.1",
    scale: 0.1,
    description: "Each molecule represents 0.1 units",
  },
  {
    value: "scaled-0.01",
    label: "1 = 0.01",
    scale: 0.01,
    description: "Each molecule represents 0.01 units",
  },
  {
    value: "scaled-0.001",
    label: "1 = 0.001",
    scale: 0.001,
    description: "Each molecule represents 0.001 units",
  },
];

export default function SimulationSettings() {
  const {
    settings,
    updateMaxPressure,
    updateMaxVolume,
    updateMoleculeSize,
    updateMoleculeRatio,
    resetSettings,
  } = useSimulationSettings();

  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState(settings);

  useEffect(() => {
    const settingsChanged =
      settings.maxDisplayPressure !== initialSettings.maxDisplayPressure ||
      settings.maxSimulationVolume !== initialSettings.maxSimulationVolume ||
      settings.moleculeSize !== initialSettings.moleculeSize ||
      settings.moleculeRatio.type !== initialSettings.moleculeRatio.type ||
      settings.moleculeRatio.scale !== initialSettings.moleculeRatio.scale;

    setHasChanges(settingsChanged);
  }, [settings, initialSettings]);

  const handlePressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateMaxPressure(value);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateMaxVolume(value);
    }
  };

  const handleMoleculeSizeChange = (values: number[]) => {
    updateMoleculeSize(values[0] / 8);
  };

  const handleMoleculeRatioChange = (value: string) => {
    const selectedOption = scaleOptions.find(
      (option) => option.value === value
    );
    if (selectedOption) {
      updateMoleculeRatio({
        type: selectedOption.value === "exact" ? "exact" : "scaled",
        scale: selectedOption.scale as 1 | 0.1 | 0.01 | 0.001,
      });
    }
  };

  const handleReset = () => {
    resetSettings();
    setInitialSettings(settings);
  };

  // Calculate dynamic SVG size based on molecule size
  const getSvgSize = (size: number) => {
    return Math.max(48, 48 * size);
  };

  const getCurrentRatioValue = () => {
    if (settings.moleculeRatio.type === "exact") return "exact";
    return `scaled-${settings.moleculeRatio.scale}`;
  };

  return (
    <div className="mt-2 h-[95%]">
      <div className="grid grid-cols-[0.5fr_1fr] gap-x-24 gap-y-6">
        {/* Container */}
        <div>
          <h1 className="font-bold">Container Size Limit</h1>
          <p className="opacity-60 text-sm">
            Adjust the maximum size of the simulation container
          </p>
        </div>
        <div>
          <Input
            type="number"
            className="max-w-40"
            value={settings.maxSimulationVolume}
            onChange={handleVolumeChange}
            min={10}
            max={500}
          />
        </div>
        <Separator className="col-span-2" />

        {/* Barometer */}
        <div>
          <h1 className="font-bold">Barometer Range Calibration</h1>
          <p className="opacity-60 text-sm">
            Define the upper limit of the barometer's scale for atmospheric
            pressure (atm). This ensures accurate pressure readings within the
            simulation.
          </p>
        </div>
        <div>
          <Input
            type="number"
            className="max-w-40"
            value={settings.maxDisplayPressure}
            onChange={handlePressureChange}
            min={5}
            max={200}
          />
        </div>

        <Separator className="col-span-2" />
        {/* Molecule Size */}
        <div>
          <h1 className="font-bold">Molecule Size Adjustment</h1>
          <p className="opacity-60 text-sm">
            Customize the size of molecules in the simulation
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 w-48 max-w-96">
          <div className="flex gap-2 items-center">
            {settings.moleculeTypes.map((type) => {
              const svgSize = getSvgSize(settings.moleculeSize);
              return (
                <svg
                  key={type.type}
                  style={{ width: svgSize, height: svgSize }}
                  viewBox={`0 0 ${
                    settings.moleculeSize > 1 ? 50 * settings.moleculeSize : 50
                  } ${
                    settings.moleculeSize > 1 ? 50 * settings.moleculeSize : 50
                  }`}
                  className="transition-all duration-200"
                >
                  {React.createElement(type.template, {
                    x:
                      settings.moleculeSize > 1
                        ? 25 * settings.moleculeSize
                        : 25,
                    y:
                      settings.moleculeSize > 1
                        ? 25 * settings.moleculeSize
                        : 25,
                  })}
                </svg>
              );
            })}
          </div>
          <Slider
            value={[settings.moleculeSize * 8]}
            max={12}
            min={2}
            step={1}
            className="w-48"
            onValueChange={handleMoleculeSizeChange}
          />
        </div>

        <Separator className="col-span-2" />

        {/* Molecule Ratio Settings */}
        <div>
          <h1 className="font-bold">Molecule Ratio Settings</h1>
          <p className="opacity-60 text-sm">
            Choose between exact molecule counts or scaled ratios where 1
            molecule represents a fraction of a unit.
          </p>
        </div>
        <div>
          <RadioGroup
            value={getCurrentRatioValue()}
            onValueChange={handleMoleculeRatioChange}
            className="grid grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {scaleOptions.map((option) => (
              <div key={option.value} className="relative">
                {getCurrentRatioValue() === option.value && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-blue-300 rounded-full p-1">
                      <Check className="size-3 text-white" />
                    </div>
                  </div>
                )}
                <label className="cursor-pointer group" htmlFor={option.value}>
                  <div
                    className={`
                      w-full h-32 bg-slate-100 rounded-lg overflow-hidden
                      relative transition-all duration-200
                      group-hover:bg-slate-200
                      ${
                        getCurrentRatioValue() === option.value
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      }
                    `}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">1</div>
                          <div className="text-sm text-gray-600">Molecule</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {option.scale}
                          </div>
                          <div className="text-sm text-gray-600">Unit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="sr-only"
                  />
                  <div className="mt-2">
                    <h2 className="font-bold">{option.label}</h2>
                    <p className="opacity-60 text-sm">{option.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="col-span-2 mt-6" />
      </div>
      <div className="flex items-center justify-end mt-4 gap-2">
        <Button onClick={handleReset} disabled={!hasChanges}>
          Reset Defaults
        </Button>
      </div>
    </div>
  );
}
