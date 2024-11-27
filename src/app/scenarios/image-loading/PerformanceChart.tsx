"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LoadTime {
  id: number;
  loadTime: number;
  strategy: string;
}

interface Props {
  loadTimes: LoadTime[];
}

export function PerformanceChart({ loadTimes }: Props) {
  const data = loadTimes.map((lt) => ({
    id: lt.id,
    loadTime: lt.loadTime,
    strategy: lt.strategy,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="id"
            label={{ value: "Image Number", position: "bottom" }}
          />
          <YAxis
            label={{ value: "Load Time (ms)", angle: -90, position: "left" }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="loadTime"
            stroke="#8884d8"
            name="Load Time"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
