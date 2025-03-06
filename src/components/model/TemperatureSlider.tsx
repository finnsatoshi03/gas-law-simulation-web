import React, { useState, useRef, useEffect } from "react";

type TemperatureUnit = "K" | "C" | "F";

interface TemperatureSliderProps {
  temperature: number;
  setTemperature: (temperature: number) => void;
  unit?: TemperatureUnit;
  disabled?: boolean;
  className?: string;
}

const convertTemperature = {
  K: {
    toK: (temp: number, currentUnit: TemperatureUnit) => {
      switch (currentUnit) {
        case "C":
          return temp + 273.15;
        case "F":
          return ((temp - 32) * 5) / 9 + 273.15;
        default:
          return temp;
      }
    },
    fromK: (temp: number, targetUnit: TemperatureUnit) => {
      switch (targetUnit) {
        case "C":
          return temp - 273.15;
        case "F":
          return ((temp - 273.15) * 9) / 5 + 32;
        default:
          return temp;
      }
    },
  },
};

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  temperature,
  setTemperature,
  unit = "K",
  disabled = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<SVGGElement | null>(null);

  const calculateTemperature = (clientX: number): number => {
    if (!sliderRef.current) return temperature;
    const rect = sliderRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const percentage = Math.max(
      0,
      Math.min(100, (position / rect.width) * 100)
    );

    // Map percentage to temperature range (5K to 600K)
    const minTemp = 5;
    const maxTemp = 600;
    const kTemp = minTemp + (percentage / 100) * (maxTemp - minTemp);

    // Round to 1 decimal place for consistency
    const convertedTemp = convertTemperature.K.fromK(kTemp, unit);
    return Math.round(convertedTemp * 10) / 10;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && sliderRef.current) {
        const newTemperature = calculateTemperature(e.clientX);
        setTemperature(Number(newTemperature.toFixed(1)));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, setTemperature]);

  const kTemp = convertTemperature.K.toK(temperature, unit);
  const percentage = ((kTemp - 5) / (600 - 5)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Number(e.target.value);
    const kTemp = 5 + (percentage / 100) * (600 - 5);
    const newTemp = convertTemperature.K.fromK(kTemp, unit);
    setTemperature(Number(newTemp.toFixed(1)));
  };

  return (
    <foreignObject x="20" y="800" width="400" height="60" className={className}>
      <div className="w-full h-full flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={percentage}
          onChange={handleChange}
          disabled={disabled}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #0000FF, #FFFFFF, #FF0000)`,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        />
        <div className="text-center text-sm text-gray-600">
          {temperature.toFixed(1)} {unit}
        </div>
      </div>
    </foreignObject>
  );
};

export default TemperatureSlider;
