import React, { useEffect, useState } from 'react';
import { FaVideo, FaStar, FaUsers, FaPlayCircle, FaListAlt, FaChalkboardTeacher, FaClock, FaGraduationCap, FaComments, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdBlock, MdUpdate, MdClose, MdPlayArrow } from 'react-icons/md';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const CourseViewPage = () => {
    const [data, setData] = useState([]);
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState({ title: "", url: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:5000/api/admin/courseById/${id}`, { withCredentials: true })
            .then((res) => setData(res.data.data))
            .catch((err) => {})
            .finally(() => setIsLoading(false));
    }, [id]);

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const openModal = (title, url) => {
        setSelectedVideo({ title, url });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideo({ title: "", url: "" });
    };

    const totalSection = data.curriculum?.length;
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
            {isLoading ? (
                <div className="min-h-screen bg-gray-50">
                    <div className="animate-pulse p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                        <div className="h-8 bg-gray-300 rounded w-1/2" />
                        <div className="h-64 bg-gray-200 rounded-xl" />
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="h-48 bg-gray-100 rounded-xl col-span-2" />
                            <div className="h-48 bg-gray-100 rounded-xl" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-gray-50">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 text-white">
                        <div className="p-4 md:p-8 max-w-7xl mx-auto">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
                                            {data.category}
                                        </span>
                                        <span className="bg-green-500/20 backdrop-blur text-green-100 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            Active
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{data.title}</h1>
                                    <p className="text-blue-100 text-sm mb-4">
                                        Created {timeAgo(data.createdAt)} • Last updated {timeAgo(data.updatedAt)}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaUsers />
                                            <span>{data.students?.length} students enrolled</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                    <MdBlock /> Block Course
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 md:p-8 max-w-7xl mx-auto -mt-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="aspect-video bg-gray-900 relative group cursor-pointer">
                                        <img
                                            src={data.thumbnail}
                                            alt={data.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-white/90 rounded-full p-4">
                                                <MdPlayArrow className="text-4xl text-gray-900" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-3">About this course</h2>
                                        <p className="text-gray-600 leading-relaxed">{data.description}</p>
                                    </div>
                                </div>

                                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold">Course Curriculum</h2>
                                        <div className="text-sm text-gray-600">
                                            {totalSection} sections • {totalLectures} lectures • {formatDurationCustom(totalDuration)}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {data.curriculum?.map((section, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => toggleSection(index)}
                                                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg font-semibold">Section {index + 1}:</span>
                                                        <span className="text-gray-700">{section.section}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm text-gray-500">
                                                            {section.lectures.length} lectures
                                                        </span>
                                                        {expandedSections[index] ? <FaChevronUp /> : <FaChevronDown />}
                                                    </div>
                                                </button>

                                                {expandedSections[index] && (
                                                    <div className="border-t border-gray-200">
                                                        {section.lectures.map((lecture, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                                            >
                                                                <button
                                                                    onClick={() => openModal(lecture.title, lecture.url)}
                                                                    className="flex items-center gap-3 text-left flex-1 group"
                                                                >
                                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                                        <FaPlayCircle className="text-blue-600" />
                                                                    </div>
                                                                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                                                                        {lecture.title}
                                                                    </span>
                                                                </button>
                                                                <span className="text-sm text-gray-500">
                                                                    {formatDurationReadable(lecture.duration)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                        <FaGraduationCap className="text-blue-600" />
                                        Course Statistics
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: FaUsers, label: "Total Students", value: data.students?.length, color: "text-blue-600" },
                                            { icon: FaStar, label: "Average Rating", value: "4.8 / 5.0", color: "text-yellow-500" },
                                            { icon: FaListAlt, label: "Total Sections", value: totalSection, color: "text-emerald-600" },
                                            { icon: FaChalkboardTeacher, label: "Total Lectures", value: totalLectures, color: "text-green-600" },
                                            { icon: FaClock, label: "Total Duration", value: formatDurationCustom(totalDuration), color: "text-red-600" },
                                            { icon: MdUpdate, label: "Last Updated", value: timeAgo(data.updatedAt), color: "text-gray-600" }
                                        ].map((stat, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <stat.icon className={`${stat.color} text-xl`} />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                                    <p className="font-semibold">{stat.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                                    <Link to={`/instructorDashboard/InstructorChat/${data?._id}`} className="block">
                                        <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105">
                                            <FaComments />
                                            Student Messages
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
                                <div className="bg-gray-900 p-4 flex items-center justify-between">
                                    <h2 className="text-white font-semibold text-lg">
                                        {selectedVideo.title}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-white hover:text-red-400 transition-colors"
                                    >
                                        <MdClose size={24} />
                                    </button>
                                </div>

                                <div className="aspect-video bg-black">
                                    <iframe
                                        src={selectedVideo.url}
                                        title={selectedVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default React.memo(CourseViewPage);
