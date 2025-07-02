import React from "react";
import { Link, useNavigate } from "react-router-dom";
import InstructorNavbar from "../instructorNavbar";

const CoursePreview = () => {
  const sections = [
    { title: "Introduction to Web Development", lectures: 4, duration: "1.5 hours" },
    { title: "Frontend Development Fundamentals", lectures: 6, duration: "3 hours" },
    { title: "Backend Development with Node.js", lectures: 5, duration: "2.5 hours" },
    { title: "Database Management", lectures: 4, duration: "2 hours" },
    { title: "Advanced Concepts & Best Practices", lectures: 3, duration: "1.5 hours" },
    { title: "Project Implementation", lectures: 2, duration: "1.5 hours" },
  ];

  return (
    <>
    <InstructorNavbar/>
    <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-white shadow-md rounded-lg mt-20">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Course Preview</h2>
      <p className="text-gray-500 mb-6">Review your course information before publishing</p>

      {/* Thumbnail */}
      <div className="w-full h-56 sm:h-80 overflow-hidden rounded-lg mb-6">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          alt="Course"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Course Title & Tags */}
      <div className="mb-4">
        <h3 className="text-xl sm:text-2xl font-semibold">Advanced Web Development Masterclass</h3>
        <p className="text-gray-600 mt-2">
          Master modern web development with this comprehensive course. Learn advanced concepts,
          best practices, and real-world applications in web development.
        </p>
        <span className="inline-block mt-2 bg-indigo-100 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full">
          Web Development
        </span>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="text-center">
          <p className="text-indigo-600 font-bold">12 hours</p>
          <p className="text-sm text-gray-500">Total Duration</p>
        </div>
        <div className="text-center">
          <p className="text-indigo-600 font-bold">24 lectures</p>
          <p className="text-sm text-gray-500">Lectures</p>
        </div>
        <div className="text-center">
          <p className="text-indigo-600 font-bold">6 sections</p>
          <p className="text-sm text-gray-500">Sections</p>
        </div>
        <div className="text-center">
          <p className="text-indigo-600 font-bold">Intermediate</p>
          <p className="text-sm text-gray-500">Level</p>
        </div>
      </div>

      {/* Curriculum */}
      <h4 className="text-xl font-semibold mb-4">Course Curriculum</h4>
      <div className="divide-y shadow-md rounded-lg">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div>
              <p className="font-medium">Section {index + 1}: {section.title}</p>
            </div>
            <div className="text-sm text-gray-500">
              {section.lectures} lectures • {section.duration}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
          Edit Course
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Publish Course
        </button>
      </div>
    </div>
    </>
  );
};

export default CoursePreview;
