import React from 'react';
import { Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-agri-700 text-white p-1.5 rounded-lg">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">AgriQueue</span>
            <p className="text-xs text-gray-500">Book. Queue. Procure. Get Paid.</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center sm:text-right">
          &copy; {new Date().getFullYear()} AgriQueue. Smart Agricultural Procurement Queue Management System.
        </p>
      </div>
    </footer>
  );
}
