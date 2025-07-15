import React, { useState } from "react";
import {
    FaCheck,
    FaTimes,
    FaClock,
    FaUsers,
    FaListUl,
    FaVideo,
    FaPlayCircle,
} from "react-icons/fa";
import AdminNavbar from "./adminNavbar";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const CourseApproval = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState({ title: "", url: "" });
    const [data, setData] = useState([])
    const [rejectReson, setRejectReason] = useState(null)
    const [status, setStatus] = useState("text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded font-medium")
    const [Click, setClick] = useState(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectSubmiting, setRejectSubmiting] = useState(false)
    const [approveSubmiting, setApproveSubmiting] = useState(false)
    const navigate = useNavigate()

    const { id } = useParams()

    const openModal = (title, url) => {
        setSelectedVideo({ title, url });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideo({ title: "", url: "" });
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5000/api/admin/courseById/${id}`,{withCredentials: true})
            .then((res) => {
                setData(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            }
            )
    }, [])

    const totalSection = data.curriculum?.length
    const totalLectures = data.curriculum?.reduce((acc, section) => acc + section.lectures.length, 0);
    const totalDuration = data.curriculum?.reduce((acc, section) => {
        return acc + section.lectures.reduce((sum, lecture) => sum + lecture.duration, 0);
    }, 0);

    function formatDurationCustom(seconds) {
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = Math.floor(totalSeconds % 60);

        if (hours >= 1) {
            const paddedMin = minutes.toString().padStart(2, "0");
            return `${hours} hr ${paddedMin} min`;
        } else {
            const fraction = (secs / 60).toFixed(2).toString().split(".")[1];
            return `${minutes}.${fraction} min`;
        }
    }

    function formatDurationReadable(seconds) {
        const sec = Math.floor(seconds % 60);
        const min = Math.floor((seconds / 60) % 60);
        const hr = Math.floor(seconds / 3600);

        if (hr >= 1) {
            return `${hr} hr ${min.toString().padStart(2, "0")} min`;
        } else if (min >= 1) {
            return `${min} min ${sec.toString().padStart(2, "0")} sec`;
        } else {
            return `${sec} sec`;
        }
    }

    function timeAgo(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    function reject() {
        if (!rejectReson) {
            return toast.warning("please enter the rejection reason")
        }
        setRejectSubmiting(true)
        setClick(true)
        axios.post("http://localhost:5000/api/admin/courseApproveAndReject", {
            id: id,
            status: "rejected",
            rejectionReason: rejectReson,
            email: data.instructorId?.email,
            courseTitle: data.title
        }, { withCredentials: true })
            .then((res) => {
                toast.success(res.data.message)
                setTimeout(() => {
                    navigate('/courseManagement')
                }, 3000);
            }
            )
            .catch((err) => toast.error(err.response?.data?.message || err.message))
            .finally(() => setRejectSubmiting(false))
        setClick(false)
    }


    function approved() {
        setApproveSubmiting(true)
        setClick(true)
        axios.post("http://localhost:5000/api/admin/courseApproveAndReject", {
            id: id,
            status: "approved",
            email: data.instructorId?.email,
            courseTitle: data.title
        }, { withCredentials: true })
            .then((res) => {
                toast.success(res.data.message)
                setTimeout(() => {
                    navigate('/courseManagement')
                }, 3000);
            }
            )
            .catch((err) => toast.error(err.response?.data?.message || err.message))
            .finally(()=>setApproveSubmiting(false))
        setClick(false)
    }


    return (
        <>
            <AdminNavbar />
            {loading ? (
                <div className="animate-pulse max-w-6xl mx-auto mt-10 px-6 space-y-8">
                    {/* Header Section */}
                    {/* Instructor Info */}
                    <div className="bg-gray-100 p-4 rounded shadow space-y-4 mt-30">
                        <div className="h-4 bg-gray-300 w-32 rounded" />
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-300" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-300 rounded" />
                                <div className="h-3 w-48 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded shadow p-4 space-y-3">
                                <div className="h-4 bg-gray-300 rounded w-2/3" />
                                <div className="h-6 bg-gray-200 rounded w-1/3" />
                            </div>
                        ))}
                    </div>

                    {/* Curriculum */}
                    <div>
                        <div className="h-6 bg-gray-300 w-56 mb-4 rounded" />
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i}>
                                    <div className="h-4 bg-gray-300 w-40 mb-2 rounded" />
                                    <div className="space-y-2">
                                        {[1, 2].map((j) => (
                                            <div key={j} className="flex justify-between bg-gray-100 p-3 rounded shadow-sm">
                                                <div className="flex gap-2">
                                                    <div className="w-4 h-4 bg-blue-300 rounded-full" />
                                                    <div className="h-4 w-36 bg-gray-300 rounded" />
                                                </div>
                                                <div className="h-3 w-16 bg-gray-200 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div className="text-center mt-20 text-red-500 font-semibold text-lg">
                    {error}
                </div>
            ) : (
                <div className="p-4 md:p-8 max-w-6xl mx-auto mt-15">
                    {/* Course Header */}
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Thumbnail */}
                        <div className="relative w-full md:w-40 h-40 md:h-32 rounded overflow-hidden">
                            <img
                                src={data.thumbnail}
                                alt="Course Thumbnail"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1">
                            <h1 className="text-xl md:text-2xl font-semibold">{data.title}</h1>
                            <p className="text-gray-600 text-sm mt-2">{data.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{data.category}</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mt-4 md:mt-0 text-left md:text-right min-w-[120px]">
                            <span
                                className={`text-sm px-2 py-1 rounded font-medium ${data.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : data.status === "rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-600"
                                    }`}
                            >
                                {data.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">Created {timeAgo(data.createdAt)}</p>
                        </div>
                    </div>


                    {/* Instructor Details */}
                    <div className="mt-8 bg-gray-50 p-4 rounded shadow">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">Instructor Details</h2>
                        <div className="flex items-center gap-4">
                            <img
                                src={data.instructorId?.avatar}
                                alt="Instructor"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-medium text-gray-800">{data.instructorId?.name}</h3>
                                <p className="text-sm text-gray-600">Senior Web Developer & Technical Instructor</p>
                            </div>
                        </div>
                    </div>


                    {/* Course Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white rounded shadow p-4">
                            <p className="text-sm font-medium text-gray-600 flex items-center gap-2"><FaVideo /> Total Lectures</p>
                            <h2 className="text-lg font-bold">{totalLectures}</h2>
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <p className="text-sm font-medium text-gray-600 flex items-center gap-2"><FaListUl /> Course Sections</p>
                            <h2 className="text-lg font-bold">{totalSection}</h2>
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <p className="text-sm font-medium text-gray-600 flex items-center gap-2"><FaClock /> Total Duration</p>
                            <h2 className="text-lg font-bold">{formatDurationCustom(totalDuration)}</h2>
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <p className="text-sm font-medium text-gray-600 flex items-center gap-2"><FaUsers /> Enrolled Students</p>
                            <h2 className="text-lg font-bold">0</h2>
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Course Curriculum</h2>
                        <div className="space-y-6">
                            {data.curriculum?.map((section, index) => (
                                <div key={index}>
                                    <h3 className="font-medium text-gray-700 mb-2">{section.section}</h3>
                                    <ul className="space-y-2">
                                        {section.lectures.map((lecture, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center justify-between bg-gray-50 p-3 rounded shadow-sm"
                                            >
                                                <span className="flex items-center gap-2 text-sm text-gray-700">
                                                    <FaPlayCircle
                                                        className="text-blue-500 cursor-pointer"
                                                        onClick={() => openModal(lecture.title, lecture.url)}
                                                    />
                                                    {lecture.title}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDurationReadable(lecture.duration)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Rejection Reason */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                        <textarea
                            rows="4"
                            maxLength={500}
                            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter the reason for rejection..."
                            onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2" disabled={Click} onClick={() => approved()}>
                            {approveSubmiting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Approving...
                            </>
                        ) : (
                            "Approve Course"
                        )}
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2" disabled={Click} onClick={() => reject()}>
                            {rejectSubmiting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                rejecting...
                            </>
                        ) : (
                            "Reject Course"
                        )}
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ Modal */}
            {isModalOpen && (
                <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-black w-full max-w-2xl rounded shadow-lg p-4 relative">
                        <button
                            className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-semibold mb-2">{selectedVideo.title}</h2>
                        <video
                            controls
                            className="w-full rounded"
                            src={selectedVideo.url}
                        />
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default React.memo(CourseApproval);
