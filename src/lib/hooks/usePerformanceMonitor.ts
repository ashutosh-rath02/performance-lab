import { useState, useEffect } from "react";
import { PerformanceMonitor } from "../utils/performance/monitor";
import { PerformanceMetric } from "../types/performance";

const monitor = new PerformanceMonitor();

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    const unsubscribe = monitor.subscribe(() => {
      setMetrics(monitor.getMetrics());
    });

    return () => {
      unsubscribe();
    };

    return unsubscribe;
  }, []);

  return { metrics, monitor };
}
