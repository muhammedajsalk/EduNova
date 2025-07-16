import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import AdminNavbar from "./adminNavbar";
import { FaBuilding, FaChalkboardTeacher, FaDollarSign, FaUserGraduate, FaUsers, FaWallet } from "react-icons/fa";

function InstructorDetailsPage() {
    const { id } = useParams()
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:5000/api/admin/instructorById/${id}`)
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err))
    }, [])

    function blockAndUnblock() {
        if (data.isActive) {
            axios.post(`http://localhost:5000/api/admin/instructorBlockAndUnBlock/${id}`, { isActive: false }, { withCredentials: true })
                .then((res) => {
                    axios.get(`http://localhost:5000/api/admin/instructorById/${id}`, { withCredentials: true })
                        .then((res) => setData(res.data.data))
                        .catch((err) => console.log(err))
                    toast.success(res.data.message)
                })
                .catch((err) => toast.error(err.response?.data?.message || err.message))
        } else {
            axios.post(`http://localhost:5000/api/admin/instructorBlockAndUnBlock/${id}`, { isActive: true }, { withCredentials: true })
                .then((res) => {
                    axios.get(`http://localhost:5000/api/admin/instructorById/${id}`, { withCredentials: true })
                        .then((res) => setData(res.data.data))
                        .catch((err) => console.log(err))
                    toast.success(res.data.message)
                })
                .catch((err) => toast.error(err.response?.data?.message || err.message))
        }
    }

    return (
        <>
            <AdminNavbar />

            <div className="p-6 md:p-10 bg-gray-50 min-h-screen text-gray-800 mt-12">
                {/* Top Profile Header */}
                <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={data.avatar}
                            alt="Sarah Johnson"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-bold">{data.name}</h2>
                            <span className={data.isActive ? "text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mt-1 inline-block" : "text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full mt-1 inline-block"}>{data.isActive ? "Active" : "Blocked"}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="border px-4 py-2 rounded text-sm">
                            <Link to={`/admin/instructor_details_and_documents/${data._id}`}>
                                View details and Documents
                            </Link>
                        </button>
                        <button onClick={() => blockAndUnblock()} className={data.isActive ? "border border-red-500 text-red-500 px-4 py-2 rounded text-sm" : "border border-green-500 text-green-500 px-4 py-2 rounded text-sm"}>{data.isActive ? "Block" : "Active"}</button>
                    </div>
                </div>

                {/* Metrics Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <StatBox
                        title="Total Students"
                        value={data.students}
                        icon={<FaUsers className="text-blue-500 text-2xl" />}
                    />
                    <StatBox
                        title="Total Courses"
                        value={data?.myCourses?.length}
                        icon={<FaChalkboardTeacher className="text-green-500 text-2xl" />}
                    />
                    <StatBox
                        title="Total Revenue"
                        value={`₹${data.earnings || 0}`}
                        icon={<FaDollarSign className="text-yellow-500 text-2xl" />}
                    />
                    <StatBox
                        title="Total Withdrawals"
                        value={data?.withdrawals?.length}
                        icon={<FaWallet className="text-purple-500 text-2xl" />}
                    />
                </div>

                {/* Revenue Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-semibold mb-4 text-gray-800 text-lg flex items-center gap-2">
                            💰 Revenue Details
                        </h4>

                        {/* Company Revenue */}
                        <div className="flex items-center justify-between border-b pb-3 mb-3">
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                <FaBuilding className="text-blue-500 text-xl" />
                                <span>Company Revenue</span>
                            </div>
                            <div className="font-semibold text-sm text-gray-800">
                                ₹{data.company_revenue || 0}
                            </div>
                        </div>

                        {/* Instructor Revenue */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                <FaUserGraduate className="text-green-500 text-xl" />
                                <span>Instructor Revenue</span>
                            </div>
                            <div className="font-semibold text-sm text-gray-800">
                                ₹{data.earnings || 0}
                            </div>
                        </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-semibold mb-2">Revenue Trend</h4>
                        {/* Replace this div with actual Recharts/Chart.js line or bar chart */}
                        <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            [Revenue Chart Placeholder]
                        </div>
                    </div>
                </div>

                {/* Latest Course */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Latest Course</h4>
                        <button className="text-blue-600 text-sm">View All</button>
                    </div>

                    {data?.myCourses?.length != 0 ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={data?.myCourses?.[0]?.image}
                                alt="Course Cover"
                                className="w-24 h-16 rounded object-cover"
                            />
                            <div>
                                <p className="font-medium">{data?.myCourses?.[0]?.title}</p>
                                <p className="text-sm text-gray-500">
                                    Published on {data?.myCourses?.[0]?.publishedTime}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {data?.myCourses?.[0]?.students} students enrolled
                                </p>
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mt-1 inline-block">
                                    {data?.myCourses?.[0]?.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-4">No latest courses available</div>
                    )}
                </div>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </>
    );
}

const StatBox = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <div className="bg-gray-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-lg font-bold">{value}</h3>
        </div>
    </div>
);


export default React.memo(InstructorDetailsPage)