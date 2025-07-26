import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sideBar";

const UserDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1">
        <main className="p-4 overflow-y-auto mt-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;