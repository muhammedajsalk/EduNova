import React, { useEffect, useState } from 'react';
import { FaVideo, FaStar, FaUsers, FaPlayCircle, FaListAlt, FaChalkboardTeacher, FaClock, FaEye, FaTimes } from 'react-icons/fa';
import { MdBlock, MdEdit, MdUpdate, MdVerified } from 'react-icons/md';
import { BiPlay, BiTime } from 'react-icons/bi';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const CourseDetailsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8 pt-20">
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded-lg w-96"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status, type = "active" }) => {
  const getStatusStyles = () => {
    if (type === "active") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    return "bg-red-50 text-red-700 border border-red-200";
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
        type === "active" ? "bg-emerald-500" : "bg-red-500"
      }`} />
      {status}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, color = "gray" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-emerald-600 bg-emerald-50 border-emerald-200",
    yellow: "text-amber-600 bg-amber-50 border-amber-200",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    gray: "text-gray-600 bg-gray-50 border-gray-200"
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-sm">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const VideoModal = ({ isOpen, onClose, video }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{video.title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <video
            controls
            className="w-full rounded-xl shadow-lg"
            src={video.url}
            poster="/api/placeholder/800/450"
          />
        </div>
      </div>
    </div>
  );
};

const LectureItem = ({ lecture, onPlay, index }) => (
  <div className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition-all duration-200">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
        <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {lecture.title}
        </h4>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <BiTime className="w-3 h-3" />
          {formatDurationReadable(lecture.duration)}
        </p>
      </div>
    </div>
    <button
      onClick={() => onPlay(lecture.title, lecture.url)}
      className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
    >
      <BiPlay className="w-4 h-4" />
      Preview
    </button>
  </div>
);

const CourseDetailsPage = () => {
    const [data, setData] = useState({});
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState({ title: "", url: "" });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/courseById/${id}`, { withCredentials: true })
            .then((res) => setData(res.data.data))
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, [id]);

    const openModal = (title, url) => {
        setSelectedVideo({ title, url });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideo({ title: "", url: "" });
    };

    const totalSection = data.curriculum?.length || 0;
    const totalLectures = data.curriculum?.reduce((acc, section) => acc + (section.lectures?.length || 0), 0) || 0;
    const totalDuration = data.curriculum?.reduce((acc, section) => {
        return acc + (section.lectures?.reduce((sum, lecture) => sum + (lecture.duration || 0), 0) || 0);
    }, 0) || 0;

    function formatDurationCustom(seconds) {
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = Math.floor(totalSeconds % 60);

        if (hours >= 1) {
            const paddedMin = minutes.toString().padStart(2, "0");
            return `${hours}h ${paddedMin}m`;
        } else {
            const fraction = (secs / 60).toFixed(2).toString().split(".")[1];
            return `${minutes}.${fraction}m`;
        }
    }

    function formatDurationReadable(seconds) {
        const sec = Math.floor(seconds % 60);
        const min = Math.floor((seconds / 60) % 60);
        const hr = Math.floor(seconds / 3600);

        if (hr >= 1) {
            return `${hr}h ${min.toString().padStart(2, "0")}m`;
        } else if (min >= 1) {
            return `${min}m ${sec.toString().padStart(2, "0")}s`;
        } else {
            return `${sec}s`;
        }
    }

    function timeAgo(dateStr) {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    if (isLoading) {
        return <CourseDetailsSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8 pt-20 mt-10">
            <div className="max-w-7xl mx-auto space-y-8">
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <MdEdit className="w-4 h-4" />
                                Created {timeAgo(data.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                                <MdUpdate className="w-4 h-4" />
                                Updated {timeAgo(data.updatedAt)}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-medium">
                            <MdBlock className="w-4 h-4" />
                            Block Course
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 space-y-8">
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                        <HiOutlineAcademicCap className="w-3 h-3 mr-1" />
                                        {data.category}
                                    </span>
                                    <StatusBadge status="Active" type="active" />
                                </div>
                                
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                                    <img 
                                        src={data.thumbnail} 
                                        alt={data.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                
                                <div className="space-y-4">
                                    <p className="text-gray-700 leading-relaxed">{data.description}</p>
                                    
                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <FaStar className="w-4 h-4" />
                                                <span className="font-semibold text-gray-900">4.8</span>
                                            </div>
                                            <span className="text-sm text-gray-500">(4.8/5.0)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                                            <FaUsers className="w-4 h-4" />
                                            {data.students?.length || 0} Students Enrolled
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FaListAlt className="w-5 h-5 text-blue-600" />
                                    Course Curriculum
                                </h2>
                                <div className="text-sm text-gray-500">
                                    {totalSection} sections • {totalLectures} lectures
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {data.curriculum?.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="space-y-3">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-semibold text-sm">
                                                {sectionIndex + 1}
                                            </div>
                                            <h3 className="font-semibold text-gray-900">{section.section}</h3>
                                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                                                {section.lectures?.length || 0} lectures
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2 pl-4">
                                            {section.lectures?.map((lecture, lectureIndex) => (
                                                <LectureItem
                                                    key={lectureIndex}
                                                    lecture={lecture}
                                                    onPlay={openModal}
                                                    index={lectureIndex}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FaChalkboardTeacher className="w-5 h-5 text-emerald-600" />
                                Instructor
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img 
                                            src={data.instructorId?.avatar} 
                                            alt="Instructor" 
                                            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-100"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-1">
                                            {data?.instructorId?.name}
                                            <MdVerified className="w-4 h-4 text-blue-500" />
                                        </h4>
                                        <p className="text-sm text-gray-500">{data?.instructorId?.email}</p>
                                    </div>
                                </div>
                                
                                <Link 
                                    to={`/admin/instructor_details/${data.instructorId?._id}`}
                                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors font-medium"
                                >
                                    <FaEye className="w-4 h-4 mr-2" />
                                    View Details
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                📊 Course Statistics
                            </h3>
                            
                            <div className="space-y-3">
                                <StatCard
                                    icon={FaUsers}
                                    label="Total Students"
                                    value={data.students?.length || 0}
                                    color="blue"
                                />
                                <StatCard
                                    icon={FaStar}
                                    label="Average Rating"
                                    value="4.8 / 5.0"
                                    color="yellow"
                                />
                                <StatCard
                                    icon={FaListAlt}
                                    label="Total Sections"
                                    value={totalSection}
                                    color="emerald"
                                />
                                <StatCard
                                    icon={FaChalkboardTeacher}
                                    label="Total Lectures"
                                    value={totalLectures}
                                    color="green"
                                />
                                <StatCard
                                    icon={FaClock}
                                    label="Total Duration"
                                    value={formatDurationCustom(totalDuration)}
                                    color="gray"
                                />
                                <StatCard
                                    icon={MdUpdate}
                                    label="Last Updated"
                                    value={timeAgo(data.updatedAt)}
                                    color="gray"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <VideoModal
                isOpen={isModalOpen}
                onClose={closeModal}
                video={selectedVideo}
            />
        </div>
    );
};

function formatDurationReadable(seconds) {
    const sec = Math.floor(seconds % 60);
    const min = Math.floor((seconds / 60) % 60);
    const hr = Math.floor(seconds / 3600);

    if (hr >= 1) {
        return `${hr}h ${min.toString().padStart(2, "0")}m`;
    } else if (min >= 1) {
        return `${min}m ${sec.toString().padStart(2, "0")}s`;
    } else {
        return `${sec}s`;
    }
}

export default React.memo(CourseDetailsPage)