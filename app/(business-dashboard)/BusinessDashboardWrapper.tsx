'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BusinessSidebar } from '@/components/business_dashboard/business-sidebar';

export default function BusinessDashboardWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar with Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow sticky top-0 z-40">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-6 w-6 text-[#000032]" />
        </button>
        <h2 className="font-semibold text-[#000032]">Business Dashboard</h2>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Sidebar - slide in from left */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-[#000032]">Menu</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <BusinessSidebar onLinkClick={() => setSidebarOpen(false)} forceExpanded={true} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <BusinessSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-[3.5rem] p-4 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}