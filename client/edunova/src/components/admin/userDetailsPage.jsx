import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ProfileHeaderSkeleton = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <div className="space-y-3">
          <div className="h-7 bg-gray-200 rounded-lg w-48"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-64"></div>
          <div className="flex gap-3">
            <div className="h-7 bg-gray-200 rounded-full w-28"></div>
            <div className="h-7 bg-gray-200 rounded-full w-20"></div>
          </div>
        </div>
      </div>
      <div className="h-11 bg-gray-200 rounded-xl w-36"></div>
    </div>
  </div>
);

const SubscriptionSkeleton = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-lg w-48 mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-lg w-40 mb-6"></div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {[...Array(4)].map((_, i) => (
              <th key={i} className="p-4 text-left">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(3)].map((_, i) => (
            <tr key={i} className="border-b border-gray-50">
              {[...Array(4)].map((_, j) => (
                <td key={j} className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StatusBadge = ({ status, type = "default" }) => {
  const getStatusStyles = () => {
    const baseStyles = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    
    if (type === "user") {
      return status 
        ? `${baseStyles} bg-emerald-50 text-emerald-700 border border-emerald-200`
        : `${baseStyles} bg-red-50 text-red-700 border border-red-200`;
    }
    
    if (type === "subscription") {
      return status 
        ? `${baseStyles} bg-emerald-50 text-emerald-700 border border-emerald-200`
        : `${baseStyles} bg-gray-50 text-gray-700 border border-gray-200`;
    }
    
    if (type === "course") {
      return status === "Completed"
        ? `${baseStyles} bg-blue-50 text-blue-700 border border-blue-200`
        : `${baseStyles} bg-emerald-50 text-emerald-700 border border-emerald-200`;
    }
    
    return `${baseStyles} bg-gray-50 text-gray-700 border border-gray-200`;
  };

  const getStatusText = () => {
    if (type === "user") return status ? "Active" : "Blocked";
    if (type === "subscription") return status ? "Active" : "Inactive";
    return status;
  };

  return (
    <span className={getStatusStyles()}>
      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
        type === "user" 
          ? status ? "bg-emerald-500" : "bg-red-500"
          : status ? "bg-emerald-500" : "bg-gray-400"
      }`} />
      {getStatusText()}
    </span>
  );
};

const InfoCard = ({ label, value, icon, highlight = false }) => (
  <div className={`p-4 rounded-xl border transition-all duration-200 ${
    highlight 
      ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" 
      : "bg-gray-50 border-gray-200"
  }`}>
    <div className="flex items-center gap-2 mb-1">
      {icon && <span className="text-gray-500">{icon}</span>}
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
    <p className={`font-semibold ${highlight ? "text-blue-900" : "text-gray-900"}`}>
      {value || "Not available"}
    </p>
  </div>
);

const ITEMS_PER_PAGE = 5;

function UserProfile() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/userById/${id}`, 
        { withCredentials: true }
      );
      setData(response.data.data);
      setAllCourses(response.data?.data?.enrolledCourses || []);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatSimpleDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch {
      return "Invalid date";
    }
  };

  const handleBlockUnblock = async () => {
    setActionLoading(true);
    try {
      const newStatus = !data.isActive;
      await axios.post(
        `http://localhost:5000/api/admin/userBlockAndUnblock/${id}`,
        { isActive: newStatus },
        { withCredentials: true }
      );
      
      await fetchUserData();
      toast.success(`User ${newStatus ? 'unblocked' : 'blocked'} successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = allCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(allCourses.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 md:p-10 pt-20">
        <div className="max-w-7xl mx-auto space-y-8">
          <ProfileHeaderSkeleton />
          <SubscriptionSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 md:p-10 pt-20 mt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={data.avatar}
                  alt={data.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-100"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white ${
                  data.isActive ? "bg-emerald-500" : "bg-red-500"
                }`} />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {data.email}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    {data.provider === "google" ? "Google Account" : "Manual Account"}
                  </span>
                  <StatusBadge status={data.isActive} type="user" />
                </div>
              </div>
            </div>
            <button
              onClick={handleBlockUnblock}
              disabled={actionLoading}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                data.isActive
                  ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
              }`}
            >
              {actionLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {data.isActive ? "Block Account" : "Activate Account"}
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Subscription Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <InfoCard
              label="Plan Type"
              value={data?.subscriptionId?.notes?.courseId || "No Subscription"}
              icon="📋"
              highlight={!!data?.subscriptionId}
            />
            <InfoCard
              label="Status"
              value={<StatusBadge status={data?.subscriptionId?.isActive} type="subscription" />}
              icon="🔄"
            />
            <InfoCard
              label="Billing Period"
              value={data?.subscriptionId?.planType || "N/A"}
              icon="📅"
            />
            <InfoCard
              label="Next Payment"
              value={formatDate(data?.subscriptionId?.endDate)}
              icon="💳"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Enrolled Courses
            </h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {allCourses.length} {allCourses.length === 1 ? 'Course' : 'Courses'}
            </span>
          </div>

          {allCourses.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-gray-500 text-lg">No enrolled courses found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Course</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Enrollment Date</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCourses.map((course, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-900">
                            {course?.course?.title || "Untitled Course"}
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatSimpleDate(course.courseStartDate)}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={course.status} type="course" />
                        </td>
                        <td className="p-4">
                          <span className="text-blue-600 font-medium hover:text-blue-800 cursor-pointer transition-colors">
                            {course?.course?.instructorId?.name || "Unknown Instructor"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, allCourses.length)}</span> of{' '}
                    <span className="font-medium">{allCourses.length}</span> entries
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-150 ${
                            currentPage === i + 1
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                              : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default React.memo(UserProfile)