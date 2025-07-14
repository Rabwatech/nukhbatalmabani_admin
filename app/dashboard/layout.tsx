'use client';

import { DirectionProvider } from '@/context/DirectionContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DirectionProvider>
      <div className="min-h-screen bg-deep-black text-elegant-white font-noto-kufi">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-72 rtl:lg:pl-0 rtl:lg:pr-72 transition-all duration-300">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DirectionProvider>
  );
}