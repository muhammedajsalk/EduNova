import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sideBar";
import { FaBars } from "react-icons/fa"; // ✅ Import this

const UserDashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1">
        {/* ✅ Add toggle button here */}
        <div className="md:hidden p-4 shadow bg-white flex items-center justify-between">
          <button onClick={() => setIsOpen(true)} aria-label="Open sidebar">
            <FaBars className="text-xl text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-emerald-600">Instructor Panel</h1>
        </div>

        {/* Main Content */}
        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
