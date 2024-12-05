/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { CategoryPerformance } from "@/lib/types/benchmark";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface BenchmarkResultsProps {
  categories: CategoryPerformance[];
}

export function BenchmarkResults({ categories }: BenchmarkResultsProps) {
  const chartData = categories.map((cat) => ({
    category: cat.category,
    averageTime: parseFloat(cat.averageTime.toFixed(2)),
    successRate: parseFloat(cat.successRate.toFixed(1)),
  }));

  const compareToPrevious = (current: number, category: string) => {
    // This is a placeholder - implement actual historical comparison
    const difference = Math.random() * 20 - 10;
    return {
      difference,
      improved: difference < 0,
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => {
          const comparison = compareToPrevious(
            category.averageTime,
            category.category
          );
          return (
            <Card key={category.category}>
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {category.category} Performance
                </CardTitle>
                <CardDescription>Average execution time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      {category.averageTime.toFixed(2)}ms
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Success Rate: {category.successRate.toFixed(1)}%
                    </p>
                  </div>
                  <div
                    className={`flex items-center ${
                      comparison.improved ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {comparison.improved ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="text-sm ml-1">
                      {Math.abs(comparison.difference).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>
            Comparing average execution times and success rates across
            categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="averageTime"
                  name="Average Time (ms)"
                  fill="#3b82f6"
                />
                <Bar
                  yAxisId="right"
                  dataKey="successRate"
                  name="Success Rate (%)"
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
