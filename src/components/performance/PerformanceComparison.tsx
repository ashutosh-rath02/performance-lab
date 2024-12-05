/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BenchmarkMetric } from "@/lib/types/benchmark";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceComparisonProps {
  metrics: BenchmarkMetric[];
  categories: string[];
}

export function PerformanceComparison({
  metrics,
  categories,
}: PerformanceComparisonProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<"hour" | "day" | "week">("day");

  const comparisonData = selectedCategories.map((category) => {
    const categoryMetrics = metrics.filter((m) => m.category === category);
    return {
      category,
      avgDuration:
        categoryMetrics.reduce((sum, m) => sum + m.duration, 0) /
        categoryMetrics.length,
      successRate:
        (categoryMetrics.filter((m) => m.success).length /
          categoryMetrics.length) *
        100,
      p95: calculateP95(categoryMetrics.map((m) => m.duration)),
      totalRuns: categoryMetrics.length,
    };
  });

  function calculateP95(durations: number[]): number {
    const sorted = durations.sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index] || 0;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
        <div className="flex gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                selectedCategories.includes(category) ? "default" : "outline"
              }
              onClick={() => {
                setSelectedCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [...prev, category]
                );
              }}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
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
              <Bar
                yAxisId="left"
                dataKey="avgDuration"
                name="Avg Duration"
                fill="#8884d8"
              />
              <Bar
                yAxisId="left"
                dataKey="p95"
                name="P95 Duration"
                fill="#82ca9d"
              />
              <Bar
                yAxisId="right"
                dataKey="successRate"
                name="Success Rate"
                fill="#ffc658"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
