import React, { useContext, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import UserContext from "../../../userContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const {user}=useContext(UserContext)
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold text-emerald-600">EduNova</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:underline decoration-emerald-600"><Link to="/">Home</Link></li>
          <li className="hover:underline decoration-emerald-600"><Link to="/about">About</Link></li>
          <li className="hover:underline decoration-emerald-600"><Link to="/courses">Courses</Link></li>
          <li className="hover:underline decoration-emerald-600"><Link to="/findMentor">Mentorship</Link></li>
          <li className="hover:underline decoration-emerald-600"><Link to="/subscription">Subscriptions</Link></li>
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <button className="text-gray-700 font-medium">
                <Link to="/login">Log in</Link>
              </button>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-md font-medium">
                <Link to="/register">Sign up</Link>
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user?.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border"
                />
                <span className="font-medium text-gray-700">{user?.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <ul className="py-2 text-gray-700">
                    <li>
                      <Link
                        to={
                          user?.role === "admin"
                            ? "/adminDashboard"
                            : user?.role === "instructor"
                            ? "/instructorDashboard"
                            : "/learningDashboard"
                        }
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-2">
          <ul className="flex flex-col space-y-2 text-gray-700 font-medium">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/findMentor">Mentorship</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/subscription">Subscriptions</Link></li>
          </ul>
          {!user ? (
            <div className="flex flex-col space-y-2">
              <button className="text-gray-700 font-medium text-left">
                <Link to="/login">Log in</Link>
              </button>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-md font-medium w-fit">
                <Link to="/register">Sign up</Link>
              </button>
            </div>
          ) : (
            <div className="border-t pt-4 space-y-2">
              <Link
                to={
                  user?.role === "admin"
                    ? "/adminDashboard"
                    : user?.role === "instructor"
                    ? "/instructorDashboard"
                    : "/userDashboard"
                }
                className="block px-2 py-1"
              >
                Dashboard
              </Link>
              <Link to="/profile" className="block px-2 py-1">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-left px-2 py-1 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default React.memo(Navbar);
