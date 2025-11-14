import React from "react"

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  className = ""
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      } ${className}`}
      onClick={() => onCheckedChange?.(!checked)}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md border border-gray-300 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
        style={{
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
    </button>
  )
}