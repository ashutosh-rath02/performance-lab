"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useBenchmarkStore } from "@/lib/stores/benchmarkStore";
import { BenchmarkResults } from "@/components/performance/BenchmarkResults";
import { TrendingAnalysis } from "@/components/performance/TrendingAnalysis";
import { PerformanceComparison } from "@/components/performance/PerformanceComparison";
import { PerformanceAlerts } from "@/components/performance/PerformanceAlerts";
import { BenchmarkFilters } from "@/components/performance/BenchmarkFilter";

const PERFORMANCE_THRESHOLDS = {
  duration: 1000, // 1 second
  successRate: 95, // 95%
};

export default function BenchmarkDashboard() {
  const [mounted, setMounted] = useState(false);
  const { metrics, getAllCategories, clearMetrics } = useBenchmarkStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = getAllCategories();
  const categoryList = categories.map((c) => c.category);

  useEffect(() => {
    setMounted(true);
    if (categoryList.length > 0 && !selectedCategory) {
      setSelectedCategory(categoryList[0]);
    }
  }, [categoryList, selectedCategory]);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Benchmarks</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive performance analysis and monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              const data = JSON.stringify(metrics, null, 2);
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "benchmark-results.json";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button
            onClick={clearMetrics}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </Button>
        </div>
      </div>

      <PerformanceAlerts
        metrics={metrics}
        thresholds={PERFORMANCE_THRESHOLDS}
      />

      <BenchmarkFilters
        categories={categoryList}
        onFilterChange={(filters: unknown) => {
          // Handle filters
          console.log(filters);
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BenchmarkResults categories={categories} />
        </TabsContent>

        <TabsContent value="trends">
          <div className="space-y-4">
            <div className="flex gap-2">
              {categoryList.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
            {selectedCategory && (
              <TrendingAnalysis metrics={metrics} category={selectedCategory} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <PerformanceComparison metrics={metrics} categories={categoryList} />
        </TabsContent>

        <TabsContent value="alerts">
          <div className="grid gap-6">
            <PerformanceAlerts
              metrics={metrics}
              thresholds={PERFORMANCE_THRESHOLDS}
            />

            {/* Detailed Metrics Table */}
            <div className="rounded-lg border bg-white">
              <div className="p-4">
                <h3 className="text-lg font-medium">Recent Test Runs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-4 text-left">Timestamp</th>
                      <th className="p-4 text-left">Category</th>
                      <th className="p-4 text-left">Test Name</th>
                      <th className="p-4 text-right">Duration</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics
                      .slice(-10)
                      .reverse()
                      .map((metric) => (
                        <tr
                          key={metric.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4">
                            {new Date(metric.timestamp).toLocaleString()}
                          </td>
                          <td className="p-4 capitalize">{metric.category}</td>
                          <td className="p-4">{metric.name}</td>
                          <td className="p-4 text-right font-mono">
                            {metric.duration.toFixed(2)}ms
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              metric.success
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                            >
                              {metric.success ? "Success" : "Failed"}
                            </span>
                          </td>
                          <td className="p-4">
                            <pre className="text-xs">
                              {JSON.stringify(metric.details, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
