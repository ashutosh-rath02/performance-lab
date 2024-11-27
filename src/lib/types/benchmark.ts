export interface BenchmarkMetric {
  id: string;
  category: "image" | "list" | "data";
  name: string;
  timestamp: number;
  duration: number;
  success: boolean;
  details?: {
    size?: number;
    method?: string;
    cacheHit?: boolean;
    renderStrategy?: string;
    [key: string]: unknown;
  };
}

export interface PerformanceResult {
  averageTime: number;
  minTime: number;
  maxTime: number;
  successRate: number;
  totalRuns: number;
  metrics: BenchmarkMetric[];
}

export interface CategoryPerformance {
  category: string;
  metrics: BenchmarkMetric[];
  averageTime: number;
  successRate: number;
}
