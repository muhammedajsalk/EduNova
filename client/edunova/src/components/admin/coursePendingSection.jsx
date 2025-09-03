import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ✅ Reusable Status Badge
const StatusBadge = ({ status }) => (
  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
    {status}
  </span>
);

// ✅ Skeleton Loader Row
const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 border-b animate-pulse">
    <div className="w-32 h-4 bg-gray-200 rounded"></div>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      <div className="w-24 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="w-32 h-4 bg-gray-200 rounded ml-4"></div>
    <div className="ml-auto w-16 h-8 bg-indigo-300 rounded"></div>
    <div className="w-20 h-6 bg-yellow-200 rounded"></div>
  </div>
);

function CoursePendingSections() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  // Optional: You can add filtering/searching states here, e.g.
  // const [filter, setFilter] = useState("All");
  // const [search, setSearch] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/coursePending", { withCredentials: true })
      .then((res) => setData(res.data.data))
      .catch((err) => {
        console.error("Fetching Issue");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate paginated data
  const totalPages = Math.ceil(data.length / perPage);

  // Slice data for current page
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * perPage;
    return data.slice(startIdx, startIdx + perPage);
  }, [currentPage, data, perPage]);

  // Handlers for pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const previousPage = () => goToPage(currentPage - 1);
  const nextPage = () => goToPage(currentPage + 1);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800">
      {/* 🔹 Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Pending Courses Sections</h1>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {loading
          ? "Loading sections..."
          : `${data.length} section${data.length !== 1 ? "s" : ""} pending approval`}
      </p>

      {/* 🔹 Filters (placeholders for future functionality) */}
      <div className="flex flex-wrap gap-3 mb-4">
        {["Department", "Term", "Status"].map((filter) => (
          <select
            key={filter}
            disabled={loading}
            className="border border-gray-300 px-3 py-2 rounded text-sm bg-white disabled:opacity-50"
            // onChange={} // Add appropriate handlers if adding filter feature
          >
            <option>{filter}</option>
          </select>
        ))}
        <button
          disabled={loading}
          className="ml-auto border px-3 py-2 text-sm rounded bg-white disabled:opacity-50"
          // onClick={} // Add sort handler if needed
        >
          Sort
        </button>
      </div>

      {/* 🔹 Table Section */}
      <div className="overflow-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Course</th>
              <th className="p-4">Instructor</th>
              <th className="p-4">Time</th>
              <th className="p-4">View</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(perPage)].map((_, i) => (
                <tr key={i} className="border-t">
                  <td colSpan={5}>
                    <SkeletonRow />
                  </td>
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr className="border-t">
                <td className="p-4" colSpan={5}>
                  No courses pending
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item._id || index} className="border-t">
                  <td className="p-4">{item.title}</td>
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={item.instructorId?.avatar || "/default-avatar.png"}
                      alt={item.instructorId?.name || "Instructor"}
                      className="w-8 h-8 rounded-full"
                      loading="lazy"
                    />
                    {item.instructorId?.name || "Unknown"}
                  </td>
                  <td className="p-4">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-indigo-400 text-white px-3 py-1 rounded-md">
                      <Link to={`/admin/course_verification_section/${item._id}`}>
                        view
                      </Link>
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={item.status || "Pending"} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <span>
            Showing {(currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, data.length)} of {data.length} results
          </span>
          <div className="flex gap-1">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Previous page"
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    isActive ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(CoursePendingSections);
