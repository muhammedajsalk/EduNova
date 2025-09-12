import React, { useContext, useState, useRef, useEffect } from "react";
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
  ChevronRight,
  MoreHorizontal,
  Star,
  Award,
} from "lucide-react";
import UserContext from "../../../userContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, notificationCo, setNotificationCo } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef();


  useEffect(() => {
    axios.get(`http://localhost:5000/api/notification/${user._id}`)
      .then((res) => {
        const unread = res.data.filter(n => !n.read).length;
        setNotificationCo(unread);
      }
      )
      .catch((err) => console.log(err))
  }, [user._id])

  console.log(notificationCo,notificationCo)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logOut = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error("Logout failed. Try again.");
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "/learningDashboard",
      badge: null
    },
    {
      label: "My Courses",
      icon: <BookOpen size={20} />,
      path: "/learningDashboard/courses",
      badge: "3"
    },
    {
      label: "Community",
      icon: <Users size={20} />,
      path: "/community",
      badge: null
    },
    {
      label: "Notifications",
      icon: <Bell size={20} />,
      path: "/learningDashboard/notification",
      badge: `${notificationCo}`
    },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
      badge: null
    },
  ];

  const quickLinks = [
    { label: "Achievements", icon: <Award size={18} />, path: "/achievements" },
    { label: "Favorites", icon: <Star size={18} />, path: "/favorites" },
  ];

  return (
    <div className="flex bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-60 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} className="text-gray-700" />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-50 transform w-80 bg-white
          transition-all duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-80
          shadow-2xl md:shadow-lg border-r border-gray-100`}
      >
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  EduNova
                </h1>
                <p className="text-xs text-gray-500">Learning Platform</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Main Menu
            </h3>
            {navItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={i}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`group relative w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300
                    ${isActive
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-md border border-emerald-100"
                      : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`transition-colors duration-300 ${isActive ? "text-emerald-600" : "text-gray-500 group-hover:text-emerald-600"
                        }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight size={16} className="text-emerald-600" />
                    )}
                  </div>

                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={logOut}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
            >
              <span className="text-gray-500 group-hover:text-red-600 transition-colors">
                <LogOut size={20} />
              </span>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>

        <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50/30">
          <div className="p-6">
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <MoreHorizontal size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>

              {showProfileMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-slideUp">
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-600">Student Account</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User size={16} />
                      View Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings size={16} />
                      Account Settings
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Sidebar;