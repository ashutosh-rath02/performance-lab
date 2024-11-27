import { CoreWebVital } from "@/lib/types/performance";

export const getCoreWebVitals = (): CoreWebVital[] => {
  const vitals: CoreWebVital[] = [];

  // FCP (First Contentful Paint)
  const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0];
  if (fcpEntry) {
    vitals.push({
      name: "FCP",
      value: fcpEntry.startTime,
      rating:
        fcpEntry.startTime < 1800
          ? "good"
          : fcpEntry.startTime < 3000
          ? "needs-improvement"
          : "poor",
      target: 1800,
    });
  }

  // LCP (Largest Contentful Paint)
  const lcpEntry = performance
    .getEntriesByName("largest-contentful-paint")
    .slice(-1)[0];
  if (lcpEntry) {
    vitals.push({
      name: "LCP",
      value: lcpEntry.startTime,
      rating:
        lcpEntry.startTime < 2500
          ? "good"
          : lcpEntry.startTime < 4000
          ? "needs-improvement"
          : "poor",
      target: 2500,
    });
  }

  // CLS (Cumulative Layout Shift)
  const clsEntries = performance.getEntriesByName("layout-shift");
  const cls = clsEntries.reduce((sum, entry) => sum + entry.duration, 0);
  vitals.push({
    name: "CLS",
    value: cls,
    rating: cls < 0.1 ? "good" : cls < 0.25 ? "needs-improvement" : "poor",
    target: 0.1,
  });

  return vitals;
};
