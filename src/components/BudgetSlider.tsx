import { useState } from "react";

const format = (n: number) =>
  n === 0
    ? "$0"
    : `$${(n / 1000).toLocaleString(undefined, {
        maximumFractionDigits: 1,
      })}k`;

export function BudgetSlider({ className = "" }: { className?: string }) {
  const [value, setValue] = useState(0);

  return (
    <label
      className={`flex flex-col justify-between gap-1 h-full border-b border-black/20 pb-1 ${className}`}
    >
      <span className="flex justify-between">
        <span className="opacity-70">Budget</span>
        <span>{format(value)}</span>
      </span>
      <input
        type="range"
        name="budget"
        min={0}
        max={60000}
        step={500}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="budget-slider w-full"
      />
    </label>
  );
}
