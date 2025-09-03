import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { Search, ChevronDown, Eye } from 'lucide-react'; // Uncomment if using lucide icons

const StatusBadge = ({ status }) => {
  const base = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
  if (status === true) return <span className={`${base} bg-green-100 text-green-800`}>Active</span>;
  if (status === false) return <span className={`${base} bg-red-100 text-red-800`}>Blocked</span>;
  return null;
};

function StudentsManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Name");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/AllUsers", { withCredentials: true })
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.log("Error Fetching users"));
  }, []);

  // Stats
  const userActive = users.filter((item) => item.isActive === true);
  const userBlocked = users.filter((item) => item.isActive === false);

  // Search & filter
  const filtered = users.filter((user) =>
    (user.name?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase())) &&
    (filter === "All" || (filter === "Active" && user.isActive) || (filter === "Blocked" && !user.isActive))
  );

  // Pagination (show 5 per page)
  const perPage = 5;
  const visibleUsers = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Date format helper
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString() : "-";

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 mt-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Student Management</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Active Users</h3>
              <p className="text-2xl font-bold text-gray-900">{userActive.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Blocked Users</h3>
              <p className="text-2xl font-bold text-gray-900">{userBlocked.length}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Search users..."
                    className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Name</option>
                  <option>Email</option>
                  <option>Status</option>
                </select>
              </div>
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
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
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
                {visibleUsers.map((inst) => (
                  <tr key={inst._id} className="hover:bg-gray-50 border-t">
                    <td className="px-6 py-4 flex items-center gap-3 whitespace-nowrap">
                      <img src={inst.avatar} alt={inst.name} className="w-8 h-8 rounded-full object-cover" />
                      {inst.name}
                    </td>
                    <td className="px-6 py-4">{inst.email}</td>
                    <td className="px-6 py-4">{inst.enrolledCourses?.length ?? 0}</td>
                    <td className="px-6 py-4">{fmtDate(inst.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/user_details/${inst._id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        {/* <Eye className="h-4 w-4" /> */}
                        View
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inst.isActive} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {visibleUsers.map((inst) => (
              <div key={inst._id} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img src={inst.avatar} alt={inst.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{inst.name}</p>
                      <p className="text-sm text-gray-500">{inst.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={inst.isActive} />
                </div>
                <div className="flex justify-between mb-3">
                  <span>Courses: {inst.enrolledCourses?.length ?? 0}</span>
                  <span>Joined: {fmtDate(inst.updatedAt)}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/user_details/${inst._id}`}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    {/* <Eye className="h-4 w-4" /> */}
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span>-
                <span className="font-medium">{Math.min(currentPage * perPage, filtered.length)}</span> of
                <span className="font-medium"> {filtered.length}</span> users
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  ‹
                </button>
                {Array.from({ length: Math.ceil(filtered.length / perPage) }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 text-sm rounded
                      ${currentPage === idx + 1
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"}
                    `}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  disabled={currentPage >= Math.ceil(filtered.length / perPage)}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(filtered.length / perPage)))}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default React.memo(StudentsManagement);
