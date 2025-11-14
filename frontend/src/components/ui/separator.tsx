import React from "react"

interface SeparatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({
  className = "",
  orientation = "horizontal",
  decorative = true
}) => {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={`shrink-0 bg-gray-200 ${
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
      } ${className}`}
    />
  );
}