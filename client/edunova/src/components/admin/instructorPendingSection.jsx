import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const StatusBadge = React.memo(({ status }) => (
  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
    {status}
  </span>
));

function PendingSections() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/instructorPending`, {
        withCredentials: true,
      })
      .then((res) => setData(res.data.data))
      .catch((err) => {
        console.error("Error Fetching Instructor");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(data.length / perPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    return data.slice(startIndex, startIndex + perPage);
  }, [currentPage, data, perPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Pending Instructor Sections</h1>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {loading
          ? "Loading sections..."
          : `${data.length} section${data.length !== 1 ? "s" : ""} pending approval`}
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        {["Department", "Term", "Status"].map((filter) => (
          <select
            key={filter}
            className="border border-gray-300 px-3 py-2 rounded text-sm"
            disabled={loading}
          >
            <option>{filter}</option>
          </select>
        ))}
        <button className="ml-auto border px-3 py-2 text-sm rounded" disabled={loading}>
          Sort
        </button>
      </div>

      <div className="overflow-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Instructor Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Time</th>
              <th className="p-4">View</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: perPage }).map((_, idx) => (
                <tr key={idx} className="border-t">
                  <td colSpan={5} className="p-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr className="border-t">
                <td className="p-4" colSpan={5}>
                  No instructors pending
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.email}</td>
                  <td className="p-4">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-indigo-400 p-2 rounded-md">
                      <Link to={`/admin/instructor_verification_section/${item._id}`}>
                        view
                      </Link>
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={item.verificationStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <span>
            Showing {(currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, data.length)} of {data.length} results
          </span>
          <div className="flex gap-1">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Previous page"
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    page === currentPage
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-current={page === currentPage ? "page" : undefined}
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

export default React.memo(PendingSections);
