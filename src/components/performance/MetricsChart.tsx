import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PerformanceMetric } from "@/lib/types/performance";

interface MetricsChartProps {
  metrics: PerformanceMetric[];
  metricName: string;
}

export function MetricsChart({ metrics, metricName }: MetricsChartProps) {
  const filteredMetrics = metrics
    .filter((metric) => metric.name === metricName)
    .map((metric) => ({
      timestamp: new Date(metric.timestamp).toLocaleTimeString(),
      value: metric.value,
    }));

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer>
        <LineChart data={filteredMetrics}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            name={metricName}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
