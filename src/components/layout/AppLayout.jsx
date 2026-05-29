import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { motion } from 'framer-motion';
import { ViewProvider, useViewMode } from '../context/ViewContext'; // 🧠 Import our fresh context engine

function LayoutContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAmbientMode } = useViewMode(); // 🧘 Grab the active view mode flag

  // If the everyday user is navigating, we forcefully collapse the sidebar to maximize screen calmness
  const dynamicLeftMargin = isAmbientMode ? 0 : (sidebarCollapsed ? 72 : 256);

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-500">
      {/* Only display the technical layout sidebar if we are in developer mode */}
      {!isAmbientMode && (
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      )}
      
      <motion.div
        animate={{ marginLeft: dynamicLeftMargin }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col min-h-screen"
      >
        <TopBar />
        <main className="flex-1 p-6">
          <Outlet /> {/* 🛰️ Sub-pages will read this view state dynamically below! */}
        </main>
      </motion.div>
    </div>
  );
}

// Wrap the export in our Provider so context parameters feed downstream seamlessly
export default function AppLayout() {
  return (
    <ViewProvider>
      <LayoutContent />
    </ViewProvider>
  );
}