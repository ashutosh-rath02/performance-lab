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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemoryMetric } from "@/lib/types/performance";

interface MemoryUsageProps {
  metrics: MemoryMetric[];
}

export function MemoryUsage({ metrics }: MemoryUsageProps) {
  const formattedMetrics = metrics
    .map((metric) => ({
      timestamp: new Date(metric.timestamp).toLocaleTimeString(),
      used: +(metric.usedHeapSize / 1024 / 1024).toFixed(2),
      total: +(metric.totalHeapSize / 1024 / 1024).toFixed(2),
      limit: +(metric.limit / 1024 / 1024).toFixed(2),
    }))
    .slice(-50); // Show last 50 measurements

  const currentUsage = formattedMetrics[formattedMetrics.length - 1];
  const usagePercentage = currentUsage
    ? ((currentUsage.used / currentUsage.limit) * 100).toFixed(1)
    : "0";

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Memory Usage</CardTitle>
        <div className="text-sm text-muted-foreground">
          {usagePercentage}% of limit
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedMetrics}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#666" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#666" }}
                label={{ value: "MB", angle: -90, position: "insideLeft" }}
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
                dataKey="used"
                name="Used Heap"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Heap"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="limit"
                name="Heap Limit"
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Used Memory</p>
            <p className="font-medium">{currentUsage?.used.toFixed(1)} MB</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Total Allocated</p>
            <p className="font-medium">{currentUsage?.total.toFixed(1)} MB</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Memory Limit</p>
            <p className="font-medium">{currentUsage?.limit.toFixed(1)} MB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
