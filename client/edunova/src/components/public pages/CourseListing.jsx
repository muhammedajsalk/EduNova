import React, { useState, useEffect, useContext } from "react";
import Footer from "./homePage Components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import UserContext from "../../userContext";
import { 
  Search, Filter, ChevronRight, ChevronLeft, Star, Clock, 
  Users, BookOpen, Award, TrendingUp, X, Menu, 
  Grid, List, Heart, ShoppingCart, PlayCircle,
  CheckCircle, Sparkles, ArrowUpRight,User
} from 'lucide-react';

function CourseListing() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  
  const { user } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/admin/allCourses")
      .then((res) => {
        setCourseData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: "all", name: "All Categories", icon: Grid, count: courseData.length },
    { id: "web", name: "Web Development", icon: BookOpen, count: 45 },
    { id: "data", name: "Data Science", icon: TrendingUp, count: 32 },
    { id: "design", name: "UX/UI Design", icon: Award, count: 28 },
    { id: "mobile", name: "Mobile Development", icon: Users, count: 18 },
  ];

  const priceFilters = [
    { id: "all", name: "All Prices" },
    { id: "free", name: "Free" },
    { id: "paid", name: "Paid" },
  ];

  const filteredCourses = courseData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const coursesPerPage = 6;
  const indexOfLast = currentPage * coursesPerPage;
  const indexOfFirst = indexOfLast - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  const toggleFavorite = (courseId) => {
    setFavorites(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowFilters(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-2xl h-48 w-full mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative px-4 py-8 max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-emerald-700 font-semibold text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Discover Your Next Skill</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent mb-4">
                Explore Our Courses
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Choose from {courseData.length}+ courses and start your learning journey today
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-emerald-100 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid" 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list" 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  {showFilters ? "Close" : "Filters"}
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span><strong>{filteredCourses.length}</strong> courses found</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span><strong>50K+</strong> students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span><strong>4.8</strong> average rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className={`${
              showFilters ? "block" : "hidden md:block"
            } md:col-span-1`}>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-emerald-100 p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-600" />
                  Filters
                </h3>

                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                            selectedCategory === category.id
                              ? "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {category.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Price</h4>
                  <div className="space-y-2">
                    {priceFilters.map((filter) => (
                      <label
                        key={filter.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="price"
                          value={filter.id}
                          checked={priceRange === filter.id}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition-colors">
                          {filter.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Rating</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition-colors">
                            {rating} & above
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange("all");
                    setSearchTerm("");
                  }}
                  className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            <section className="md:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : currentCourses.length > 0 ? (
                <div className={`grid ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                } gap-6`}>
                  {currentCourses.map((course, index) => (
                    <div
                      key={index}
                      className={`group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 ${
                        viewMode === "list" ? "flex gap-6" : ""
                      }`}
                    >
                      <div className={`relative overflow-hidden ${
                        viewMode === "list" ? "w-64 h-48" : "aspect-video"
                      }`}>
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => toggleFavorite(course._id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                favorites.includes(course._id) 
                                  ? "text-red-500 fill-current" 
                                  : "text-gray-600"
                              }`} 
                            />
                          </button>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500">
                            <PlayCircle className="w-8 h-8 text-emerald-600" />
                          </div>
                        </div>

                        {course.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            {course.category || "Development"}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>6h 30m</span>
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {course.title}
                        </h4>

                        <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {course.instructorId?.name || "Expert Instructor"}
                        </p>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-700">4.5</span>
                            <span className="text-xs text-gray-500">(2.3k)</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>12,543 students</span>
                          </div>
                        </div>

                        {user?.enrolledCourses?.includes(course._id) && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold text-emerald-600">60%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            {course.price ? (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                                {course.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-2xl font-bold text-emerald-600">Free</span>
                            )}
                          </div>
                          
                          <Link to={`/courseEntrollSection/${course._id}`}>
                            <button className="group/btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                              {user?.enrolledCourses?.includes(course._id) ? (
                                <>
                                  Continue
                                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </>
                              ) : (
                                <>
                                  {user?.role === "user" ? "Enroll Now" : "View Course"}
                                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                              )}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchTerm("");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = currentPage === pageNum;
                      const isNearCurrent = Math.abs(currentPage - pageNum) <= 2;
                      
                      if (!isNearCurrent && pageNum !== 1 && pageNum !== totalPages) {
                        if (pageNum === 2 || pageNum === totalPages - 1) {
                          return <span key={i} className="px-2 text-gray-400">...</span>;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      <Footer />
    </>
  );
}

export default React.memo(CourseListing);