"use client";

import { motion } from "framer-motion";

export function FloatingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-4 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute top-1/2 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          x: [0, -50, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
