import React, { useState } from "react";
import { FaStar, FaPlay } from "react-icons/fa";
import Footer from "./homePage Components/Footer";

function CourseDetails() {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const curriculum = [
        {
            title: "Getting Started with Web Development",
            lessons: ["Introduction to Web Development", "Setting up Your Environment", "Understanding HTML Basics"],
        },
        {
            title: "HTML & CSS Fundamentals",
            lessons: ["HTML Structure", "CSS Selectors", "Responsive Design"],
        },
        {
            title: "JavaScript Essentials",
            lessons: ["Variables & Data Types", "Functions & Objects", "DOM Manipulation"],
        },
    ];

    return (
        <>
            <div className="bg-gray-50 min-h-screen py-10 px-4 mt-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <p className="text-sm text-gray-500">Development &gt; Web Development</p>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Web Development Bootcamp 2024</h1>
                            <p className="text-gray-600 text-sm">42,000+ students · Last updated Jan 2024 · Created by <strong>David Mitchell</strong></p>
                            <div className="flex items-center gap-2 mt-1 text-yellow-500">
                                <FaStar /><FaStar /><FaStar /><FaStar /><span className="text-gray-700 text-sm">4.8 (8,243 ratings)</span>
                            </div>
                        </div>

                      
                        <div className="relative w-full overflow-hidden rounded-xl shadow-md">
                            <img
                                src="https://media.istockphoto.com/id/1432156040/vector/vector-flat-illustration-of-web-ui-ux-design-web-development-concept-team-designers-creating.jpg?s=612x612&w=0&k=20&c=XEMYf3ZGy5QncMGeuMMcgKcOUIE1bxl2xWPrw6owLpc="
                                alt="course preview"
                                className="w-full h-auto object-cover max-h-[400px]" // ADDED
                            />
                            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg">
                                <FaPlay className="text-indigo-600" />
                            </button>
                            <p className="mt-2 text-sm text-center text-gray-500">Preview this course</p>
                        </div>


                        <div>
                            <h2 className="text-xl font-semibold mb-4">Course Curriculum</h2>
                            <div className="space-y-4">
                                {curriculum.map((section, idx) => (
                                    <div key={idx} className="bg-white border rounded-lg">
                                        <button
                                            onClick={() => toggleSection(idx)}
                                            className="w-full text-left px-4 py-3 font-medium text-indigo-700 flex justify-between items-center"
                                        >
                                            <span>{section.title}</span>
                                            <span>{openSection === idx ? "-" : "+"}</span>
                                        </button>
                                        {openSection === idx && (
                                            <ul className="px-6 pb-4 text-sm text-gray-700 space-y-2">
                                                {section.lessons.map((lesson, i) => (
                                                    <li key={i} className="flex justify-between border-b py-1">
                                                        <span>{lesson}</span>
                                                        <span className="text-green-600 font-medium">Free</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">Instructor</h2>
                            <div className="flex items-center gap-4">
                                <img src="https://via.placeholder.com/80" className="rounded-full" alt="instructor" />
                                <div>
                                    <p className="font-semibold">David Mitchell</p>
                                    <p className="text-sm text-gray-600">Senior Web Developer · 42K students</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                David has over 10 years of experience in web development and has helped thousands of students achieve their career goals.
                            </p>
                            <button className="mt-4 text-indigo-600 underline text-sm">Message Instructor</button>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Get Personal Mentoring</h3>
                            <ul className="list-disc pl-6 text-sm text-indigo-800 mb-4">
                                <li>1-on-1 coding sessions</li>
                                <li>Career advice</li>
                                <li>Project reviews</li>
                            </ul>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded">Learn More</button>
                        </div>
                    </div>

                    <aside className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <ul className="text-sm text-gray-700 space-y-1 mb-4">
                            <li>✔ 15 hours of video</li>
                            <li>✔ 20 downloadable resources</li>
                            <li>✔ Certificate of completion</li>
                            <li>✔ Lifetime access</li>
                        </ul>
                        <div className="space-y-2 mb-4">
                            <button className="w-full bg-indigo-600 text-white py-2 rounded">Enroll Now</button>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer/>
        </>
    );
}


export default React.memo(CourseDetails)