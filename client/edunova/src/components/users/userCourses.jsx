import axios from "axios";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import {
  Search,
  Grid,
  List,
  BookOpen,
  Eye,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import UserContext from "../../userContext";

const COURSES_PER_PAGE_GRID = 9;
const COURSES_PER_PAGE_LIST = 6;

const UserCourseGrid = () => {
  const { user } = useContext(UserContext);

  const API_ENDPOINT = useMemo(
    () => `http://localhost:5000/api/admin/userById/${user?._id}`,
    [user?._id]
  );

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [viewMode, setViewMode] = useState("grid");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user?._id) return;
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_ENDPOINT, { withCredentials: true });
        setCourses(res?.data?.data?.enrolledCourses || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch courses:");
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [API_ENDPOINT, user?._id]);

  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter(({ course }) => {
      if (!course) return false;
      const { title = "", description = "" } = course;

      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    filtered.sort((a, b) => {
      const aCourse = a.course || {};
      const bCourse = b.course || {};
      switch (sortBy) {
        case "newest":
          return new Date(bCourse.createdAt) - new Date(aCourse.createdAt);
        case "oldest":
          return new Date(aCourse.createdAt) - new Date(bCourse.createdAt);
        case "popular":
          return (bCourse.studentsEnrolled || 0) - (aCourse.studentsEnrolled || 0);
        case "rating":
          return (bCourse.rating || 0) - (aCourse.rating || 0);
        case "price-low":
          return (aCourse.price || 0) - (bCourse.price || 0);
        case "price-high":
          return (bCourse.price || 0) - (aCourse.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, sortBy]);

  const coursesPerPage = viewMode === "grid" ? COURSES_PER_PAGE_GRID : COURSES_PER_PAGE_LIST;

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredAndSortedCourses.length / coursesPerPage);
    const idxLast = currentPage * coursesPerPage;
    const idxFirst = idxLast - coursesPerPage;
    const currentCourses = filteredAndSortedCourses.slice(idxFirst, idxLast);
    return { currentCourses, totalPages };
  }, [filteredAndSortedCourses, currentPage, coursesPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, viewMode]);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= paginationData.totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [paginationData.totalPages]
  );

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSortBy("newest");
    setCurrentPage(1);
  }, []);

  const CourseCard = useCallback(
  ({ course, isListView = false }) => {
    const c = course.course || {};

    return (
      <div
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
          isListView ? "flex flex-col sm:flex-row gap-4" : ""
        }`}
      >
        <div
          className={`relative ${
            isListView
              ? "w-full sm:w-80 flex-shrink-0 h-48 sm:h-48"
              : "w-full h-48 sm:h-56"
          }`}
        >
          <img
            src={c.thumbnail}
            alt={c.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 rounded-t-lg sm:rounded-l-lg sm:rounded-r-none"
            loading="lazy"
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/400x250?text=Image+Not+Found")
            }
          />
        </div>

        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-sm sm:text-base text-emerald-600 font-medium">
                {c.category}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
              {c.title}
            </h3>

            <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
              {c.description}
            </p>

            <div className="flex items-center gap-4 mb-4 text-sm sm:text-base text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {course.courseStartDate
                    ? new Date(course.courseStartDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <Link to={`/learningDashboard/courseWatching/${c._id}`}>
              <button
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                aria-label={`View course ${c.title}`}
              >
                <Eye className="w-4 h-4" />
                View Course
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  },
  []
);


  const Pagination = () => {
    const { totalPages } = paginationData;
    if (totalPages <= 1) return null;

    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return (
      <div className="flex justify-center items-center mt-12 space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>

        {rangeWithDots.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={`page_${page}`}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ) : (
            <span key={`dots_${index}`} className="px-2 text-gray-500 select-none">
              {page}
            </span>
          )
        )}

        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
              <p className="text-gray-600">
                Discover and manage your course collection • {filteredAndSortedCourses.length}{" "}
                course{filteredAndSortedCourses.length !== 1 && "s"} found
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                aria-label="Search courses"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              aria-label="Sort courses"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div
              className="flex items-center gap-2 bg-gray-100 rounded-lg p-1"
              role="group"
              aria-label="Toggle course view mode"
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
                aria-pressed={viewMode === "grid"}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
                aria-pressed={viewMode === "list"}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <main>
          {paginationData.currentCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or sort criteria</p>
              <button
                onClick={resetFilters}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
                aria-label="Clear Filters"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }`}
              >
                {paginationData.currentCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isListView={viewMode === "list"}
                  />
                ))}
              </div>

              <Pagination />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(UserCourseGrid);
