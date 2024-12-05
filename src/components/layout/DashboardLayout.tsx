import React from "react";
import { NavigationWrapper } from "@/components/ui/NavigationWrapper";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationWrapper />

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>
      </main>

      {/* Page loading progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-1">
        <div className="loading-bar"></div>
      </div>

      {/* Toast notifications container */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="space-y-2" id="toast-container"></div>
      </div>
    </div>
  );
}
