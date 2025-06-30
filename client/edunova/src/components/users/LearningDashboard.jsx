import React, { useState } from "react";
import Navbar from "../public pages/homePage Components/navbar";
import Footer from "../public pages/homePage Components/Footer";
import UserNavbar from "./UserNavbar";

const LearningDashboard = () => {
    const [visibleCourses, setVisibleCourses] = useState(3);

  const allCourses = [
    {
      title: "UI/UX Design Fundamentals",
      progress: 75,
      time: "2.5 hours left",
      image: "https://media.istockphoto.com/id/1075599562/photo/programmer-working-with-program-code.jpg?s=612x612&w=0&k=20&c=n3Vw5SMbMCWW1YGG6lnTfrwndNQ8B_R4Vw-BN7LkqpA=",
    },
    {
      title: "Web Development Bootcamp",
      progress: 45,
      time: "6 hours left",
      image: "https://media.istockphoto.com/id/1451456915/photo/female-freelance-developer-coding-and-programming-coding-on-two-with-screens-with-code.jpg?s=612x612&w=0&k=20&c=BFFIc-xOwzeRyR8ui9VkFKEqqqQFBbISJzr-ADN6hS8=",
    },
    {
      title: "Digital Marketing Essentials",
      progress: 30,
      time: "8 hours left",
      image: "https://media.istockphoto.com/id/1265038430/photo/website-designer-creative-planning-phone-app-development-template-layout-framework-wireframe.jpg?s=612x612&w=0&k=20&c=sgKiBYMwfcdw7W4q4lLxwqpm4PovVLZ9CE7wCLbBWHk=",
    },
    {
      title: "Advanced CSS Techniques",
      progress: 60,
      time: "3 hours left",
      image: "https://via.placeholder.com/300x160?text=CSS",
    },
    {
      title: "React Hooks Deep Dive",
      progress: 20,
      time: "5.5 hours left",
      image: "https://via.placeholder.com/300x160?text=React+Hooks",
    },
    {
      title: "JavaScript Fundamentals",
      progress: 90,
      time: "1 hour left",
      image: "https://via.placeholder.com/300x160?text=JavaScript",
    },
    {
      title: "Digital Marketing Essentials",
      progress: 30,
      time: "8 hours left",
      image: "https://media.istockphoto.com/id/1265038430/photo/website-designer-creative-planning-phone-app-development-template-layout-framework-wireframe.jpg?s=612x612&w=0&k=20&c=sgKiBYMwfcdw7W4q4lLxwqpm4PovVLZ9CE7wCLbBWHk=",
    },
    {
      title: "Advanced CSS Techniques",
      progress: 60,
      time: "3 hours left",
      image: "https://via.placeholder.com/300x160?text=CSS",
    },
    {
      title: "React Hooks Deep Dive",
      progress: 20,
      time: "5.5 hours left",
      image: "https://via.placeholder.com/300x160?text=React+Hooks",
    },
    {
      title: "JavaScript Fundamentals",
      progress: 90,
      time: "1 hour left",
      image: "https://via.placeholder.com/300x160?text=JavaScript",
    },
  ];

  const handleShowMore = () => {
    setVisibleCourses((prev) => Math.min(prev + 3, allCourses.length));
  };

  const handleShowLess = () => {
    setVisibleCourses(3);
  };
    return (
        <>
            <UserNavbar/>
            <div className="p-6 md:p-12 space-y-8 font-sans mt-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold">Welcome back, Sarah</h2>
                        <p className="text-gray-500 text-sm">Monday, February 12, 2024</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Learning Hours This Week</p>
                        <p className="text-indigo-600 font-bold text-lg">12.5 hrs</p>
                    </div>
                </div>

                <section>
                    <h3 className="text-lg font-semibold mb-4">Your Courses</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {allCourses.slice(0, visibleCourses).map((course, idx) => (
                            <div key={idx} className=" rounded-lg overflow-hidden shadow-sm">
                                <div className="w-full h-40">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold mb-2">{course.title}</h4>
                                    <div className="w-full bg-gray-200 h-2 rounded mb-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {course.progress}% Complete • {course.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 text-center">
                        {visibleCourses < allCourses.length ? (
                            <button
                                onClick={handleShowMore}
                                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Show More
                            </button>
                        ) : (
                            <button
                                onClick={handleShowLess}
                                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Show Less
                            </button>
                        )}
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-4">Scheduled Mentor Sessions</h3>
                    <div className="space-y-4">
                        {[
                            {
                                title: "UI Design Portfolio Review",
                                mentor: "Alex Thompson",
                                time: "Today, 2:00 PM",
                                avatar: "https://i.pravatar.cc/40",
                            },
                            {
                                title: "JavaScript Best Practices",
                                mentor: "Sarah Chen",
                                time: "Tomorrow, 10:00 AM",
                                avatar: "https://i.pravatar.cc/40",
                            },
                        ].map((session, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <img src={session.avatar} alt={session.mentor} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-medium">{session.title}</p>
                                        <p className="text-sm text-gray-500">with {session.mentor}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">{session.time}</p>
                                    <button className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded hover:bg-indigo-700">
                                        Join Session
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-4">Your Learning Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        {[
                            { label: "Hours Learned", value: "48.5 hours" },
                            { label: "Courses Completed", value: "12 courses" },
                            { label: "Certificates Earned", value: "8 certificates" },
                            { label: "Avg. Study Time", value: "2.5 hours/day" },
                        ].map((stat, idx) => (
                            <div key={idx} className="p-4 rounded-lg shadow-sm">
                                <p className="text-xl font-bold">{stat.value}</p>
                                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default React.memo(LearningDashboard)
