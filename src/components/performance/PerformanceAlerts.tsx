import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BenchmarkMetric } from "@/lib/types/benchmark";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface PerformanceAlertsProps {
  metrics: BenchmarkMetric[];
  thresholds: {
    duration: number;
    successRate: number;
  };
}

interface Alert {
  id: string;
  type: "warning" | "error" | "success";
  message: string;
  timestamp: number;
  category: string;
}

export function PerformanceAlerts({
  metrics,
  thresholds,
}: PerformanceAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const newAlerts: Alert[] = [];
    const categories = [...new Set(metrics.map((m) => m.category))];

    categories.forEach((category) => {
      const categoryMetrics = metrics.filter((m) => m.category === category);
      const recentMetrics = categoryMetrics.slice(-10); // Last 10 runs

      // Check average duration
      const avgDuration =
        recentMetrics.reduce((sum, m) => sum + m.duration, 0) /
        recentMetrics.length;
      if (avgDuration > thresholds.duration) {
        newAlerts.push({
          id: crypto.randomUUID(),
          type: "warning",
          message: `High average duration (${avgDuration.toFixed(
            2
          )}ms) detected in ${category}`,
          timestamp: Date.now(),
          category,
        });
      }

      // Check success rate
      const successRate =
        (recentMetrics.filter((m) => m.success).length / recentMetrics.length) *
        100;
      if (successRate < thresholds.successRate) {
        newAlerts.push({
          id: crypto.randomUUID(),
          type: "error",
          message: `Low success rate (${successRate.toFixed(
            1
          )}%) detected in ${category}`,
          timestamp: Date.now(),
          category,
        });
      }
    });

    setAlerts((prev) => [...prev, ...newAlerts].slice(-5)); // Keep last 5 alerts
  }, [metrics, thresholds]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>All Systems Normal</AlertTitle>
              <AlertDescription>
                No performance issues detected
              </AlertDescription>
            </Alert>
          ) : (
            alerts.map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.type === "error" ? "destructive" : "default"}
              >
                {alert.type === "error" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle className="capitalize">{alert.category}</AlertTitle>
                <AlertDescription>
                  {alert.message}
                  <div className="text-xs mt-1 text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
