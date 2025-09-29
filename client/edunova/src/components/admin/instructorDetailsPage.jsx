import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { 
    FaBuilding, 
    FaChalkboardTeacher, 
    FaDollarSign, 
    FaUserGraduate, 
    FaUsers, 
    FaWallet, 
    FaFileAlt, 
    FaBan,
    FaCheckCircle,
    FaArrowUp,
    FaArrowDown,
    FaEye
} from "react-icons/fa";

function InstructorDetailsPage() {
    const { id } = useParams()
    const [data, setData] = useState([])
    const [course, setCourse] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        setLoading(true)
        axios.get(`http://localhost:5000/api/admin/instructorById/${id}`, { withCredentials: true })
            .then((res) => {
                setData(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                
                setLoading(false)
            })
    }, [id])

    useEffect(() => {
        axios.get(`http://localhost:5000/api/admin/instructorCourses/${id}`)
            .then((res) => setCourse(res.data.data))
            .catch((err) =>{} )
    }, [id])

    function blockAndUnblock() {
        if (data.isActive) {
            axios.post(`http://localhost:5000/api/admin/instructorBlockAndUnBlock/${id}`, { isActive: false }, { withCredentials: true })
                .then((res) => {
                    axios.get(`http://localhost:5000/api/admin/instructorById/${id}`, { withCredentials: true })
                        .then((res) => setData(res.data.data))
                        .catch((err) =>{} )
                    toast.success(res.data.message)
                })
                .catch((err) => toast.error(err.response?.data?.message || err.message))
        } else {
            axios.post(`http://localhost:5000/api/admin/instructorBlockAndUnBlock/${id}`, { isActive: true }, { withCredentials: true })
                .then((res) => {
                    axios.get(`http://localhost:5000/api/admin/instructorById/${id}`, { withCredentials: true })
                        .then((res) => setData(res.data.data))
                        .catch((err) =>{} )
                    toast.success(res.data.message)
                })
                .catch((err) => toast.error(err.response?.data?.message || err.message))
        }
    }

    const chartData = [
        { month: 'Jan', company: 4000, instructor: 2400 },
        { month: 'Feb', company: 3000, instructor: 1398 },
        { month: 'Mar', company: 2000, instructor: 3800 },
        { month: 'Apr', company: 2780, instructor: 3908 },
        { month: 'May', company: 1890, instructor: 4800 },
        { month: 'Jun', company: 2390, instructor: 3800 }
    ];

    const totalWithdrawals = 28145;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 mt-16 flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="h-8 w-8 bg-indigo-600 rounded-full animate-bounce"></div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 mt-16">
                <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white">
                    <div className="px-4 py-8 md:px-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={data.avatar}
                                        alt={data.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-xl"
                                    />
                                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                                        data.isActive ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                        {data.isActive ? 
                                            <FaCheckCircle className="w-4 h-4 text-white" /> : 
                                            <FaBan className="w-4 h-4 text-white" />
                                        }
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{data.name}</h1>
                                    <p className="text-indigo-100">Web Development Expert</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                            data.isActive 
                                                ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                                                : 'bg-red-500/20 text-red-100 border border-red-400/30'
                                        }`}>
                                            {data.isActive ? 'Active' : 'Blocked'}
                                        </span>
                                        <span className="text-xs text-indigo-200">
                                            ID: {data._id?.slice(-6)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link 
                                    to={`/admin/instructor_details_and_documents/${data._id}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                                >
                                    <FaFileAlt className="w-4 h-4" />
                                    View Documents
                                </Link>
                                <button 
                                    onClick={() => blockAndUnblock()}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        data.isActive
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    <FaBan className="w-4 h-4" />
                                    {data.isActive ? 'Block Instructor' : 'Activate Instructor'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-8 md:px-8 -mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            title="Total Students"
                            value={data.students || 0}
                            icon={<FaUsers />}
                            trend="+12%"
                            trendUp={true}
                            color="blue"
                        />
                        <StatCard
                            title="Total Courses"
                            value={course.length}
                            icon={<FaChalkboardTeacher />}
                            trend="+5%"
                            trendUp={true}
                            color="emerald"
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`₹${(data.earnings || 0).toLocaleString()}`}
                            icon={<FaDollarSign />}
                            trend="+18%"
                            trendUp={true}
                            color="green"
                        />
                        <StatCard
                            title="Total Withdrawals"
                            value={`₹${totalWithdrawals.toLocaleString()}`}
                            icon={<FaWallet />}
                            trend="-3%"
                            trendUp={false}
                            color="orange"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                                Revenue Breakdown
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="group hover:bg-gray-50 rounded-lg p-4 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                <FaBuilding className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Company Revenue</p>
                                                <p className="text-xs text-gray-500">Platform commission</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">
                                                ₹{(data.company_revenue || 0).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-green-600 flex items-center justify-end gap-1">
                                                <FaArrowUp className="w-3 h-3" /> 12.5%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="group hover:bg-gray-50 rounded-lg p-4 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                <FaUserGraduate className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Instructor Revenue</p>
                                                <p className="text-xs text-gray-500">Total earnings</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">
                                                ₹{(data.earnings || 0).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-green-600 flex items-center justify-end gap-1">
                                                <FaArrowUp className="w-3 h-3" /> 8.2%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                                Revenue Trend
                            </h2>
                            <div className="h-64 flex items-end justify-between gap-3 bg-gradient-to-b from-gray-50 to-white rounded-xl p-4">
                                {chartData.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                        <div className="flex flex-col items-center gap-1 w-full relative">
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity">
                                                ₹{item.company}
                                            </div>
                                            <div 
                                                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg w-8 transition-all duration-300 hover:w-10"
                                                style={{ height: `${(item.company / 5000) * 120}px` }}
                                            ></div>
                                            <div 
                                                className="bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-b-lg w-8 transition-all duration-300 hover:w-10"
                                                style={{ height: `${(item.instructor / 5000) * 120}px` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                                    <span className="text-sm text-gray-600">Company</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded"></div>
                                    <span className="text-sm text-gray-600">Instructor</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                                Recent Courses
                            </h2>
                            <Link 
                                to={`/admin/instructor-courses/${id}`}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                            >
                                View All Courses 
                                <span>→</span>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {course?.slice(0, 3).map((course, index) => (
                                <div key={course._id || index} className="group cursor-pointer">
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <div className="relative">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <button className="flex items-center gap-2 bg-white/90 backdrop-blur text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                    <FaEye className="w-4 h-4" />
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <FaUsers className="w-4 h-4" />
                                                    {course.students?.length || 0} students
                                                </p>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    course.status === 'Active' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {course.status || 'Published'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-500">
                                                    Updated 2 days ago
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    ₹{course.price || 0}
                                                </p>
                                            </div>
                                        </div>
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

const StatCard = ({ title, value, icon, trend, trendUp, color }) => {
    const colorVariants = {
        blue: "from-blue-500 to-blue-600 shadow-blue-500/30",
        emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
        green: "from-green-500 to-green-600 shadow-green-500/30",
        orange: "from-orange-500 to-orange-600 shadow-orange-500/30"
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <div className="flex items-center gap-1 mt-2">
                        {trendUp ? (
                            <FaArrowUp className="w-3 h-3 text-green-600" />
                        ) : (
                            <FaArrowDown className="w-3 h-3 text-red-600" />
                        )}
                        <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                            {trend}
                        </span>
                        <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-r ${colorVariants[color]} rounded-xl flex items-center justify-center shadow-lg text-white`}>
                    {React.cloneElement(icon, { className: "w-7 h-7" })}
                </div>
            </div>
        </div>
    );
};

export default React.memo(InstructorDetailsPage);