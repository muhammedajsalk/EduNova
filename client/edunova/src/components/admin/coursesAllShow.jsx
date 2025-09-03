import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Badge component (claimed status field is "status": "approved"|"blocked")
const StatusBadge = ({ status }) => {
  const base =
    "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
  if (status === "approved")
    return (
      <span className={`${base} bg-green-100 text-green-800`}>Active</span>
    );
  if (status === "blocked" || status === false)
    return (
      <span className={`${base} bg-red-100 text-red-800`}>Blocked</span>
    );
  if (status === "pending")
    return (
      <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>
    );
  return null;
};

// SkeletonRow for loading
const SkeletonRow = () => (
  <tr className="animate-pulse border-t">
    <td className="px-6 py-4">
      <div className="h-4 w-32 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full" />
      <div className="h-4 w-28 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-8 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-20 bg-emerald-300 rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-16 bg-green-200 rounded" />
    </td>
  </tr>
);

function CoursesManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dashboard search/filter/sort/pagination states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Title");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/allCourses", { withCredentials: true })
      .then((res) => setCourses(res.data.data))
      .catch((err) => console.error("Fetching issue"))
      .finally(() => setLoading(false));
  }, []);

  // Stats
  const courseActive = courses.filter((c) => c.status === "approved" || c.isActive === true);
  const courseBlocked = courses.filter((c) => c.status === "blocked" || c.isActive === false);
  const pendingCount = courses.filter((c) => c.verificationStatus === "pending").length;

  // Filtering and searching
  const filtered = courses
    .filter((course) => {
      // Search
      const q = search.trim().toLowerCase();
      const match =
        course.title?.toLowerCase().includes(q) ||
        course.instructorId?.name?.toLowerCase().includes(q);
      // Status
      if (status === "All") return match;
      if (status === "Active") return match && (course.status === "approved" || course.isActive === true);
      if (status === "Blocked") return match && (course.status === "blocked" || course.isActive === false);
      if (status === "Pending") return match && (course.verificationStatus === "pending");
      return match;
    });

  // Sorting (simple sort by title or students count)
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Title") return a.title.localeCompare(b.title);
    if (sort === "Students") return (b.students?.length ?? 0) - (a.students?.length ?? 0);
    if (sort === "Status") return (a.status || "").localeCompare(b.status || "");
    return 0;
  });

  // Pagination logic
  const perPage = 3;
  const totalPages = Math.ceil(sorted.length / perPage);
  const visible = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => {
    setCurrentPage(1); // reset to pg1 on search/filter/sort
  }, [search, status, sort]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 mt-12">
      <div className="max-w-7xl mx-auto">

        {/* Header and Pending link */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Courses Management
          </h1>
          <Link to="/admin/course_Pending_Section">
            <span className="text-sm text-white px-4 py-2 bg-emerald-500 rounded-lg">
              Course Verify Pending
              {pendingCount > 0 &&
                <span className="inline-block ml-2 bg-red-600 text-white rounded-full px-2">{pendingCount}</span>
              }
            </span>
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Courses</h3>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : courses.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Courses</h3>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : courseActive.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Blocked Courses</h3>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : courseBlocked.length}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search Courses or Instructor..."
                value={search}
                disabled={loading}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
              <select
                value={status}
                onChange={e => { setStatus(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="Title">Title</option>
                <option value="Students">Students</option>
                <option value="Status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, idx) => <SkeletonRow key={idx} />)
                  : visible.map((inst, idx) => (
                    <tr key={inst._id || idx} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{inst.title}</td>
                      <td className="px-6 py-4 flex items-center gap-3 min-w-[180px]">
                        <img src={inst.instructorId.avatar} alt={inst.instructorId.name}
                          className="w-8 h-8 rounded-full object-cover" />
                        {inst.instructorId.name}
                      </td>
                      <td className="px-6 py-4">{inst.students?.length || 0}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/courseDetails/${inst._id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          View
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={inst.status || inst.verificationStatus} />
                      </td>
                    </tr>
                  ))}
                {!loading && visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="p-6 border-b border-gray-200 last:border-b-0 animate-pulse">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="flex justify-between mb-3">
                    <div className="w-1/5 h-4 bg-gray-200 rounded" />
                    <div className="w-1/5 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-7 bg-emerald-300 rounded" />
                  </div>
                </div>
              ))
            ) : (
              visible.length === 0 ? (
                <div className="p-6 text-center text-gray-400">No courses found.</div>
              ) : (
                visible.map((inst) => (
                  <div key={inst._id} className="p-6 border-b border-gray-200 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-gray-900">{inst.title}</div>
                        <div className="text-sm flex items-center gap-2 text-gray-500">
                          <img src={inst.instructorId.avatar} alt={inst.instructorId.name} className="w-7 h-7 rounded-full object-cover" />
                          {inst.instructorId.name}
                        </div>
                      </div>
                      <StatusBadge status={inst.status || inst.verificationStatus} />
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Students: {inst.students?.length ?? 0}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/courseDetails/${inst._id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span>-
                  <span className="font-medium">{Math.min(currentPage * perPage, sorted.length)}</span> of
                  <span className="font-medium"> {sorted.length} </span> courses
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }).map((_, pg) => (
                    <button
                      key={pg + 1}
                      onClick={() => setCurrentPage(pg + 1)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pg + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pg + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CoursesManagement);
