import React, { useState, useRef, useEffect, useContext } from "react";
import { FiMenu, FiX, FiBell, FiUser, FiLogOut, FiSettings, FiHome, FiUsers, FiBook, FiDollarSign } from "react-icons/fi";
import {
  Bell,
  Check,
  X,
  Search,
  Filter,
  Trash2,
  Archive,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Calendar,
  MessageSquare,
  User,
  ShoppingBag,
  Settings,
  ChevronDown,
  MoreVertical,
  Clock,
  Mail,
  Eye
} from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import UserContext from "../../../userContext";
import { getIcon } from "../../../../../../server/utilis/iconMap";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", {
  withCredentials: true,
});

function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotification] = useState([])
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const desktopRef = useRef();
  const mobileRef = useRef();
  const notificationRef = useRef();

  const adminUser = {
    name: "Muhammed Ajsal",
    email: "admin@edunova.com",
    avatar: null
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        setDesktopProfileOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const logOut = () => {
    axios
      .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
      .then((res) => {
        toast.success("Logged out successfully");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => {
        toast.error("Error logging out");
        
      });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const diff = (new Date() - date) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const navLinks = [
    { path: "/adminDashBoard", label: "Dashboard", icon: FiHome },
    { path: "/admin/studentsManagement", label: "Users", icon: FiUsers },
    { path: "/courseManagement", label: "Courses", icon: FiBook },
    { path: "/admin/instructorManagement", label: "Instructors", icon: FiUsers },
    { path: "/adminRevenew", label: "Revenue", icon: FiDollarSign },
  ];

  const isActivePath = (path) => location.pathname === path;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/notification/${user._id}`)
      .then((res) => setNotification(res.data.slice(0, 4)))
      .catch((err) => {})
  }, [user._id])

  useEffect(() => {
    socket.on("notification", (data) => {
      if (data.userId === user._id) {
        setNotification((prev) => [...prev, data]);
      }
    })
    return () => {
      socket.off("notification");
    };
  }, [])



  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg px-4 md:px-6 py-4 w-full fixed top-0 left-0 z-50 border-b border-gray-100">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <Link to="/adminDashBoard" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EduNova
            </span>
            <span className="hidden sm:inline-block px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-semibold rounded-full">
              Admin
            </span>
          </Link>

          <ul className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`
                    relative px-4 py-2 rounded-lg font-medium transition-all duration-300
                    ${isActivePath(link.path)
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {link.label}
                  {isActivePath(link.path) && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center space-x-3">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-300"
                aria-label="Notifications"
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3">
                    <h3 className="font-semibold">Admin Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? "bg-emerald-50/50" : ""
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 flex items-start gap-2">
                            {(() => {
                              const IconComp = getIcon(notif.icon);
                              return <IconComp size={20} className="text-gray-500 mt-1" />;
                            })()}
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                              <p className="text-gray-600 text-xs mt-1">{notif.message}</p>
                            </div>
                          </div>

                          <span className="text-xs text-gray-500">{formatTime(notif.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 text-center border-t border-gray-100">
                    <Link to={'/admin/notification'}>
                      <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
                        View all notifications
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={desktopRef}>
              <button
                onClick={() => setDesktopProfileOpen(!desktopProfileOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                aria-label="Toggle profile menu"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {adminUser.avatar ? (
                      <img
                        src={adminUser.avatar}
                        alt="Admin"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <FiUser size={20} className="text-white" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${desktopProfileOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {desktopProfileOpen && (
                <div className="absolute right-0 top-14 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                  <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                        <FiUser size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{adminUser.name}</p>
                        <p className="text-xs text-gray-600">{adminUser.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/admin/profile"
                      className="flex items-center space-x-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors group"
                      onClick={() => setDesktopProfileOpen(false)}
                    >
                      <FiUser className="text-gray-400 group-hover:text-emerald-600" />
                      <span className="text-gray-700 group-hover:text-emerald-600">Admin Profile</span>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center space-x-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors group"
                      onClick={() => setDesktopProfileOpen(false)}
                    >
                      <FiSettings className="text-gray-400 group-hover:text-emerald-600" />
                      <span className="text-gray-700 group-hover:text-emerald-600">System Settings</span>
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      className="flex items-center space-x-3 px-4 py-2.5 w-full hover:bg-red-50 transition-colors group"
                      onClick={logOut}
                    >
                      <FiLogOut className="text-gray-400 group-hover:text-red-600" />
                      <span className="text-gray-700 group-hover:text-red-600">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <button className="relative p-2 text-gray-600">
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <div className="px-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${isActivePath(link.path)
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-4 py-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <FiUser size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{adminUser.name}</p>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <Link
                  to="/admin/profile"
                  onClick={closeMenu}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiUser size={20} />
                  <span>Admin Profile</span>
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={closeMenu}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiSettings size={20} />
                  <span>System Settings</span>
                </Link>
                <button
                  onClick={logOut}
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiLogOut size={20} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
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
    </>
  );
}

export default React.memo(AdminNavbar);