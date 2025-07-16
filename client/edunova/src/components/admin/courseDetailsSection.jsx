import React, { useEffect, useState } from 'react';
import { FaVideo, FaStar, FaUsers, FaPlayCircle, FaListAlt, FaChalkboardTeacher, FaClock } from 'react-icons/fa';
import { MdBlock, MdEdit, MdUpdate } from 'react-icons/md';
import AdminNavbar from './adminNavbar';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const CourseDetailsPage = () => {
    const [data, setData] = useState([])
    const { id } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState({ title: "", url: "" });
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:5000/api/admin/courseById/${id}`, { withCredentials: true })
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false))
    }, [])

    const openModal = (title, url) => {
        setSelectedVideo({ title, url });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideo({ title: "", url: "" });
    };

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

    return (
        <>
            <AdminNavbar />
            {isLoading ? (
                <div className="animate-pulse p-4 md:p-8 max-w-7xl mx-auto space-y-6 mt-22">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-300 rounded w-1/2" />
                        <div className="h-48 bg-gray-200 rounded" />
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="h-40 bg-gray-100 rounded col-span-2" />
                            <div className="h-40 bg-gray-100 rounded" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 mt-12">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">{data.title}</h1>
                                <p className="text-sm text-gray-500">Created: {timeAgo(data.createdAt)} | Updated: {timeAgo(data.updatedAt)}</p>
                            </div>
                            <div className="space-x-2">
                                <button className="bg-red-100 text-red-600 px-3 py-1 rounded flex items-center gap-1 text-sm">
                                    <MdBlock /> Block Course
                                </button>
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Description */}
                            <div className="md:col-span-2 bg-white shadow rounded-xl p-5">
                                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full mb-2 inline-block">{data.category}</span>
                                <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 text-4xl">
                                    <img src={data.thumbnail} alt="" className='w-full' />
                                </div>
                                <p className="mt-4 text-gray-700">
                                    {data.description}
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <FaStar /> <span className="text-black font-medium">4.8</span> <span className="text-gray-400 text-sm">(4.8/5.0)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaUsers /> {data.students?.length} Students Enrolled
                                    </div>
                                </div>
                                <div className="mt-2 text-green-600 font-semibold text-sm">Status: Active</div>
                            </div>

                            {/* Instructor & Stats */}
                            <div className="bg-white shadow rounded-xl p-5 space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Instructor Details</h3>
                                    <div className="flex items-center gap-3">
                                        <img src={data.instructorId?.avatar} alt="Instructor" className="w-14 h-14 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold">{data?.instructorId?.name}</p>
                                            <p className="text-xs text-gray-500">{data?.instructorId?.email}</p>
                                        </div>
                                        <button className='bg-indigo-500 text-white p-3 rounded-md'>
                                            <Link to={`/admin/instructor_details/${data.instructorId?._id}`}>
                                                More Details
                                            </Link>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white shadow rounded-xl p-5">
                                    <h3 className="font-bold text-lg mb-4 text-gray-800">📊 Course Statistics</h3>
                                    <ul className="space-y-3 text-gray-700 text-sm">
                                        <li className="flex items-center gap-3">
                                            <FaUsers className="text-blue-500" />
                                            <span className="font-medium">Total Students:</span> {data.students?.length}
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FaStar className="text-yellow-500" />
                                            <span className="font-medium">Average Rating:</span> 4.8 / 5.0
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FaListAlt className="text-green-500" />
                                            <span className="font-medium">Total Sections:</span> {totalSection}
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FaChalkboardTeacher className="text-purple-500" />
                                            <span className="font-medium">Total Lectures:</span> {totalLectures}
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <FaClock className="text-pink-500" />
                                            <span className="font-medium">Total Duration:</span> {formatDurationCustom(totalDuration)}
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <MdUpdate className="text-gray-500" />
                                            <span className="font-medium">Last Updated:</span> {timeAgo(data.updatedAt)}
                                        </li>
                                    </ul>
                                </div>
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
                    </div>
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
                </>
            )}
        </>
    );
};

const Lesson = ({ title, duration }) => (
    <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="text-xl text-gray-500">
                <FaVideo />
            </div>
            <div>
                <p className="font-medium text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{duration}</p>
            </div>
        </div>
        <button className="text-blue-500 text-sm font-medium hover:underline">Preview</button>
    </div>
);

export default CourseDetailsPage;