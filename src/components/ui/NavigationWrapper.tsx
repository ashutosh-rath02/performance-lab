"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationWrapper() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/scenarios/image-loading", label: "Image Loading" },
    { href: "/scenarios/list-rendering", label: "List Rendering" },
    { href: "/scenarios/data-fetching", label: "Data Fetching" },
    { href: "/benchmark", label: "Benchmarks" },
  ];

  return (
    <nav className="bg-white shadow-lg mb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 h-16">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === link.href
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
