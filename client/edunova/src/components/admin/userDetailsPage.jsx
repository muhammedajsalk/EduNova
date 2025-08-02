import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Simple Skeleton Components
const ProfileHeaderSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-300"></div>
        <div>
          <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-300 rounded-full w-24"></div>
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          </div>
        </div>
      </div>
      <div className="h-10 bg-gray-300 rounded w-32"></div>
    </div>
  </div>
);

const SubscriptionSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow mt-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-5 bg-gray-300 rounded w-24"></div>
        </div>
      ))}
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow mt-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {[...Array(4)].map((_, i) => (
              <th key={i} className="p-3">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(3)].map((_, i) => (
            <tr key={i} className="border-t">
              {[...Array(4)].map((_, j) => (
                <td key={j} className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Sample data



const ITEMS_PER_PAGE = 3;

function UserProfile() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([])
  const { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:5000/api/admin/userById/${id}`, { withCredentials: true })
      .then((res) => {
        setData(res.data.data)
        setAllCourses(res.data?.data?.enrolledCourses)
      }
      )
      .catch((err) => console.log(err))
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const formattedEndDate = data?.subscriptionId?.endDate
    ? new Date(data.subscriptionId.endDate).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full"
    })
    : "";

  function BlockAndUnblock() {
    if (data.isActive) {
      axios.post(`http://localhost:5000/api/admin/userBlockAndUnblock/${id}`, { isActive: false }, { withCredentials: true })
        .then((res) => {
          axios.get(`http://localhost:5000/api/admin/userById/${id}`, { withCredentials: true })
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err))
          toast.success(res.data.message)
        }
        )
        .catch((err) => toast.error(err.response?.data?.message || err.message))
    } else {
      axios.post(`http://localhost:5000/api/admin/userBlockAndUnblock/${id}`, { isActive: true }, { withCredentials: true })
        .then((res) => {
          axios.get(`http://localhost:5000/api/admin/userById/${id}`, { withCredentials: true })
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err))
          toast.success(res.data.message)
        })
        .catch((err) => toast.error(err.response?.data?.message || err.message))
    }
  }

  function properDate(dateInput) {
    const date = new Date(dateInput); // ensure it's a Date object
    if (isNaN(date)) return 'Invalid Date'; // handle bad input
    return date.toISOString().split('T')[0]; // returns 'YYYY-MM-DD'
  }


  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = allCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(allCourses.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen mt-10">
        <ProfileHeaderSkeleton />
        <SubscriptionSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen text-gray-800 mt-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {data.provider === "google" ? "Google Account" : "Manual Account"}
                </span>
                <span className={data.isActive
                  ? "text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full"
                  : "text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full"}>
                  {data.isActive ? "Active" : "Block"}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => BlockAndUnblock()} className={data.isActive ? "bg-red-100 text-red-600 px-4 py-2 rounded" : "bg-green-100 text-green-600 px-4 py-2 rounded"}>{data.isActive ? "Block Account" : "Active Account"}</button>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="bg-white p-6 rounded-lg shadow mt-6 hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Plan</p>
            <p className="font-medium">{data?.subscriptionId ? data?.subscriptionId?.notes?.courseId : "No Subscribed"}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className={data?.subscriptionId?.isActive ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {data?.subscriptionId?.isActive ? "● Active" : "●Inactive"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Billing Period</p>
            <p className="font-medium">{data?.subscriptionId?.planType}</p>
          </div>
          <div>
            <p className="text-gray-500">Next Payment</p>
            <p className="font-medium">{formattedEndDate}</p>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Table */}
      <div className="bg-white p-6 rounded-lg shadow mt-6 hover:shadow-md transition-shadow duration-200">
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
                <tr key={idx} className="border-t hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-3">{course?.course?.title}</td>
                  <td className="p-3">{properDate(course.courseStartDate)}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${course.status === "Completed"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-green-100 text-green-600"
                      }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="p-3 text-blue-600 cursor-pointer hover:underline">
                    {course?.course?.instructorId?.name}
                  </td>
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
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 ${currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default UserProfile;