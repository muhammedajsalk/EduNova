import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaPlayCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../userContext";
import { useContext } from "react";

const CourseEntrollSection = () => {
    const { id } = useParams()

    const [data, setData] = useState([])
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/admin/courseById/${id}`)
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err))
    }, [])

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
    return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-6 mt-20">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    {/* Left Side */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {data.title}
                        </h1>
                        <p className="text-gray-600 mb-3">
                            ⭐ 4.8 (8,263 ratings) • 48,000 students enrolled • Last updated
                            January 2024
                        </p>
                        <p className="text-gray-700 mb-4">Created by David Mitchell</p>

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap mb-4">
                            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                                Bestseller
                            </span>
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                                New
                            </span>
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                Top Rated
                            </span>
                        </div>
                    </div>

                    {/* Right Side - Enroll Box */}
                    <div className="bg-white shadow-lg rounded-lg p-5 w-full lg:w-1/3">
                        {user.role === "user" && (
                            <>
                                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                                    Enroll Now
                                </button>
                                <button className="w-full border border-gray-300 py-3 mt-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                                    Try for Free
                                </button>
                            </>
                        )}
                        <ul className="mt-4 text-gray-600 text-sm space-y-2">
                            <li>✔ 45 hours of video</li>
                            <li>✔ 72 downloadable resources</li>
                            <li>✔ Certificate of completion</li>
                            <li>✔ Lifetime access</li>
                        </ul>
                    </div>
                </div>

                {/* Course Preview */}
                <div className="mt-6">
                    <img
                        src="https://jaro-website.s3.ap-south-1.amazonaws.com/2024/08/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg"
                        alt="Course Preview"
                        className="w-full rounded-lg"
                    />
                </div>

                {/* Course Curriculum */}
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

                {/* Instructor */}
                <div className="mt-10 flex items-center gap-4">
                    <img
                        src={data.instructorId?.avatar}
                        alt="Instructor"
                        className="w-20 h-20 rounded-full"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">{data.instructorId?.name}</h3>
                        <p className="text-gray-600">
                            Senior Web Developer & Instructor with 10+ years of experience.
                        </p>
                    </div>
                </div>

                {/* Mentoring Section */}
                <div className="mt-10 bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">Get Personal Mentoring</h3>
                    <ul className="text-gray-700 space-y-2">
                        <li>✔ 1-on-1 coding sessions</li>
                        <li>✔ Career guidance</li>
                        <li>✔ Project review</li>
                    </ul>
                    <button className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Learn More
                    </button>
                </div>
            </div>
        </>
    );
};

export default CourseEntrollSection;
