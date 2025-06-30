import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";

function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setProfileOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm px-6 py-4 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

        <div className="text-2xl font-bold text-indigo-600">EduNova</div>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:underline decoration-indigo-600"><Link to="/">Home</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to="/about">About</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to="/courses">Courses</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to="/findMentor">Mentorship</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to="/subscription">Subscriptions</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to="/community">Community Chat</Link></li>
        </ul>

        <div className="hidden md:flex items-center space-x-4 relative" ref={profileRef}>
          <button className="text-gray-600 hover:text-indigo-600">
            <FiBell size={20} />
          </button>

          <button onClick={toggleProfile} className="focus:outline-none">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-9 h-9 rounded-full border-2 border-indigo-500"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
              <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Log Out</button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-4">
          <ul className="flex flex-col space-y-2 text-gray-700 font-medium">
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/findMentor">Mentorship</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/subscription">Subscriptions</Link></li>
          </ul>

          <div ref={profileRef} className="flex items-center justify-between mt-4">
            <button className="text-gray-600 hover:text-indigo-600">
              <FiBell size={20} />
            </button>

            <button onClick={toggleProfile} className="focus:outline-none">
              <img
                src="https://i.pravatar.cc/40"
                alt="User"
                className="w-9 h-9 rounded-full border-2 border-indigo-500"
              />
            </button>
          </div>

          {profileOpen && (
            <div className="mt-2 w-full bg-white border rounded-lg shadow-lg py-2 z-50">
              <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Log Out</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default React.memo(UserNavbar)