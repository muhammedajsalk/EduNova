import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sideBar";
import { FaBars } from "react-icons/fa";

const UserDashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow z-30">
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-700 text-xl focus:outline-none"
          >
            <FaBars />
          </button>
          <h1 className="text-lg font-semibold text-emerald-600">
            Instructor Panel
          </h1>
        </div>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
