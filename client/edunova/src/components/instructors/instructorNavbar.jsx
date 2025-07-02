import React, { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function InstructorNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const profileImage = "https://i.pravatar.cc/40";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // logout logic here (e.g., remove token, call API)
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", to: "/instructorDashBoard" },
    { label: "Courses", to: "/instructor/Allcourse" },
    { label: "Mentor Section", to: "/" },
    { label: "Revenue Details", to: "/" },
  ];

  return (
    <nav className="bg-white shadow-sm px-6 py-4 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-indigo-600">EduNova</div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <li key={link.to} className="hover:underline decoration-indigo-600">
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop Profile */}
        <div className="hidden md:flex items-center relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2"
          >
            <img
              src={profileImage}
              alt="Instructor"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-700 font-medium">Muhammed Ajsal</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded-lg shadow z-50">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">Profile</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-2 space-y-4">
          <ul className="flex flex-col space-y-2 text-gray-700 font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>

          {/* Mobile Profile Dropdown */}
          <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2"
            >
              <img
                src={profileImage}
                alt="Instructor"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">Muhammed Ajsal</span>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-40 bg-white border rounded-lg shadow z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default React.memo(InstructorNavbar);
