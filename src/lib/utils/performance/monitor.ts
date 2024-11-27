import { PerformanceMetric } from "@/lib/types/performance";

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.setupPerformanceObserver();
    }
  }

  measureTime(name: string): () => void {
    // Add this method
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.addMetric({
        name,
        value: duration,
        unit: "ms",
        timestamp: Date.now(),
      });
    };
  }

  private setupPerformanceObserver() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.addMetric({
          name: entry.name,
          value: entry.startTime,
          unit: "ms",
          timestamp: Date.now(),
        });
      });
    });

    observer.observe({
      entryTypes: ["paint", "layout-shift", "largest-contentful-paint"],
    });
  }

  addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    this.notifyObservers();
  }

  getMetrics() {
    return [...this.metrics];
  }

  subscribe(callback: () => void) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  private notifyObservers() {
    this.observers.forEach((callback) => callback());
  }
}
