import React from "react";
import { FaStar } from "react-icons/fa";

const courses = [
  {
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    rating: 4.8,
    duration: "20h",
    price: "$99.99",
    image: "https://media.istockphoto.com/id/1075599562/photo/programmer-working-with-program-code.jpg?s=612x612&w=0&k=20&c=n3Vw5SMbMCWW1YGG6lnTfrwndNQ8B_R4Vw-BN7LkqpA=", 
  },
  {
    title: "Data Science Fundamentals",
    instructor: "Michael Chen",
    rating: 4.9,
    duration: "15h",
    price: "$89.99",
    image: "https://media.istockphoto.com/id/1451456915/photo/female-freelance-developer-coding-and-programming-coding-on-two-with-screens-with-code.jpg?s=612x612&w=0&k=20&c=BFFIc-xOwzeRyR8ui9VkFKEqqqQFBbISJzr-ADN6hS8=",
  },
  {
    title: "UX/UI Design Masterclass",
    instructor: "Emma Davis",
    rating: 4.7,
    duration: "12h",
    price: "$79.99",
    image: "https://media.istockphoto.com/id/1265038430/photo/website-designer-creative-planning-phone-app-development-template-layout-framework-wireframe.jpg?s=612x612&w=0&k=20&c=sgKiBYMwfcdw7W4q4lLxwqpm4PovVLZ9CE7wCLbBWHk=",
  },
];

function HomeCourses() {
  return (
    <section className="bg-white py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">
        Top-Rated Courses
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {course.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{course.instructor}</p>

              <div className="flex items-center space-x-1 text-yellow-400 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className={i < Math.round(course.rating) ? "fill-current" : "text-gray-300"} />
                ))}
                <span className="text-gray-700 ml-1 text-sm">{course.rating}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-indigo-600 font-bold text-lg">{course.price}</span>
                <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default React.memo(HomeCourses)