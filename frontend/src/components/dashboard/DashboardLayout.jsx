import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#FAFBFE] min-h-dvh">
      <Sidebar role={user?.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col min-w-0 lg:ml-65">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}