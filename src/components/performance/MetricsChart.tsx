import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { PerformanceMetric } from "@/lib/types/performance";

interface MetricsChartProps {
  metrics: PerformanceMetric[];
  metricName: string;
  height?: number;
}

export function MetricsChart({
  metrics,
  metricName,
  height = 300,
}: MetricsChartProps) {
  const filteredMetrics = metrics
    .filter((metric) => metric.name === metricName)
    .map((metric) => ({
      timestamp: new Date(metric.timestamp).toLocaleTimeString(),
      value: metric.value,
    }))
    .slice(-50); // Show last 50 data points

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div style={{ height: `${height}px` }} className="mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredMetrics}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#666" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#666" }}
                label={{
                  value: metrics[0]?.unit || "Value",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={metricName}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
