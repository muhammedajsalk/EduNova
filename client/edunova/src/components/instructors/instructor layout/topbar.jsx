import { FaBars } from "react-icons/fa";

const Topbar = ({ onMenuClick }) => (
  <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
    <div className="flex items-center gap-4">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 text-xl"
        onClick={onMenuClick}
      >
        <FaBars />
      </button>
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
    </div>

    <div className="flex items-center gap-2">
      <img
        src="https://i.pravatar.cc/40"
        alt="avatar"
        className="rounded-full w-10 h-10"
      />
    </div>
  </header>
);

export default Topbar;
