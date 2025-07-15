import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"


const StatusBadge = ({ status }) => (
    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
        {status}
    </span>
);

function PendingSections() {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/instructorPending',{withCredentials: true})
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err))
    }, [])
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800">
            {/* Topbar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Pending Instructor Sections</h1>
            </div>

            <p className="text-sm text-gray-600 mb-4">{data.length} sections pending approval</p>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                {["Department", "Term", "Status"].map((filter) => (
                    <select
                        key={filter}
                        className="border border-gray-300 px-3 py-2 rounded text-sm"
                    >
                        <option>{filter}</option>
                    </select>
                ))}
                <button className="ml-auto border px-3 py-2 text-sm rounded">Sort</button>
            </div>

            {/* Table */}
            <div className="overflow-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-4">Instructor Name</th>
                            <th className="p-4">email</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">View</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    {data.length === 0 ? (
                        <tbody>
                            <tr className="border-t">
                                <td className="p-4">No instructor Pending</td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-4">{item.name}</td>
                                    <td className="p-4">{item.email}</td>
                                    <td className="p-4">{item.createdAt}</td>
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
                            ))}
                        </tbody>
                    )}

                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center text-sm">
                <span>Showing 1 to 5 of 12 results</span>
                <div className="flex gap-1">
                    {[1, 2, 3].map((pg) => (
                        <button
                            key={pg}
                            className={`w-8 h-8 flex items-center justify-center rounded ${pg === 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
                                }`}
                        >
                            {pg}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(PendingSections)