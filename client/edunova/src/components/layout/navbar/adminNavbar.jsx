import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const navigate = useNavigate();

  const logOut = () => {
    axios
      .post("http://localhost:5000/api/users/logout", {}, { withCredentials: true })
      .then((res) => {
        toast.success("Logged out successfully");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <nav className="bg-white shadow-sm px-6 py-4 w-full fixed top-0 left-0 z-50">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-emerald-600">EduNova</div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <li className="hover:underline decoration-emerald-600">
              <Link to={"/adminDashBoard"}>Home</Link>
            </li>
            <li className="hover:underline decoration-emerald-600">
              <Link to={"/admin/studentsManagement"}>Users</Link>
            </li>
            <li className="hover:underline decoration-emerald-600">
              <Link to={"/courseManagement"}>Courses</Link>
            </li>
            <li className="hover:underline decoration-emerald-600">
              <Link to={"/admin/instructorManagement"}>Instructors</Link>
            </li>
            <li className="hover:underline decoration-emerald-600">
              <Link to={"/adminRevenew"}>Revenue</Link>
            </li>
          </ul>

          {/* Profile Dropdown (Desktop) */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <button
              onClick={toggleDropdown}
              className="text-gray-700 font-medium focus:outline-none"
            >
              Muhammed Ajsal
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <button
                  onClick={logOut}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 px-2">
            <ul className="flex flex-col space-y-2 text-gray-700 font-medium">
              <li>
                <Link to={"/adminDashBoard"}>Home</Link>
              </li>
              <li>
                <Link to={"/admin/studentsManagement"}>Users</Link>
              </li>
              <li>
                <Link to={""}>Courses Approvel</Link>
              </li>
              <li>
                <Link to={"/admin/instructorManagement"}>Instructor</Link>
              </li>
              <li>
                <Link to={"/adminRevenew"}>Revenue</Link>
              </li>
            </ul>

            <div className="flex flex-col space-y-2 relative">
              <button
                onClick={toggleDropdown}
                className="text-gray-700 font-medium text-left"
              >
                Muhammed Ajsal
              </button>

              {dropdownOpen && (
                <div className="mt-2 w-full bg-white border rounded-lg shadow-lg z-50">
                  <button
                    onClick={logOut}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
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

export default React.memo(AdminNavbar);
