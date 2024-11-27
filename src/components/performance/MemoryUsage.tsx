import { MemoryMetric } from "@/lib/types/performance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MemoryUsageProps {
  metrics: MemoryMetric[];
}

export function MemoryUsage({ metrics }: MemoryUsageProps) {
  const formattedMetrics = metrics.map((metric) => ({
    timestamp: new Date(metric.timestamp).toLocaleTimeString(),
    used: metric.usedHeapSize / 1024 / 1024,
    total: metric.totalHeapSize / 1024 / 1024,
  }));

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer>
        <LineChart data={formattedMetrics}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="used"
            stroke="#8884d8"
            name="Used Heap (MB)"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#82ca9d"
            name="Total Heap (MB)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
