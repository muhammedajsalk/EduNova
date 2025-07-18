import React from "react";
import { FaStar, FaUserGraduate, FaEye, FaDollarSign, FaAddressCard, FaAddressBook, FaBook } from "react-icons/fa";


function InstructorDashboard() {
  const stats = [
    {
      label: "Total Revenue",
      value: "$12,458",
      sub: "+15% from last month",
      icon: <FaDollarSign className="text-green-500" />,
    },
    {
      label: "Active Students",
      value: "1,245",
      sub: "Current enrollments",
      icon: <FaUserGraduate className="text-blue-500" />,
    },
    {
      label: "Courses Total Watch Time",
      value: "45,678",
      sub: "Last 30 days",
      icon: <FaEye className="text-purple-500" />,
    },
    {
      label: "Total Courses",
      value: "1",
      sub: "Current total course",
      icon: <FaBook className="text-yellow-400" />,
    },
  ];


  const activities = [
    {
      message: 'New enrollment in "Advanced Web Development"',
      time: "2 hours ago",
    },
    {
      message: 'New comment on "Python Basics"',
      time: "4 hours ago",
    },
    {
      message: 'Student completed "UI/UX Design Fundamentals"',
      time: "6 hours ago",
    },
  ];
  return (
    <>
      <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Welcome back, John</h1>
        <p className="text-gray-600 mb-6">Here’s what’s happening with your courses</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
              <div className="text-2xl">{stat.icon}</div>
              <div>
                <h3 className="text-sm text-gray-500">{stat.label}</h3>
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-xs text-green-500">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <div className="space-x-2 text-sm text-gray-600">
              <button className="px-2 py-1 border rounded">Last 3 months</button>
            </div>
          </div>
          <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            Revenue Graph Placeholder
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {activities.map((activity, index) => (
              <li key={index} className="text-sm flex justify-between text-gray-700">
                <span>{activity.message}</span>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default React.memo(InstructorDashboard)