/* eslint-disable @typescript-eslint/no-unused-vars */
// app/scenarios/data-fetching/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
import { useBenchmarkStore } from "@/lib/stores/benchmarkStore";

interface FetchMetric {
  requestId: number;
  url: string;
  startTime: number;
  endTime: number;
  duration: number;
  status: "success" | "error";
  method: string;
  cacheHit?: boolean;
}

interface DataFetchConfig {
  endpoint: string;
  method: "GET" | "POST";
  useCache: boolean;
  batchSize: number;
  retries: number;
}

const TEST_ENDPOINTS = {
  posts: "https://jsonplaceholder.typicode.com/posts",
  comments: "https://jsonplaceholder.typicode.com/comments",
  users: "https://jsonplaceholder.typicode.com/users",
  photos: "https://jsonplaceholder.typicode.com/photos",
};

export default function DataFetchingPage() {
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState<FetchMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<DataFetchConfig>({
    endpoint: TEST_ENDPOINTS.posts,
    method: "GET",
    useCache: true,
    batchSize: 10,
    retries: 1,
  });
  const [cache] = useState(new Map());
  const addMetric = useBenchmarkStore((state) => state.addMetric);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchWithMetrics = async (
    url: string,
    config: DataFetchConfig
  ): Promise<FetchMetric> => {
    const startTime = performance.now();
    const requestId = metrics.length;

    try {
      const response = await axios.get(url);
      const endTime = performance.now();
      const duration = endTime - startTime;

      addMetric({
        id: `fetch-${requestId}-${Date.now()}`,
        category: "data",
        name: `Fetch ${url.split("/").pop()}`,
        timestamp: Date.now(),
        duration,
        success: true,
        details: {
          url,
          method: config.method,
          cacheHit: config.useCache && cache.has(url),
        },
      });

      return {
        requestId,
        url,
        startTime,
        endTime,
        duration,
        status: "success",
        method: config.method,
        cacheHit: config.useCache && cache.has(url),
      };
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      addMetric({
        id: `fetch-${requestId}-${Date.now()}`,
        category: "data",
        name: `Fetch ${url.split("/").pop()}`,
        timestamp: Date.now(),
        duration,
        success: false,
        details: {
          url,
          method: config.method,
          error: true,
        },
      });

      return {
        requestId,
        url,
        startTime,
        endTime,
        duration,
        status: "error",
        method: config.method,
      };
    }
  };

  const runBenchmark = async () => {
    setLoading(true);
    const newMetrics: FetchMetric[] = [];

    // Run batch requests
    for (let i = 0; i < config.batchSize; i++) {
      const metric = await fetchWithMetrics(config.endpoint, config);
      newMetrics.push(metric);
    }

    setMetrics((prev) => [...prev, ...newMetrics]);
    setLoading(false);
  };

  // Performance Analysis
  const averageTime =
    metrics.length > 0
      ? metrics.reduce((acc, m) => acc + m.duration, 0) / metrics.length
      : 0;

  const cacheHits = metrics.filter((m) => m.cacheHit).length;
  const successRate =
    metrics.length > 0
      ? (metrics.filter((m) => m.status === "success").length /
          metrics.length) *
        100
      : 0;

  // Chart Data
  const timelineData = metrics.map((m) => ({
    requestId: m.requestId,
    duration: m.duration,
    cacheHit: m.cacheHit,
  }));

  const endpointPerformance = Object.entries(TEST_ENDPOINTS).map(
    ([name, url]) => ({
      name,
      averageTime:
        metrics
          .filter((m) => m.url === url)
          .reduce((acc, m) => acc + m.duration, 0) /
          metrics.filter((m) => m.url === url).length || 0,
    })
  );

  if (!mounted) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Data Fetching Performance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Configuration Panel */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Endpoint:</label>
              <select
                value={config.endpoint}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, endpoint: e.target.value }))
                }
                className="w-full border rounded p-2"
              >
                {Object.entries(TEST_ENDPOINTS).map(([name, url]) => (
                  <option key={url} value={url}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Batch Size:</label>
              <input
                type="number"
                value={config.batchSize.toString()}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    batchSize: Math.max(1, Number(e.target.value) || 0),
                  }))
                }
                className="w-full border rounded p-2"
                min="1"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={config.useCache}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    useCache: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <label>Enable Caching</label>
            </div>

            <button
              onClick={runBenchmark}
              disabled={loading}
              className={`w-full py-2 rounded ${
                loading
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? "Running..." : "Run Benchmark"}
            </button>
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Average Time</p>
                <p className="text-2xl font-semibold">
                  {averageTime.toFixed(2)} ms
                </p>
              </div>
              <div>
                <p className="text-gray-600">Cache Hits</p>
                <p className="text-2xl font-semibold">{cacheHits}</p>
              </div>
              <div>
                <p className="text-gray-600">Success Rate</p>
                <p className="text-2xl font-semibold">
                  {successRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold">{metrics.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Request Timeline</h2>
          <div className="h-[300px]">
            <LineChart width={800} height={300} data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="requestId"
                label={{ value: "Request ID", position: "bottom" }}
              />
              <YAxis
                label={{ value: "Duration (ms)", angle: -90, position: "left" }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#8884d8"
                name="Request Duration"
              />
            </LineChart>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Endpoint Performance</h2>
          <div className="h-[300px]">
            <BarChart width={800} height={300} data={endpointPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Average Time (ms)",
                  angle: -90,
                  position: "left",
                }}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="averageTime"
                fill="#82ca9d"
                name="Average Response Time"
              />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}
