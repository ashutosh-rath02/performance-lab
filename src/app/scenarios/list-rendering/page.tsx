"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useBenchmarkStore } from "@/lib/stores/benchmarkStore";

interface ListItem {
  id: number;
  title: string;
  description: string;
  timestamp: number;
}

type RenderStrategy = "simple" | "windowed" | "paged";

export default function ListRenderingPage() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<ListItem[]>([]);
  const [itemCount, setItemCount] = useState(1000);
  const [strategy, setStrategy] = useState<RenderStrategy>("simple");
  const [loading, setLoading] = useState(false);
  const [renderTime, setRenderTime] = useState<number>(0);
  const [pageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const addMetric = useBenchmarkStore((state) => state.addMetric);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateItems = () => {
    setLoading(true);
    const startTime = performance.now();

    const newItems = Array.from({ length: itemCount }, (_, index) => ({
      id: index,
      title: `Item ${index + 1}`,
      description: `This is the description for item ${index + 1}`,
      timestamp: Date.now() + index,
    }));

    const endTime = performance.now();
    const duration = endTime - startTime;

    addMetric({
      id: `list-${Date.now()}`,
      category: "list",
      name: `List Render (${strategy})`,
      timestamp: Date.now(),
      duration,
      success: true,
      details: {
        itemCount,
        renderStrategy: strategy,
      },
    });

    setItems(newItems);
    setRenderTime(duration);
    setLoading(false);
  };

  // Windowed list setup
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  // Paged items
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  // Render strategies
  const renderList = () => {
    switch (strategy) {
      case "windowed":
        return (
          <div ref={parentRef} className="h-[600px] overflow-auto">
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="p-4 border-b"
                >
                  <h3 className="font-semibold">
                    {items[virtualItem.index].title}
                  </h3>
                  <p className="text-gray-600">
                    {items[virtualItem.index].description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "paged":
        return (
          <div>
            <div className="grid gap-4">
              {pagedItems.map((item) => (
                <div key={item.id} className="p-4 bg-white rounded shadow">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({ length: Math.ceil(items.length / pageSize) }).map(
                (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === idx + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">
        List Rendering Performance Test
      </h1>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Number of Items:</label>
            <input
              type="number"
              value={itemCount.toString()}
              onChange={(e) =>
                setItemCount(Math.max(1, Number(e.target.value) || 0))
              }
              className="border p-2 rounded w-full"
              min="1"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Rendering Strategy:
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as RenderStrategy)}
              className="border p-2 rounded w-full"
            >
              <option value="simple">Simple Rendering</option>
              <option value="windowed">Windowed Rendering</option>
              <option value="paged">Paged Rendering</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateItems}
          disabled={loading}
          className={`w-full px-4 py-2 rounded font-medium ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Generating..." : "Generate List"}
        </button>
      </div>

      {renderTime > 0 && (
        <div className="mb-4 p-4 bg-green-50 rounded">
          <p className="text-green-800">
            List generated in: {renderTime.toFixed(2)}ms
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">{renderList()}</div>
    </div>
  );
}
