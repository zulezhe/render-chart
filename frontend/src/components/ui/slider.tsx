import React, { useState } from "react"

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value = [0],
  onValueChange,
  className = ""
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [parseInt(e.target.value)];
    setCurrentValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute h-full bg-blue-600"
          style={{
            width: `${((currentValue[0] - min) / (max - min)) * 100}%`
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue[0]}
        onChange={handleChange}
        className="absolute w-full h-2 opacity-0 cursor-pointer"
      />
      <div
        className="absolute h-5 w-5 rounded-full border-2 border-blue-600 bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        style={{
          left: `${((currentValue[0] - min) / (max - min)) * 100}%`,
          transform: 'translateX(-50%)'
        }}
      />
    </div>
  )
}