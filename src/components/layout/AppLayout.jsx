import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { motion } from 'framer-motion';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col min-h-screen"
      >
        <TopBar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}