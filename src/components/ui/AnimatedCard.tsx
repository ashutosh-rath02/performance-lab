"use client";

import { motion } from "framer-motion";
import { Card } from "./card";
import type { MotionProps } from "framer-motion";

interface AnimatedCardProps extends Omit<MotionProps, "animate"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedCard({
  children,
  delay = 0,
  className = "",
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ scale: 1.02 }}
      className={className}
      {...props}
    >
      <Card>{children}</Card>
    </motion.div>
  );
}
