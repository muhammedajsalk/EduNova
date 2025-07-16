import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./adminNavbar";

// ✅ Status Badge
const StatusBadge = ({ status }) => {
  const base = "text-xs font-medium px-2 py-1 rounded-full";
  if (status === "approved") return <span className={`${base} bg-green-100 text-green-600`}>Active</span>;
  if (status === false) return <span className={`${base} bg-red-100 text-red-600`}>Blocked</span>;
  return null;
};

// ✅ Skeleton Row
const SkeletonRow = () => (
  <tr className="animate-pulse border-t">
    <td className="p-4"><div className="w-32 h-4 bg-gray-200 rounded" /></td>
    <td className="p-4 flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full" />
      <div className="w-24 h-4 bg-gray-200 rounded" />
    </td>
    <td className="p-4"><div className="w-10 h-4 bg-gray-200 rounded" /></td>
    <td className="p-4"><div className="w-16 h-6 bg-indigo-300 rounded" /></td>
    <td className="p-4"><div className="w-20 h-6 bg-green-200 rounded" /></td>
  </tr>
);

function CoursesManagement() {
  const [Courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/allCourses', { withCredentials: true })
      .then((res) => setCourses(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const CourseActive = Courses.filter((item) => item.isActive === true);
  const CourseBlocked = Courses.filter((item) => item.isActive === false);
  const pendingCount = Courses.filter((item) => item.verificationStatus === "pending");

  return (
    <>
      <AdminNavbar />
      <div className="p-4 md:p-10 bg-gray-100 min-h-screen text-gray-800 mt-12">

        {/* 🔷 Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Courses Management</h1>
          <Link to="/admin/course_Pending_Section">
            <span className="text-sm text-white px-4 py-2 bg-indigo-500 rounded-lg">
              Course Verify pending
            </span>
          </Link>
        </div>

        {/* 🔷 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[["Total Courses", Courses.length], ["Active Courses", CourseActive.length], ["Blocked Courses", CourseBlocked.length]].map(
            ([label, count], i) => (
              <div key={i} className="bg-white shadow rounded-lg p-4 text-center">
                <h2 className={`text-3xl font-bold ${loading ? "animate-pulse text-gray-300" : ""}`}>
                  {loading ? "..." : count}
                </h2>
                <p className="text-sm text-gray-600">{label}</p>
              </div>
            )
          )}
        </div>

        {/* 🔷 Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <input
            type="text"
            placeholder="Search Courses..."
            className="border px-4 py-2 rounded-md w-full sm:w-1/3"
            disabled={loading}
          />
          <div className="flex gap-2">
            <button disabled={loading} className="px-4 py-2 border rounded-md disabled:opacity-50">Filter</button>
            <button disabled={loading} className="px-4 py-2 border rounded-md disabled:opacity-50">Sort by</button>
          </div>
        </div>

        {/* 🔷 Table */}
        <div className="overflow-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Instructor</th>
                <th className="p-4 font-medium">Students</th>
                <th className="p-4 font-medium">View</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(3)].map((_, idx) => <SkeletonRow key={idx} />)
                : Courses.map((inst, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-4">{inst.title}</td>
                      <td className="p-4 flex items-center gap-3">
                        <img src={inst.instructorId.avatar} alt={inst.instructorId.name} className="w-8 h-8 rounded-full" />
                        {inst.instructorId.name}
                      </td>
                      <td className="p-4">{inst.students.length}</td>
                      <td className="p-4">
                        <span className="bg-indigo-400 text-white px-3 py-1 rounded-md">
                          <Link to={`/admin/courseDetails/${inst._id}`}>view</Link>
                        </span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={inst.status} />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* 🔷 Pagination */}
        {!loading && (
          <div className="mt-4 flex justify-between items-center text-sm">
            <span>Showing 1 to 5 of {Courses.length} entries</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((pg) => (
                <button
                  key={pg}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    pg === 1 ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default React.memo(CoursesManagement);
