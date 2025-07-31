import React, { useState, useEffect } from "react";
import Footer from "./homePage Components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import UserContext from "../../userContext";
import { useContext } from "react";

function CourseListing() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [courseData, setCourseData] = useState([])
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/allCourses")
      .then((res) => setCourseData(res.data.data))
      .catch((err) => console.log(err))
  }, [])


  const courses = courseData

  const coursesPerPage = 6;
  const indexOfLast = currentPage * coursesPerPage;
  const indexOfFirst = indexOfLast - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(courses.length / coursesPerPage);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowFilters(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Courses</h2>


          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {(showFilters || window.innerWidth >= 768) && (
              <aside className="bg-white p-6 rounded-lg shadow-md col-span-1">
                <h3 className="text-lg font-semibold mb-4">Filter by</h3>
                <ul className="space-y-3 text-gray-700 text-sm">
                  <li><label><input type="checkbox" className="mr-2" /> Web Development</label></li>
                  <li><label><input type="checkbox" className="mr-2" /> Data Science</label></li>
                  <li><label><input type="checkbox" className="mr-2" /> UX/UI Design</label></li>
                </ul>
              </aside>
            )}


            <section className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course,index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-contain rounded-md mb-4 bg-gray-100"
                  />
                  <h4 className="text-lg font-semibold mb-1">{course.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{course.instructorId?.name}</p>
                  <div className="flex items-center text-yellow-500 text-sm mb-2">
                    ⭐ 4.5
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="bg-emerald-600 text-white px-3 py-1 rounded text-sm">
                      <Link to={`/courseEntrollSection/${course._id}`}>
                        {user?.role==="user"?"Enroll":"View"}
                      </Link>
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>


          <div className="flex justify-center mt-10 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default React.memo(CourseListing)


