"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart, Image, ListChecks, Database } from "lucide-react";

export function NavigationWrapper() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Activity },
    { href: "/scenarios/image-loading", label: "Image Loading", icon: Image },
    {
      href: "/scenarios/list-rendering",
      label: "List Rendering",
      icon: ListChecks,
    },
    {
      href: "/scenarios/data-fetching",
      label: "Data Fetching",
      icon: Database,
    },
    { href: "/benchmark", label: "Benchmarks", icon: BarChart },
  ];

  return (
    <nav className="bg-white shadow-lg mb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-8 h-16">
            {/* Logo/Brand section */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Performance Lab
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200
                      ${
                        isActive
                          ? "border-blue-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    <Icon
                      className={`w-4 h-4 mr-2 ${
                        isActive ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  isActive
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }
                block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                <div className="flex items-center">
                  <Icon
                    className={`w-4 h-4 mr-2 ${
                      isActive ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
