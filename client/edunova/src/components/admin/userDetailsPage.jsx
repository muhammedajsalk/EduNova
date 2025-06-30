import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const allCourses = [
  { name: "Advanced Web Development", date: "Nov 1, 2023", progress: 45, status: "Active" },
  { name: "UI/UX Design Fundamentals", date: "Oct 15, 2023", progress: 78, status: "Active" },
  { name: "Data Science Basics", date: "Sep 30, 2023", progress: 92, status: "Completed" },
  { name: "React with TypeScript", date: "Aug 5, 2023", progress: 65, status: "Active" },
  { name: "Machine Learning 101", date: "Jul 20, 2023", progress: 100, status: "Completed" },
  { name: "Responsive Web Design", date: "Jun 30, 2023", progress: 25, status: "Active" },
];

const ITEMS_PER_PAGE = 3;

function UserProfile() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data,setData]=useState([])

  const {id}=useParams()

  useEffect(()=>{
     axios.get(`http://localhost:5000/api/admin/userById/${id}`)
     .then((res)=>setData(res.data.data))
     .catch((err)=>console.log(err))
  },[])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = allCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(allCourses.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={data.avatar}
            alt="User"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold">{data.name}</h2>
            <p className="text-sm text-gray-500">{data.email}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{data.provider==="google"?"Google Account":"Manual Account"}</span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">{data.isActive?"Active":"Block"}</span>
            </div>
          </div>
        </div>
        <button className="bg-red-100 text-red-600 px-4 py-2 rounded">Block Account</button>
      </div>

      {/* Subscription Details */}
      <div className="bg-white p-6 rounded-lg shadow mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Plan</p>
          <p className="font-medium">Pro Plan</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <p className="text-green-600 font-medium">● Active</p>
        </div>
        <div>
          <p className="text-gray-500">Billing Period</p>
          <p className="font-medium">Monthly</p>
        </div>
        <div>
          <p className="text-gray-500">Next Payment</p>
          <p className="font-medium">$29.99/month on Dec 20, 2023</p>
        </div>
      </div>

      {/* Enrolled Courses Table */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">Enrolled Courses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Course Name</th>
                <th className="p-3 text-left">Enrollment Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Instructor Name</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.map((course, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{course.name}</td>
                  <td className="p-3">{course.date}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        course.status === "Completed"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="p-3 text-blue-600 cursor-pointer">Instructor Name</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, allCourses.length)} of {allCourses.length} entries
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UserProfile)