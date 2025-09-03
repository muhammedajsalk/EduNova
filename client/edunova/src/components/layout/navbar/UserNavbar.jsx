import React, { useState, useRef, useEffect, useContext } from "react";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../../userContext";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const { user } = useContext(UserContext);
  const navigate=useNavigate()

  const desktopRef = useRef();
  const mobileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        setDesktopProfileOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const logOut=()=>{
    axios.post("http://localhost:5000/api/users/logout",{},{withCredentials:true})
    .then((res)=>{
      toast.success("logOut Successfully")
      setTimeout(() => {
        navigate("/login")
      }, 3000);
    })
    .catch((err)=>console.log(err))
  }

  return (
    <>
      <nav className="shadow-sm px-6 py-4 w-full fixed top-0 left-0 bg-white z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-emerald-600">EduNova</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/findMentor">Mentorship</Link></li>
          <li><Link to="/subscription">Subscriptions</Link></li>
        </ul>

        {/* Desktop Profile */}
        <div className="hidden md:flex items-center space-x-4 relative" ref={desktopRef}>
          <button aria-label="Notifications" className="text-gray-600 hover:text-emerald-600">
            <FiBell size={20} />
          </button>

          <button onClick={() => setDesktopProfileOpen((prev) => !prev)} className="flex items-center space-x-2 cursor-pointer" aria-label="Toggle profile menu">
            <img
              src={user.avatar}
              alt="User"
              className="w-9 h-9 rounded-full border-2 border-emerald-500"
            />
            <span className="text-sm font-medium text-gray-800">{user.name}</span>
          </button>

          {desktopProfileOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
              <Link to="/learningDashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={()=>logOut()}>Log Out</button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen((prev) => !prev)} aria-label="Toggle navigation">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-4">
          <ul className="flex flex-col space-y-2 text-gray-700 font-medium">
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/about" onClick={closeMenu}>About</Link></li>
            <li><Link to="/courses" onClick={closeMenu}>Courses</Link></li>
            <li><Link to="/findMentor" onClick={closeMenu}>Mentorship</Link></li>
            <li><Link to="/subscription" onClick={closeMenu}>Subscriptions</Link></li>
          </ul>

          {/* Mobile Profile */}
          <div ref={mobileRef} className="flex items-center justify-between mt-4">
            <button className="text-gray-600 hover:text-emerald-600">
              <FiBell size={20} />
            </button>

            <button onClick={() => setMobileProfileOpen((prev) => !prev)} className="flex items-center space-x-2 cursor-pointer">
              <img
                src={user.avatar}
                alt="User"
                className="w-9 h-9 rounded-full border-2 border-emerald-500"
              />
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
            </button>
          </div>

          {mobileProfileOpen && (
            <div className="mt-2 w-full bg-white border rounded-lg shadow-lg py-2 z-50">
              <Link to="/learningDashboard" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>Dashboard</Link>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>Profile</Link>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={()=>logOut()}>Log Out</button>
            </div>
          )}
        </div>
      )}
    </nav>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default React.memo(UserNavbar);
