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
    <label className={`flex flex-col gap-1 ${className}`}>
      <input
        type="range"
        name="budget"
        min={0}
        max={60000}
        step={5000}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="budget-slider w-full mt-[6px] -mb-[6px]"
      />
      <span className="flex justify-between">
        <span className="pt-0.5">Budget</span>
        <span>{format(value)}</span>
      </span>
    </label>
  );
}
