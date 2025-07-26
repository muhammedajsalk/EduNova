import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom"
import axios from "axios";



const StatusBadge = ({ status }) => {
    const base = "text-xs font-medium px-2 py-1 rounded-full";
    if (status === true) return <span className={`${base} bg-green-100 text-green-600`}>Active</span>;
    if (status === false) return <span className={`${base} bg-red-100 text-red-600`}>Blocked</span>;
};

function InstructorsManagement() {
    const [instructors, setInstructors] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/AllInstructor',{withCredentials: true})
            .then((res) => setInstructors(res.data.data))
            .catch((err) => console.log(err))
    }, [])
    const instructorActive = instructors.filter((item) => item.isActive === true)
    const instructorBlocked = instructors.filter((item) => item.isActive === false)
    const pendingCount = instructors.filter((item) => item.verificationStatus === "pending")
    return (
        <>
            <div className="p-4 md:p-10 bg-gray-100 min-h-screen text-gray-800 mt-12">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Instructors Management</h1>
                    <Link to="/admin/instructor_Pending_Section" className="relative inline-block">
                        <span className="text-sm text-white px-4 py-2 bg-indigo-500 rounded-lg">
                            Instructor Verify pending
                        </span>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white shadow rounded-lg p-4 text-center">
                        <h2 className="text-3xl font-bold">{instructors.length}</h2>
                        <p className="text-sm text-gray-600">Total Instructors</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 text-center">
                        <h2 className="text-3xl font-bold">{instructorActive.length}</h2>
                        <p className="text-sm text-gray-600">Active Instructors</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 text-center">
                        <h2 className="text-3xl font-bold">{instructorBlocked.length}</h2>
                        <p className="text-sm text-gray-600">Blocked Instructors</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <input
                        type="text"
                        placeholder="Search instructors..."
                        className="border px-4 py-2 rounded-md w-full sm:w-1/3"
                    />
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border rounded-md">Filter</button>
                        <button className="px-4 py-2 border rounded-md">Sort by</button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-auto bg-white rounded-lg shadow">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-4 font-medium">Instructor</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Courses</th>
                                <th className="p-4 font-medium">Students</th>
                                <th className="p-4 font-medium">Join Date</th>
                                <th className="p-4 font-medium">View</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructors.map((inst, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={inst.avatar} alt={inst.name} className="w-8 h-8 rounded-full" />
                                        {inst.name}
                                    </td>
                                    <td className="p-4">{inst.email}</td>
                                    <td className="p-4">{inst.myCourses.length}</td>
                                    <td className="p-4">{inst.students}</td>
                                    <td className="p-4">{inst.updatedAt}</td>
                                    <td className="p-4">
                                        <span className="bg-indigo-400 p-2 rounded-md">
                                            <Link to={`/admin/instructor_details/${inst._id}`}>
                                                view
                                            </Link>
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={inst.isActive} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-between items-center text-sm">
                    <span>Showing 1 to 5 of {instructors.length} entries</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((pg) => (
                            <button
                                key={pg}
                                className={`w-8 h-8 flex items-center justify-center rounded ${pg === 1 ? "bg-black text-white" : "bg-gray-200"
                                    }`}
                            >
                                {pg}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default React.memo(InstructorsManagement)