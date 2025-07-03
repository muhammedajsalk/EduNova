import { NavLink } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaDollarSign,
  FaPlus,
  FaHome,
  FaTimes,
  FaAdn,
} from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { label: "Home", icon: <FaHome />, path: "/instructorDashBoard" },
    { label: "My Courses", icon: <FaBook />, path: "/instructorDashBoard/courses" },
    { label: "Student Message", icon: <FaUsers />, path: "/instructor/student_message" },
    { label: "Mentor section", icon: <FaAdn />, path: "/instructor/mentor_section" },
    { label: "Earnings", icon: <FaDollarSign />, path: "/instructor/earnings" }
  ];

  return (
    <aside
      className={`
        fixed z-50 inset-y-0 left-0 transform bg-white w-64 shadow-md 
        transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block
      `}
    >
      <div className="p-4 flex justify-between items-center md:hidden">
        <div className="text-xl font-bold text-indigo-600">Menu</div>
        <button onClick={() => setIsOpen(false)}>
          <FaTimes className="text-xl text-gray-700" />
        </button>
      </div>

      <div className="p-4 text-2xl font-bold text-indigo-600 hidden md:block">
        Instructor
      </div>

      <nav className="mt-4 space-y-2 px-4">
        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded text-gray-700 hover:bg-indigo-100 ${
                isActive ? "bg-indigo-200 font-semibold" : ""
              }`
            }
            onClick={() => setIsOpen(false)} // close on link click
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
