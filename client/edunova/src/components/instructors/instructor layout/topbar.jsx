import React, { useState, useRef, useEffect, useContext } from "react";
import { FaBars } from "react-icons/fa";
import UserContext from "../../../userContext";
import { Link } from "react-router-dom";

const Topbar = ({ onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const {user}=useContext(UserContext)

  console.log(user)

  const users= {
    name: user.name,
    avatar: user.avatar,
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700 text-xl" onClick={onMenuClick}>
          <FaBars />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="hidden md:block font-medium text-gray-800">{users.name}</span>
          <img
            src={users.avatar}
            alt="avatar"
            className="rounded-full w-10 h-10"
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-white border rounded-md shadow-md z-50">
            <div className="px-4 py-2 border-b text-sm text-gray-700 font-semibold">
              {users.name}
            </div>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              <Link to={'/'}>
                 Home
              </Link>
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Profile
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
export default React.memo(Topbar);
