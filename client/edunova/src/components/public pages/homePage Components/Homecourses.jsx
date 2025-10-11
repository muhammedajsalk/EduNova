import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

function HomeCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/public/topRatedCourse`)
      .then((res) => setCourses(res.data.data || []))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <section className="bg-white py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">
        Top-Rated Courses
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, idx) => {
          const maxPossibleScore = 100;
          const rating = Math.min(5, (course.score / maxPossibleScore) * 5);

          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.jpg"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {course.instructorName || "Unknown Instructor"}
                </p>

                <div className="flex items-center space-x-1 text-yellow-400 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(rating) ? "fill-current" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-gray-700 ml-1 text-sm">
                    {rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-emerald-700 transition">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default React.memo(HomeCourses);
