"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useBenchmarkStore } from "@/lib/stores/benchmarkStore";

export default function BenchmarkDashboard() {
  const [mounted, setMounted] = useState(false);
  const { metrics, getAllCategories } = useBenchmarkStore();
  const clearMetrics = useBenchmarkStore((state) => state.clearMetrics);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = getAllCategories();

  const timelineData = metrics.map((m) => ({
    id: m.id,
    category: m.category,
    duration: m.duration,
    name: m.name,
  }));

  const categoryComparison = categories.map((cat) => ({
    category: cat.category,
    averageTime: cat.averageTime,
    successRate: cat.successRate,
  }));

  if (!mounted) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Performance Benchmarks</h1>
        <button
          onClick={clearMetrics}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Benchmarks
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {categories.map((cat) => (
          <div key={cat.category} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {cat.category}
            </h2>
            <div className="space-y-2">
              <p>Average Time: {cat.averageTime.toFixed(2)} ms</p>
              <p>Success Rate: {cat.successRate.toFixed(1)}%</p>
              <p>Total Runs: {cat.metrics.length}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Timeline</h2>
        <div className="h-[400px]">
          <ResponsiveContainer>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: "Duration (ms)", angle: -90, position: "left" }}
              />
              <Tooltip />
              <Legend />
              {categories.map((cat) => (
                <Line
                  key={cat.category}
                  type="monotone"
                  dataKey="duration"
                  data={timelineData.filter((d) => d.category === cat.category)}
                  name={cat.category}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Category Comparison</h2>
        <div className="h-[400px]">
          <ResponsiveContainer>
            <BarChart data={categoryComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#8884d8"
                label={{ value: "Avg Time (ms)", angle: -90, position: "left" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#82ca9d"
                label={{
                  value: "Success Rate (%)",
                  angle: 90,
                  position: "right",
                }}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="averageTime"
                fill="#8884d8"
                name="Average Time"
              />
              <Bar
                yAxisId="right"
                dataKey="successRate"
                fill="#82ca9d"
                name="Success Rate"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
