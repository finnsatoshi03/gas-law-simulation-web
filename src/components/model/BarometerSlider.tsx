import { useEffect, useRef, useState } from "react";

interface BarometerSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const BarometerSlider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  disabled = false,
}: BarometerSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = (clientY: number) => {
    if (!sliderRef.current) return value;
    const rect = sliderRef.current.getBoundingClientRect();
    const height = rect.height;
    const offsetY = clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, offsetY / height));
    return max - percentage * (max - min); // Inverted calculation
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    const newValue = calculateValue(e.clientY);
    onChange(newValue);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    e.preventDefault();
    const newValue = calculateValue(e.clientY);
    onChange(newValue);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    const newValue = calculateValue(e.touches[0].clientY);
    onChange(newValue);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || disabled) return;
    e.preventDefault();
    const newValue = calculateValue(e.touches[0].clientY);
    onChange(newValue);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDragging, disabled]);

  // Calculate the thumb position
  const percentage = ((value - min) / (max - min)) * 100;
  const thumbPosition = `${100 - percentage}%`;

  return (
    <div
      ref={sliderRef}
      className={`relative w-2 h-28 rounded-full bg-zinc-200 dark:bg-zinc-800 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ touchAction: "none" }}
    >
      {/* Track fill */}
      <div
        className="absolute bottom-0 left-0 w-full rounded-full bg-zinc-900 dark:bg-zinc-100"
        style={{ height: `${percentage}%` }}
      />
      {/* Thumb */}
      <div
        className={`absolute left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${
          isDragging ? "scale-110" : ""
        }`}
        style={{ top: thumbPosition }}
      />
    </div>
  );
};

export default BarometerSlider;
