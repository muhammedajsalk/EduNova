import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-sm px-6 py-4 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-indigo-600">EduNova</div>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:underline decoration-indigo-600"><Link to={'/'}>Home</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to={'/about'}>About</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to={'/courses'}>Courses</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to={'/findMentor'}>Mentorship</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to={'/subscription'}>Subscriptions</Link></li>
        </ul>

        <div className="hidden md:flex items-center space-x-4">
          <button className="text-gray-700 font-medium"><Link to={'/login'}>Log in</Link></button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium">
            <Link to={'/register'}>Sign up</Link>
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-2">
          <ul className="flex flex-col space-y-2 text-gray-700 font-medium">
            <li><a href="#">Courses</a></li>
            <li><a href="#">Mentorship</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">About</a></li>
          </ul>
          <div className="flex flex-col space-y-2">
            <button className="text-gray-700 font-medium text-left"><Link to={'/login'}>Log in</Link></button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium w-fit">
              <Link to={'/register'}>Sign up</Link>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default React.memo(Navbar)