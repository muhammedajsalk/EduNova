import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { FaBuilding, FaChalkboardTeacher, FaDollarSign, FaUserGraduate, FaUsers, FaWallet, FaFileAlt, FaBan } from "react-icons/fa";

function InstructorDetailsPage() {
    const { id } = useParams()
    const [data, setData] = useState([])
    const [course,setCourse]=useState([])
    
    useEffect(() => {
        axios.get(`http://localhost:5000/api/admin/instructorById/${id}`,{withCredentials:true})
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err.response?.data?.message || err.message))
    }, [])

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/admin/instructorCourses/${id}`)
        .then((res)=>setCourse(res.data.data))
        .catch((err) => console.log(err.response?.data?.message || err.message))
    },[])



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

    // Mock chart data for revenue trend
    const chartData = [
        { month: 'Jan', company: 4000, instructor: 2400 },
        { month: 'Feb', company: 3000, instructor: 1398 },
        { month: 'Mar', company: 2000, instructor: 3800 },
        { month: 'Apr', company: 2780, instructor: 3908 },
        { month: 'May', company: 1890, instructor: 4800 },
        { month: 'Jun', company: 2390, instructor: 3800 }
    ];

    const totalWithdrawals = 28145; // You can replace this with actual calculation

    return (
        <>
            <div className="min-h-screen bg-gray-50 mt-16">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200 px-4 py-6 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={data.avatar}
                                alt={data.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">{data.name}</h1>
                                <p className="text-sm text-gray-500">Web Development Expert</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                    data.isActive 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {data.isActive ? 'Active' : 'Blocked'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <FaFileAlt className="w-4 h-4" />
                                <Link to={`/admin/instructor_details_and_documents/${data._id}`}>
                                    View Documents
                                </Link>
                            </button>
                            <button 
                                onClick={() => blockAndUnblock()}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                                    data.isActive
                                        ? 'border border-red-300 text-red-700 bg-white hover:bg-red-50'
                                        : 'border border-green-300 text-green-700 bg-white hover:bg-green-50'
                                }`}
                            >
                                <FaBan className="w-4 h-4" />
                                {data.isActive ? 'Block' : 'Active'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-6 md:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-gray-700">
                        <StatBox
                            title="Total Students"
                            value={data.students}
                            icon={<FaUsers className="w-6 h-6" />}
                        />
                        <StatBox
                            title="Total Courses"
                            value={course.length}
                            icon={<FaChalkboardTeacher className="w-6 h-6" />}
                        />
                        <StatBox
                            title="Total Revenue"
                            value={`₹${data.earnings || 0}`}
                            icon={<FaDollarSign className="w-6 h-6" />}
                        />
                        <StatBox
                            title="Total Withdrawals"
                            value={`₹${totalWithdrawals}`}
                            icon={<FaWallet className="w-6 h-6" />}
                        />
                    </div>

                    {/* Revenue Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Revenue Details */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Details</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FaBuilding className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Company Revenue</span>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-900">
                                        ₹{data.company_revenue || 0}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FaUserGraduate className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Instructor Revenue</span>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-900">
                                        ₹{data.earnings || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Trend Chart */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h2>
                            <div className="h-64 flex items-end justify-between gap-2 bg-gray-50 rounded-lg p-4">
                                {chartData.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                        <div className="flex flex-col items-center gap-1 w-full">
                                            <div 
                                                className="bg-blue-500 rounded-t w-6"
                                                style={{ height: `${(item.company / 5000) * 120}px` }}
                                            ></div>
                                            <div 
                                                className="bg-gray-400 rounded-b w-6"
                                                style={{ height: `${(item.instructor / 5000) * 120}px` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                    <span className="text-xs text-gray-600">Company</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                                    <span className="text-xs text-gray-600">Instructor</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* All Courses */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">All Courses</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All Courses →
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {course?.slice(1, 4).map((course, index) => (
                                <div key={course._id || index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-62 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {course.students.length} students
                                        </p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            course.status === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {course.status || 'Published'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </>
    );
}

const StatBox = ({ title, value, icon, bgColor }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

export default React.memo(InstructorDetailsPage);