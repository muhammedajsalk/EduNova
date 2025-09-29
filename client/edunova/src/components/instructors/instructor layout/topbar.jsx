import React from "react";
import { FaBars } from "react-icons/fa";

const Topbar = ({ setIsSidebarOpen }) => {
  return (
    <header className="text-white p-4 flex justify-between items-center z-50 md:pl-64">
      <button
        className="text-2xl md:hidden p-2 rounded-md hover:bg-emerald-700 transition-colors"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars className="text-black"/>
      </button>
    </header>
  );
};

export default React.memo(Topbar);