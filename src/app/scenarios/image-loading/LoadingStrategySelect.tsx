"use client";

export type LoadingStrategy = "eager" | "lazy" | "progressive";

interface Props {
  value: LoadingStrategy;
  onChange: (strategy: LoadingStrategy) => void;
}

export function LoadingStrategySelect({ value, onChange }: Props) {
  return (
    <div className="flex gap-4">
      <label className="inline-flex items-center">
        <input
          type="radio"
          value="eager"
          checked={value === "eager"}
          onChange={(e) => onChange(e.target.value as LoadingStrategy)}
          className="form-radio h-4 w-4 text-blue-600"
        />
        <span className="ml-2">Eager Loading</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="radio"
          value="lazy"
          checked={value === "lazy"}
          onChange={(e) => onChange(e.target.value as LoadingStrategy)}
          className="form-radio h-4 w-4 text-blue-600"
        />
        <span className="ml-2">Lazy Loading</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="radio"
          value="progressive"
          checked={value === "progressive"}
          onChange={(e) => onChange(e.target.value as LoadingStrategy)}
          className="form-radio h-4 w-4 text-blue-600"
        />
        <span className="ml-2">Progressive Loading</span>
      </label>
    </div>
  );
}
