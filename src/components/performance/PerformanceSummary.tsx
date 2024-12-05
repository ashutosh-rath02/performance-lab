import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BenchmarkMetric } from "@/lib/types/benchmark";
import { TrendingUp, TrendingDown, Clock, CheckCircle2 } from "lucide-react";

interface PerformanceSummaryProps {
  metrics: BenchmarkMetric[];
}

export function PerformanceSummary({ metrics }: PerformanceSummaryProps) {
  const summary = useMemo(() => {
    const total = metrics.length;
    const successful = metrics.filter((m) => m.success).length;
    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / total;

    // Calculate performance trend
    const recentMetrics = metrics.slice(-10);
    const olderMetrics = metrics.slice(-20, -10);
    const recentAvg =
      recentMetrics.reduce((sum, m) => sum + m.duration, 0) /
      recentMetrics.length;
    const olderAvg =
      olderMetrics.reduce((sum, m) => sum + m.duration, 0) /
      olderMetrics.length;
    const trend = recentAvg - olderAvg;

    return {
      totalTests: total,
      successRate: (successful / total) * 100,
      avgDuration,
      trend,
      p95: calculateP95(metrics.map((m) => m.duration)),
    };
  }, [metrics]);

  function calculateP95(durations: number[]): number {
    const sorted = durations.sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index] || 0;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Tests
              </p>
              <p className="text-2xl font-bold">{summary.totalTests}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Success Rate
              </p>
              <p className="text-2xl font-bold">
                {summary.successRate.toFixed(1)}%
              </p>
            </div>
            <div
              className={`rounded-full p-2 ${
                summary.successRate > 95 ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              {summary.successRate > 95 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Duration
              </p>
              <p className="text-2xl font-bold">
                {summary.avgDuration.toFixed(2)}ms
              </p>
            </div>
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Trend: {summary.trend > 0 ? "+" : ""}
            {summary.trend.toFixed(2)}ms
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                P95 Duration
              </p>
              <p className="text-2xl font-bold">{summary.p95.toFixed(2)}ms</p>
            </div>
            <div
              className={`rounded-full p-2 ${
                summary.p95 < 1000 ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              {summary.p95 < 1000 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
