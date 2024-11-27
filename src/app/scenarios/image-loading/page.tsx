/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useBenchmarkStore } from "@/lib/stores/benchmarkStore";

interface ImageLoadTest {
  id: number;
  url: string;
  startTime: number;
  loadTime?: number;
  error?: boolean;
}

export default function ImageLoadingPage() {
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState<ImageLoadTest[]>([]);
  const [imageCount, setImageCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const addMetric = useBenchmarkStore((state) => state.addMetric);

  useEffect(() => {
    setMounted(true);
  }, []);

  const TEST_IMAGES = [
    "https://picsum.photos/800/600",
    "https://picsum.photos/801/601",
    "https://picsum.photos/802/602",
    "https://picsum.photos/803/603",
    "https://picsum.photos/804/604",
    "https://picsum.photos/805/605",
    "https://picsum.photos/806/606",
    "https://picsum.photos/807/607",
    "https://picsum.photos/808/608",
    "https://picsum.photos/809/609",
  ];

  const generateImages = () => {
    setLoading(true);
    const startTime = performance.now();
    const newImages = Array.from({ length: imageCount }, (_, index) => ({
      id: index,
      url: TEST_IMAGES[index % TEST_IMAGES.length],
      startTime,
    }));
    setImages(newImages);
  };

  const handleImageLoad =
    (id: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
      const loadTime = performance.now();
      const duration = loadTime - images[id].startTime;

      // Add to benchmark metrics
      addMetric({
        id: `img-${id}-${Date.now()}`,
        category: "image",
        name: `Image ${id + 1}`,
        timestamp: Date.now(),
        duration,
        success: true,
        details: {
          size: images[id].url.length,
        },
      });

      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === id ? { ...img, loadTime: duration } : img
        )
      );
    };

  const handleImageError = (id: number) => () => {
    setImages((prevImages) =>
      prevImages.map((img) => (img.id === id ? { ...img, error: true } : img))
    );
  };

  // Calculate metrics
  const loadedImages = images.filter((img) => img.loadTime);
  const averageLoadTime =
    loadedImages.length > 0
      ? loadedImages.reduce((acc, img) => acc + (img.loadTime || 0), 0) /
        loadedImages.length
      : 0;
  const maxLoadTime = Math.max(...loadedImages.map((img) => img.loadTime || 0));
  const minLoadTime = Math.min(
    ...loadedImages.map((img) => img.loadTime || 0).filter((time) => time > 0)
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">
        Image Loading Performance Test
      </h1>

      <div className="mb-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Number of Images (max 10):
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={imageCount}
              onChange={(e) =>
                setImageCount(Math.min(10, Math.max(1, Number(e.target.value))))
              }
              className="border p-2 rounded w-24"
              min="1"
              max="10"
            />
            <button
              onClick={generateImages}
              disabled={loading}
              className={`px-4 py-2 rounded font-medium ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? "Loading..." : "Load Images"}
            </button>
          </div>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded">
            <div className="text-center">
              <div className="text-sm text-gray-600">Average Load Time</div>
              <div className="text-xl font-semibold">
                {averageLoadTime.toFixed(2)} ms
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Max Load Time</div>
              <div className="text-xl font-semibold">
                {maxLoadTime.toFixed(2)} ms
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Min Load Time</div>
              <div className="text-xl font-semibold">
                {minLoadTime.toFixed(2)} ms
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-white p-4 rounded-lg shadow">
            <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
              {image.error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500">
                  Failed to load image
                </div>
              ) : (
                <img
                  src={image.url}
                  alt={`Test image ${image.id + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad(image.id)}
                  onError={handleImageError(image.id)}
                />
              )}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Image {image.id + 1}:{" "}
                {image.loadTime
                  ? `${image.loadTime.toFixed(2)} ms`
                  : image.error
                  ? "Error"
                  : "Loading..."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
