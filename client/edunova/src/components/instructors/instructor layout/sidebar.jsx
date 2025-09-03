import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  DollarSign,
  Settings,
  Activity,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { FiMenu } from "react-icons/fi";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import UserContext from "../../../userContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const InstructorSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const logOut = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Logout failed. Try again.");
      toast.error("Logout failed. Try again.");
    }
  };

  const navItems = [
    { label: "Dashboard", icon: <Home size={18} />, path: "/instructorDashboard" },
    { label: "My Courses", icon: <BookOpen size={18} />, path: "/instructorDashboard/courses" },
    { label: "Student Message", icon: <Users size={18} />, path: "/instructorDashboard/student_message" },
    { label: "Mentor Section", icon: <Activity size={18} />, path: "/instructorDashboard/Mentorship/scheduledStudent" },
    { label: "Earnings", icon: <DollarSign size={18} />, path: "/instructorDashboard/earnings" },
    { label: "Setting", icon: <Settings size={18} />, path: "/instructorDashboard/earnings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow border border-gray-200"
        aria-label="Toggle sidebar"
      >
        <FiMenu size={20} className="text-gray-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform w-72 bg-white border-r border-gray-200
        transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:w-72 shadow-xl md:shadow-none`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-emerald-600">EduNova</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close sidebar"
          >
            <FaTimes className="text-gray-500" size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-1">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 group
                ${isActive ? "bg-emerald-100 text-emerald-700 font-semibold" : ""}`
              }
            >
              <span className="text-gray-500 group-hover:text-emerald-600">{item.icon}</span>
              <span className="font-medium group-hover:text-gray-900">{item.label}</span>
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            onClick={logOut}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 transition-all duration-200 group"
          >
            <span className="text-gray-500 group-hover:text-red-600">
              <LogOut size={18} />
            </span>
            <span className="font-medium group-hover:text-red-700">Logout</span>
          </button>
        </nav>

        {/* Divider */}
        <div className="mx-6 border-t border-gray-200 my-4"></div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-purple-600 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-white" size={20} />
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default InstructorSidebar;
