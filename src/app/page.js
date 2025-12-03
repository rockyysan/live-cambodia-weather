"use client";

import "flag-icons/css/flag-icons.min.css";
import CambodiaMap from "@/components/CambodiaMap";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex justify-center items-start px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl sticky top-4">
          <CambodiaMap />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-sm border-t border-gray-200">
        Interactive Cambodia Provinces Map • Built with Next.js + React
      </footer>
    </div>
  );
}
