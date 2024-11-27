"use client";

import { create } from "zustand";
import {
  BenchmarkMetric,
  PerformanceResult,
  CategoryPerformance,
} from "../types/benchmark";

interface BenchmarkStore {
  metrics: BenchmarkMetric[];
  addMetric: (metric: BenchmarkMetric) => void;
  clearMetrics: () => void;
  getResultsByCategory: (category: string) => PerformanceResult;
  getAllCategories: () => CategoryPerformance[];
}

export const useBenchmarkStore = create<BenchmarkStore>((set, get) => ({
  metrics: [],

  addMetric: (metric: BenchmarkMetric) =>
    set((state) => ({
      metrics: [...state.metrics, metric],
    })),

  clearMetrics: () => set({ metrics: [] }),

  getResultsByCategory: (category: string) => {
    const metrics = get().metrics.filter((m) => m.category === category);
    const durations = metrics.map((m) => m.duration);

    return {
      averageTime: durations.reduce((a, b) => a + b, 0) / durations.length || 0,
      minTime: Math.min(...durations) || 0,
      maxTime: Math.max(...durations) || 0,
      successRate:
        (metrics.filter((m) => m.success).length / metrics.length) * 100 || 0,
      totalRuns: metrics.length,
      metrics,
    };
  },

  getAllCategories: () => {
    const metrics = get().metrics;
    const categories = [...new Set(metrics.map((m) => m.category))];

    return categories.map((category) => {
      const categoryMetrics = metrics.filter((m) => m.category === category);
      return {
        category,
        metrics: categoryMetrics,
        averageTime:
          categoryMetrics.reduce((acc, m) => acc + m.duration, 0) /
            categoryMetrics.length || 0,
        successRate:
          (categoryMetrics.filter((m) => m.success).length /
            categoryMetrics.length) *
            100 || 0,
      };
    });
  },
}));
