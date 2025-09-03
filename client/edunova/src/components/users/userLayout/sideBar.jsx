import React, { useContext, useState } from "react";
import {
  Home,
  BookOpen,
  Users,
  X,
  Mail,
  Settings,
  Menu,
  Search,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import UserContext from "../../../userContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Logout failed. Try again.");
    }
  };

  const navItems = [
    { label: "Home", icon: <Home size={20} />, path: "/" },
    { label: "Courses", icon: <BookOpen size={20} />, path: "/learningDashboard/courses" },
    { label: "Community Chat", icon: <Users size={20} />, path: "/community" },
    { label: "Messages", icon: <Mail size={20} />, path: "/messages" },
    { label: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
    { label: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-60 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} className="text-gray-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform w-72 bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-72
          shadow-xl md:shadow-none`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-emerald-600">EduNova</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Medium"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-1">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${isActive ? "bg-emerald-100 text-emerald-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
              >
                <span
                  className={`transition-colors ${
                    isActive ? "text-emerald-600" : "text-gray-500 group-hover:text-emerald-600"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={logOut}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 transition-all duration-200 group"
          >
            <span className="text-gray-500 group-hover:text-red-600">
              <LogOut size={20} />
            </span>
            <span className="font-medium group-hover:text-red-700">Logout</span>
          </button>
        </nav>

        {/* Divider */}
        <div className="mx-6 border-t border-gray-200 my-4"></div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-purple-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Sidebar;
