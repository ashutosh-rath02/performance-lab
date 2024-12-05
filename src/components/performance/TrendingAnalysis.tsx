import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BenchmarkMetric } from "@/lib/types/benchmark";
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

interface TrendingAnalysisProps {
  metrics: BenchmarkMetric[];
  category: string;
}

export function TrendingAnalysis({ metrics, category }: TrendingAnalysisProps) {
  const trendData = useMemo(() => {
    const categoryMetrics = metrics
      .filter((m) => m.category === category)
      .sort((a, b) => a.timestamp - b.timestamp);

    // Calculate moving averages
    const windowSize = 5;
    const movingAverages = categoryMetrics.map((metric, index) => {
      const window = categoryMetrics.slice(
        Math.max(0, index - windowSize),
        index + 1
      );
      const avgDuration =
        window.reduce((sum, m) => sum + m.duration, 0) / window.length;
      const successRate =
        (window.filter((m) => m.success).length / window.length) * 100;

      return {
        timestamp: new Date(metric.timestamp).toLocaleTimeString(),
        duration: metric.duration,
        movingAvg: avgDuration,
        successRate,
      };
    });

    return movingAverages;
  }, [metrics, category]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends - {category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Duration (ms)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Success Rate (%)",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="duration"
                stroke="#8884d8"
                dot={false}
                name="Actual Duration"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="movingAvg"
                stroke="#82ca9d"
                strokeDasharray="5 5"
                dot={false}
                name="Moving Average"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="successRate"
                stroke="#ff7300"
                dot={false}
                name="Success Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
