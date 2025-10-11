import axios from "axios";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  BookOpen,
  Users,
  Clock,
  Star,
  Eye,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/instructor/course/courseByInstructorId`;

const COURSES_PER_PAGE_GRID = 9;
const COURSES_PER_PAGE_LIST = 6;

const CourseGrid = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const [currentPage, setCurrentPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_ENDPOINT, { withCredentials: true });
        setCourses(res.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch courses:");
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(courses.map(c => c.category))];
    return ["All", ...unique];
  }, [courses]);

  const levels = useMemo(() => {
    const unique = [...new Set(courses.map(c => c.level))];
    return ["All", ...unique];
  }, [courses]);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
      const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":
          return (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

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
  }, [searchTerm, selectedCategory, selectedLevel, sortBy, viewMode]);


  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLevel("All");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const FilterSidebar = () => (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${showFilters ? "block" : "hidden lg:block"}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      </div>

      <fieldset className="mb-6">
        <legend className="block text-sm font-medium text-gray-700 mb-3">Category</legend>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={e => setSelectedCategory(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="block text-sm font-medium text-gray-700 mb-3">Level</legend>
        <div className="space-y-2">
          {levels.map(level => (
            <label key={level} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="level"
                value={level}
                checked={selectedLevel === level}
                onChange={e => setSelectedLevel(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">{level}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );

  const CourseCard = ({ course, isListView = false }) => (
  <div
    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
      isListView ? "flex" : ""
    }`}
  >
    <div className={`relative ${isListView ? "w-80 flex-shrink-0" : "aspect-video"}`}>
      <img
        src={course.thumbnail}
        alt={course.title}
        className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
          isListView ? "h-full" : "h-48"
        }`}
        loading="lazy"
        onError={e => (e.target.src = "https://via.placeholder.com/400x250?text=Image+Not+Found")}
      />
    </div>

    <div className={`p-6 ${isListView ? "flex-1" : ""}`}>
      {/* Category and Status */}
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-indigo-600" />
        <span className="text-sm text-indigo-600 font-medium">{course.category}</span>
        {course.status && (
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              course.status === "approved"
                ? "bg-green-100 text-green-800"
                : course.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {course.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {course.students?.length} students
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(course.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Add extra actions here if needed */}
        </div>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          aria-label={`View course ${course.title}`}
        >
          <Eye className="w-4 h-4" />
          <Link to={`/instructorDashBoard/CourseView/${course._id}`}>View Course</Link>
        </button>
      </div>
    </div>
  </div>
);


  const Pagination = () => {
    const { totalPages } = paginationData;
    if (totalPages <= 1) return null;

    const getVisiblePages = useMemo(() => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
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

      return rangeWithDots;
    }, [currentPage, totalPages]);

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

        {getVisiblePages.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={`page_${page}`}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
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
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Search courses"
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Sort courses"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


          <main className="lg:col-span-3">
            {paginationData.currentCourses.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={resetFilters}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
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
                  {paginationData.currentCourses.map(course => (
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
    </div>
  );
};

export default React.memo(CourseGrid);
