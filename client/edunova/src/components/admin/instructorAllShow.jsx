import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Status Badge
const StatusBadge = React.memo(({ status }) => {
  const base = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
  if (status === true || status === "approved")
    return <span className={`${base} bg-green-100 text-green-800`}>Active</span>;
  if (status === false || status === "blocked")
    return <span className={`${base} bg-red-100 text-red-800`}>Blocked</span>;
  if (status === "pending")
    return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
  return null;
});

// Skeleton Row
const SkeletonRow = React.memo(() => (
  <tr className="animate-pulse border-t">
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full" />
      <div className="w-24 h-4 bg-gray-200 rounded" />
    </td>
    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
    <td className="px-6 py-4"><div className="h-4 w-6 bg-gray-200 rounded" /></td>
    <td className="px-6 py-4"><div className="h-4 w-6 bg-gray-200 rounded" /></td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
    <td className="px-6 py-4"><div className="h-7 w-16 bg-emerald-300 rounded" /></td>
    <td className="px-6 py-4"><div className="h-6 w-16 bg-green-200 rounded" /></td>
  </tr>
));

function InstructorsManagement() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Name");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data once on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/AllInstructor", { withCredentials: true })
      .then((res) => setInstructors(res.data.data))
      .catch(() => setInstructors([]))
      .finally(() => setLoading(false));
  }, []);

  // Derived stats (using memo for efficiency)
  const { total, active, blocked, pending } = useMemo(() => {
    let active = 0, blocked = 0, pending = 0;
    for (const i of instructors) {
      if (i.verificationStatus === "pending") pending++;
      if (i.isActive === true || i.status === "approved") active++;
      if (i.isActive === false || i.status === "blocked") blocked++;
    }
    return { total: instructors.length, active, blocked, pending };
  }, [instructors]);

  // Filter, sort, and search in a single memo
  const filteredSorted = useMemo(() => {
    let data = instructors.filter(inst => {
      const q = search.trim().toLowerCase();
      const match = inst.name?.toLowerCase().includes(q)
        || inst.email?.toLowerCase().includes(q);
      if (status === "All") return match;
      if (status === "Active") return match && (inst.isActive === true || inst.status === "approved");
      if (status === "Blocked") return match && (inst.isActive === false || inst.status === "blocked");
      if (status === "Pending") return match && inst.verificationStatus === "pending";
      return match;
    });

    // Sorting
    data = [...data].sort((a, b) => {
      switch (sort) {
        case "Name":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "Courses":
          return (b.myCourses?.length ?? 0) - (a.myCourses?.length ?? 0);
        case "Students":
          return (b.students ?? 0) - (a.students ?? 0);
        case "Status":
          return `${a.status || a.isActive}`.localeCompare(`${b.status || b.isActive}`);
        default:
          return 0;
      }
    });
    return data;
  }, [instructors, search, status, sort]);

  // Pagination (reset to 1 when query or filter changes)
  const perPage = 3;
  const totalPages = Math.ceil(filteredSorted.length / perPage);
  const visible = useMemo(
    () => filteredSorted.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filteredSorted, currentPage, perPage]
  );
  useEffect(() => { setCurrentPage(1); }, [search, status, sort]);

  // Date format helper
  const fmtDate = iso => iso ? new Date(iso).toLocaleDateString() : "-";

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Header & verification badge */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Instructors Management</h1>
          <Link to="/admin/instructor_Pending_Section" className="relative inline-block">
            <span className="text-sm text-white px-4 py-2 bg-emerald-500 rounded-lg">
              Instructor Verify Pending
              {pending > 0 && (
                <span className="inline-block ml-2 bg-red-600 text-white rounded-full px-2">{pending}</span>
              )}
            </span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Instructors</h3>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : total}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Instructors</h3>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : active}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Blocked Instructors</h3>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : blocked}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search instructors..."
                value={search}
                disabled={loading}
                onChange={e => setSearch(e.target.value)}
                className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
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
                <option value="Name">Name</option>
                <option value="Courses">Courses</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, idx) => <SkeletonRow key={idx} />)
                  : visible.length > 0
                    ? visible.map(inst => (
                        <tr key={inst._id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img
                              src={inst.avatar || "/default-avatar.png"}
                              alt={inst.name}
                              className="w-8 h-8 rounded-full object-cover"
                              loading="lazy"
                            />
                            {inst.name}
                          </td>
                          <td className="px-6 py-4">{inst.email || "-"}</td>
                          <td className="px-6 py-4">{inst.myCourses?.length ?? 0}</td>
                          <td className="px-6 py-4">{inst.students ?? 0}</td>
                          <td className="px-6 py-4">{fmtDate(inst.updatedAt)}</td>
                          <td className="px-6 py-4">
                            <Link to={`/admin/instructor_details/${inst._id}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                              View
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={inst.isActive || inst.status || inst.verificationStatus} />
                          </td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                          No instructors found.
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
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
            ) : visible.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No instructors found.</div>
            ) : (
              visible.map(inst => (
                <div key={inst._id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img src={inst.avatar || "/default-avatar.png"} alt={inst.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{inst.name}</p>
                        <p className="text-sm text-gray-500">{inst.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={inst.isActive || inst.status || inst.verificationStatus} />
                  </div>
                  <div className="flex justify-between mb-3 text-sm">
                    <span>Courses: {inst.myCourses?.length ?? 0}</span>
                    <span>Students: {inst.students ?? 0}</span>
                    <span>Joined: {fmtDate(inst.updatedAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/instructor_details/${inst._id}`}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span>-
                  <span className="font-medium">{Math.min(currentPage * perPage, filteredSorted.length)}</span> of
                  <span className="font-medium"> {filteredSorted.length}</span> instructors
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === idx + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {idx + 1}
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

export default React.memo(InstructorsManagement);
