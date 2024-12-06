"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Skeleton Loader */}
        <div className="space-y-6 w-full max-w-2xl">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Content Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white space-y-3"
              >
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
