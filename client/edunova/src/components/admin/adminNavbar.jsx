import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from 'react-router-dom';

function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-sm px-6 py-4 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-indigo-600">EduNova</div>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:underline decoration-indigo-600"><Link to={'/adminDashBoard'}>Home</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to={'/admin/studentsManagement'}>Users</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to={'/courseManagement'}>Courses Approvel</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to={'/admin/instructorManagement'}>Instructors</Link></li>
          <li className="hover:underline decoration-indigo-600"><Link to={'/subscription'}>Revenue Details</Link></li>
        </ul>

        <div className="hidden md:flex items-center space-x-4">
          <button className="text-gray-700 font-medium">Muhammed Ajsal</button>
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
            <li><Link to={'/adminDashBoard'}>Home</Link></li>
            <li><Link to={'/admin/studentsManagement'}>Users</Link></li>
            <li><Link to={''}>Courses Approvel</Link></li>
            <li><Link to={'/admin/instructorManagement'}>Instructor</Link></li>
            <li><Link to={''}>Revenue Details</Link></li>
          </ul>
          <div className="flex flex-col space-y-2">
            <button className="text-gray-700 font-medium text-left">Muhammed Ajsal</button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default React.memo(AdminNavbar)