import { CoreWebVital } from "@/lib/types/performance";

interface CoreWebVitalsDisplayProps {
  vitals: CoreWebVital[];
}

export function CoreWebVitalsDisplay({ vitals }: CoreWebVitalsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {vitals.map((vital) => (
        <div
          key={vital.name}
          className={`p-4 rounded-lg ${
            vital.rating === "good"
              ? "bg-green-100"
              : vital.rating === "needs-improvement"
              ? "bg-yellow-100"
              : "bg-red-100"
          }`}
        >
          <h3 className="font-bold text-lg">{vital.name}</h3>
          <p className="text-2xl">{vital.value.toFixed(2)}</p>
          <p className="text-sm">Target: {vital.target}</p>
          <p className="text-sm capitalize">Rating: {vital.rating}</p>
        </div>
      ))}
    </div>
  );
}
