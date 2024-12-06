"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BenchmarkMetric } from "@/lib/types/benchmark";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

interface PerformanceInsightsProps {
  metrics: BenchmarkMetric[];
}

interface Insight {
  id: string;
  type: "improvement" | "degradation" | "suggestion";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

export function PerformanceInsights({ metrics }: PerformanceInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Analyze metrics and generate insights
    const newInsights = analyzeMetrics(metrics);
    setInsights(newInsights);
  }, [metrics]);

  function analyzeMetrics(metrics: BenchmarkMetric[]): Insight[] {
    const insights: Insight[] = [];
    const categories = [...new Set(metrics.map((m) => m.category))];

    categories.forEach((category) => {
      const categoryMetrics = metrics.filter((m) => m.category === category);
      const recent = categoryMetrics.slice(-10);
      const older = categoryMetrics.slice(-20, -10);

      const recentAvg = average(recent.map((m) => m.duration));
      const olderAvg = average(older.map((m) => m.duration));
      const change = ((recentAvg - olderAvg) / olderAvg) * 100;

      if (Math.abs(change) > 10) {
        insights.push({
          id: crypto.randomUUID(),
          type: change > 0 ? "degradation" : "improvement",
          title: `${category} Performance ${
            change > 0 ? "Degradation" : "Improvement"
          }`,
          description: `${Math.abs(change).toFixed(1)}% ${
            change > 0 ? "slower" : "faster"
          } than previous period`,
          impact: Math.abs(change) > 20 ? "high" : "medium",
        });
      }

      // Add optimization suggestions
      if (
        category === "image" &&
        average(recent.map((m) => m.duration)) > 1000
      ) {
        insights.push({
          id: crypto.randomUUID(),
          type: "suggestion",
          title: "Image Optimization Needed",
          description:
            "Consider implementing lazy loading or optimizing image sizes",
          impact: "medium",
        });
      }
    });

    return insights;
  }

  function average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {insights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-lg border ${
                  insight.type === "improvement"
                    ? "bg-green-50 border-green-200"
                    : insight.type === "degradation"
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {insight.type === "improvement" && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                  {insight.type === "degradation" && (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  {insight.type === "suggestion" && (
                    <AlertTriangle className="w-5 h-5 text-blue-500" />
                  )}
                  <h3 className="font-medium">{insight.title}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {insight.description}
                </p>
                <div className="mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === "high"
                        ? "bg-red-100 text-red-700"
                        : insight.impact === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {insight.impact.toUpperCase()} IMPACT
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
