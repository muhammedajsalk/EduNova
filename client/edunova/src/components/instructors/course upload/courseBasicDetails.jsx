import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import InstructorNavbar from '../instructorNavbar';
import { Link, useNavigate } from "react-router-dom";

const CourseBasicsForm = () => {
  const [thumbnail, setThumbnail] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setThumbnail(file);
    }
  };

  return (
    <>
     <InstructorNavbar/>
     <div className="min-h-screen bg-gray-50 px-4 py-8 mt-12">
      <div className="w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2">Course Basics</h2>
        <p className="text-gray-600 mb-6">Add the fundamental information about your course</p>

        {/* Upload Thumbnail */}
        <div className="border border-dashed border-gray-300 p-6 rounded-md flex flex-col items-center justify-center mb-6 w-full">
          <label htmlFor="thumbnail" className="cursor-pointer text-center">
            <FaCloudUploadAlt className="inline-block mr-2 text-xl mb-1" />
            <p className="text-gray-700 font-medium">Upload Course Thumbnail</p>
            <p className="text-gray-500 text-sm">
              Recommended size: 1280×720px. Max file size: 10MB
            </p>
            <button className="mt-3 px-4 py-1 bg-gray-200 rounded text-sm">Choose File</button>
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Course Title */}
        <div className="mb-4 w-full">
          <label className="block font-medium text-gray-700 mb-1">Course Title</label>
          <input
            type="text"
            placeholder="Enter your course title"
            maxLength={60}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-sm text-gray-500 mt-1">Make it clear and compelling (60 characters max)</p>
        </div>

        {/* Course Description */}
        <div className="mb-4 w-full">
          <label className="block font-medium text-gray-700 mb-1">Course Description</label>
          <textarea
            rows="5"
            placeholder="Describe what students will learn in your course"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">Minimum 200 characters</p>
        </div>

        {/* Course Category */}
        <div className="mb-6 w-full">
          <label className="block font-medium text-gray-700 mb-1">Course Category</label>
          <input
            type="text"
            value="development"
            readOnly
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* Next Button */}
        <div className="text-right">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
            <Link to={'/instructor/Course_Upload/course_cariculam'}>
                Next: Curriculum →
            </Link>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseBasicsForm;
