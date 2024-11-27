export interface CoreWebVital {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  target: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface MemoryMetric {
  usedHeapSize: number;
  totalHeapSize: number;
  limit: number;
  timestamp: number;
}

export interface NetworkMetric {
  url: string;
  duration: number;
  size: number;
  type: string;
  timestamp: number;
}
