import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom"
import axios from "axios";
import AdminNavbar from "./adminNavbar";



const StatusBadge = ({ status }) => {
    const base = "text-xs font-medium px-2 py-1 rounded-full";
    if (status === true) return <span className={`${base} bg-green-100 text-green-600`}>Active</span>;
    if (status === false) return <span className={`${base} bg-red-100 text-red-600`}>Blocked</span>;
};

function CoursesManagement() {
    const [Courses, setCourses] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/AllCourse',{withCredentials: true})
            .then((res) => setCourses(res.data.data))
            .catch((err) => console.log(err))
    }, [])
    const CourseActive = Courses.filter((item) => item.isActive === true)
    const CourseBlocked = Courses.filter((item) => item.isActive === false)
    const pendingCount = Courses.filter((item) => item.verificationStatus === "pending")
    return (
        <>
            <AdminNavbar />
            <div className="p-4 md:p-10 bg-gray-100 min-h-screen text-gray-800 mt-12">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Courses Management</h1>
                    <Link to="/admin/course_Pending_Section" className="relative inline-block">
                        <span className="text-sm text-white px-4 py-2 bg-indigo-500 rounded-lg">
                            Course Verify pending
                        </span>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white shadow rounded-lg p-4 text-center">
                        <h2 className="text-3xl font-bold">{Courses.length}</h2>
                        <p className="text-sm text-gray-600">Total Courses</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 text-center">
                        <h2 className="text-3xl font-bold">{CourseActive.length}</h2>
                        <p className="text-sm text-gray-600">Active Courses</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 text-center">
                        <h2 className="text-3xl font-bold">{CourseBlocked.length}</h2>
                        <p className="text-sm text-gray-600">Blocked Courses</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <input
                        type="text"
                        placeholder="Search Courses..."
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
                                <th className="p-4 font-medium">Course</th>
                                <th className="p-4 font-medium">Instructor</th>
                                <th className="p-4 font-medium">students</th>
                                <th className="p-4 font-medium">View</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Courses.map((inst, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="p-4">{inst.email}</td>
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={inst.avatar} alt={inst.name} className="w-8 h-8 rounded-full" />
                                        {inst.name}
                                    </td>
                                    <td className="p-4">{inst.students}</td>
                                    <td className="p-4">
                                        <span className="bg-indigo-400 p-2 rounded-md">
                                            <Link to={`/admin/Course_details/${inst._id}`}>
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
                    <span>Showing 1 to 5 of {Courses.length} entries</span>
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

export default React.memo(CoursesManagement)