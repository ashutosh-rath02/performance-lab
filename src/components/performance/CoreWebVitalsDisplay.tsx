import { CoreWebVital } from "@/lib/types/performance";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Zap, ArrowUp, ArrowDown } from "lucide-react";

interface CoreWebVitalsDisplayProps {
  vitals: CoreWebVital[];
}

export function CoreWebVitalsDisplay({ vitals }: CoreWebVitalsDisplayProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case "LCP":
        return Zap;
      case "FCP":
        return Activity;
      default:
        return Activity;
    }
  };

  const getIndicator = (rating: string) => {
    switch (rating) {
      case "good":
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case "poor":
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {vitals.map((vital) => {
        const Icon = getIcon(vital.name);
        return (
          <Card
            key={vital.name}
            className={`relative overflow-hidden ${
              vital.rating === "good"
                ? "bg-green-50"
                : vital.rating === "needs-improvement"
                ? "bg-yellow-50"
                : "bg-red-50"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {vital.name}
                  </p>
                  <p className="text-2xl font-bold">{vital.value.toFixed(2)}</p>
                </div>
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">Target: </span>
                  <span className="font-medium">{vital.target}</span>
                </div>
                <div className="flex items-center">
                  {getIndicator(vital.rating)}
                  <span
                    className={`ml-1 text-sm capitalize ${
                      vital.rating === "good"
                        ? "text-green-600"
                        : vital.rating === "needs-improvement"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {vital.rating.replace("-", " ")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
