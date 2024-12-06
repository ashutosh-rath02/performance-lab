"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NavigationWrapper } from "@/components/ui/NavigationWrapper";
import { FloatingBackground } from "@/components/ui/FloatingBackground";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50/90 relative overflow-hidden">
      <FloatingBackground />
      <NavigationWrapper />

      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.main
            key={pathname}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="container mx-auto px-4 py-6 relative z-10"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6"
            >
              {children}
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
