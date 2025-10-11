import React, { useState, useRef, useEffect, useContext } from "react";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import UserContext from "../../../userContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function InstructorNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useContext(UserContext);
  const profileRef = useRef();

  const toggleMenu = () => setIsOpen((prev) => !prev);
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

  const logOut=()=>{
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/logout`,{},{withCredentials:true})
      .then((res)=>{
        toast.success("logOut Successfully")
        setTimeout(() => {
          navigate("/login")
        }, 3000);
      })
      .catch((err)=>{})
    }

  return (
    <>
     <nav className="bg-white shadow-sm px-6 py-4 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-emerald-600">EduNova</div>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:underline decoration-emerald-600"><Link to="/">Home</Link></li>
          <li className="hover:underline decoration-emerald-600"><Link to="/about">About</Link></li>
          <li className="hover:underline decoration-emerald-600"><Link to="/courses">Courses</Link></li>
          <li className="hover:underline decoration-emerald-600"><Link to="/findMentor">Mentorship</Link></li>
        </ul>

        <div
          className="hidden md:flex items-center space-x-4 relative"
          ref={profileRef}
        >
          <button
            className="text-gray-600 hover:text-emerald-600"
            aria-label="Notifications"
          >
            <FiBell size={20} />
          </button>

          <button
            onClick={toggleProfile}
            className="flex items-center space-x-2 cursor-pointer focus:outline-none"
            aria-haspopup="true"
            aria-expanded={profileOpen}
            aria-label="User menu"
          >
            <img
              src={user.avatar}
              alt={`${user.name} avatar`}
              className="w-9 h-9 rounded-full border-2 border-emerald-500"
            />
            <span className="text-sm font-medium text-gray-800">{user.name}</span>
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg py-2 z-50"
              role="menu"
              aria-orientation="vertical"
              aria-label="User profile dropdown"
            >
              <Link
                to="/instructorDashBoard"
                className="block px-4 py-2 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </Link>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  logOut()
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-gray-700 focus:outline-none"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-4">
          <ul className="flex flex-col space-y-2 text-gray-700 font-medium">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/courses" onClick={() => setIsOpen(false)}>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/findMentor" onClick={() => setIsOpen(false)}>
                Mentorship
              </Link>
            </li>
          </ul>

          <div
            className="flex items-center justify-between mt-4 relative"
            ref={profileRef}
          >
            <button
              className="text-gray-600 hover:text-emerald-600"
              aria-label="Notifications"
            >
              <FiBell size={20} />
            </button>

            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              aria-label="User menu"
            >
              <img
                src={user.avatar}
                alt={`${user.name} avatar`}
                className="w-9 h-9 rounded-full border-2 border-emerald-500"
              />
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
            </button>

            {profileOpen && (
              <div
                className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg py-2 z-50"
                role="menu"
                aria-orientation="vertical"
                aria-label="User profile dropdown"
              >
                <Link
                  to="/instructorDashBoard"
                  className="block px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    setIsOpen(false);
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    setIsOpen(false);
                  }}
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    setIsOpen(false);
                    logOut()
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    <ToastContainer position="top-right" autoClose={3000} />
    </>  
  );
}

export default React.memo(InstructorNavbar);
