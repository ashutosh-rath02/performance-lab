"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingScreen() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo animation */}
        <div className="mb-8 relative">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              borderWidth: ["4px", "2px", "4px"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full"
            animate={{
              rotate: [0, 720],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Loading text */}
        <div className="flex space-x-1">
          {["L", "o", "a", "d", "i", "n", "g", ".", ".", "."].map(
            (letter, i) => (
              <motion.span
                key={i}
                className="text-lg font-medium text-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                {letter}
              </motion.span>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
