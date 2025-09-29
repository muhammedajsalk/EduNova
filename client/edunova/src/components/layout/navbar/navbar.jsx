import React, { useContext, useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiHome, FiInfo, FiBook, FiUsers, FiCreditCard } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../../../userContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    
  };

  const navLinks = [
    { path: "/", label: "Home", icon: FiHome },
    { path: "/about", label: "About", icon: FiInfo },
    { path: "/courses", label: "Courses", icon: FiBook },
    { path: "/findMentor", label: "Mentorship", icon: FiUsers },
    { path: "/subscription", label: "Subscriptions", icon: FiCreditCard },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg px-4 md:px-6 py-4 w-full fixed top-0 left-0 z-50 border-b border-gray-100">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EduNova
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

          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-300"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                  aria-label="Toggle profile menu"
                >
                  <div className="relative">
                    <img
                      src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-emerald-400 group-hover:border-emerald-500 transition-colors"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || "Student"}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-14 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
                          alt="User"
                          className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{user?.name}</p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to={
                          user?.role === "admin"
                            ? "/adminDashboard"
                            : user?.role === "instructor"
                            ? "/instructorDashboard"
                            : "/learningDashboard"
                        }
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiBook className="text-gray-400 group-hover:text-emerald-600" />
                        <span className="text-gray-700 group-hover:text-emerald-600">Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUsers className="text-gray-400 group-hover:text-emerald-600" />
                        <span className="text-gray-700 group-hover:text-emerald-600">Profile</span>
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 w-full hover:bg-red-50 transition-colors group"
                      >
                        <FiX className="text-gray-400 group-hover:text-red-600" />
                        <span className="text-gray-700 group-hover:text-red-600">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0 overflow-hidden"
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
              {!user ? (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <img
                      src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
                      alt="User"
                      className="w-12 h-12 rounded-full border-2 border-emerald-400"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role || "Student"}</p>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1">
                    <Link
                      to={
                        user?.role === "admin"
                          ? "/adminDashboard"
                          : user?.role === "instructor"
                          ? "/instructorDashboard"
                          : "/learningDashboard"
                      }
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FiBook size={20} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FiUsers size={20} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiX size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
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
    </>
  );
}

export default React.memo(Navbar);