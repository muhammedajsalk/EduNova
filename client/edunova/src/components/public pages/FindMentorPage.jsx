import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Star,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Award,
  Users,
  TrendingUp,
  Calendar,
  Globe,
  DollarSign,
  X,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const MENTORS_PER_PAGE = 6;

const FindMentorPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [mentorsData, setMentorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = { role: "user" };

  const expertiseCategories = [
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Mobile Development",
    "Cloud Computing",
    "Machine Learning",
    "Digital Marketing",
    "Business Strategy",
  ];

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/public/allMentorShip`)
      .then((res) => {
        setMentorsData(res.data?.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch mentors:", err);
        setMentorsData([]);
        setIsLoading(false);
      });
  }, []);

  const filteredMentors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = mentorsData.filter((mentor) => {
      const matchesSearch =
        !query ||
        mentor.instructorName?.toLowerCase().includes(query) ||
        mentor.profession?.toLowerCase().includes(query) ||
        mentor.programName?.toLowerCase().includes(query);

      const matchesPrice =
        mentor.amount >= priceRange[0] && mentor.amount <= priceRange[1];

      const matchesExpertise =
        selectedExpertise.length === 0 ||
        selectedExpertise.some(exp => 
          mentor.profession?.toLowerCase().includes(exp.toLowerCase()) ||
          mentor.programName?.toLowerCase().includes(exp.toLowerCase())
        );

      return matchesSearch && matchesPrice && matchesExpertise;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "price-low") return a.amount - b.amount;
      if (sortBy === "price-high") return b.amount - a.amount;
      if (sortBy === "rating") return (b.instructorRating || 0) - (a.instructorRating || 0);
      return 0;
    });
  }, [searchQuery, priceRange, sortBy, mentorsData, selectedExpertise]);

  const totalPages = Math.max(1, Math.ceil(filteredMentors.length / MENTORS_PER_PAGE));
  const currentSafePage = Math.min(currentPage, totalPages);
  const startIndex = (currentSafePage - 1) * MENTORS_PER_PAGE;
  const paginatedMentors = filteredMentors.slice(
    startIndex,
    startIndex + MENTORS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpertise = (expertise) => {
    setSelectedExpertise(prev =>
      prev.includes(expertise)
        ? prev.filter(e => e !== expertise)
        : [...prev, expertise]
    );
    setCurrentPage(1);
  };

  const renderStars = (rating) => {
    const ratingValue = Number(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < ratingValue
                ? "text-yellow-400 fill-current"
                : "text-gray-200"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({ratingValue.toFixed(1)})</span>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentSafePage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentSafePage - 1)}
          disabled={currentSafePage === 1}
          className="p-2 rounded-xl text-gray-600 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 rounded-xl font-medium bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200 transition-all"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}
        
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-xl font-medium transition-all ${
              page === currentSafePage
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-110"
                : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 rounded-xl font-medium bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentSafePage + 1)}
          disabled={currentSafePage === totalPages}
          className="p-2 rounded-xl text-gray-600 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Connect with Industry Experts</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Mentor Match
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto">
              Get personalized guidance from experienced professionals who've been where you want to go
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, expertise, or skills..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-14 pr-6 py-5 text-gray-900 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 text-lg placeholder:text-gray-400 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Search
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
              {[
                { icon: Users, label: "500+ Mentors", value: "Active" },
                { icon: Globe, label: "50+ Countries", value: "Global" },
                { icon: Award, label: "95% Success", value: "Rate" },
                { icon: TrendingUp, label: "10K+ Sessions", value: "Completed" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <stat.icon className="w-6 h-6 mb-2 text-yellow-300" />
                  <div className="text-sm opacity-90">{stat.label}</div>
                  <div className="text-xs opacity-75">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  showFilters 
                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {(selectedExpertise.length > 0 || priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {selectedExpertise.length + (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0)}
                  </span>
                )}
              </button>
              
              <div className="h-8 w-px bg-gray-200"></div>
              
              <p className="text-gray-600 font-medium">
                <span className="text-2xl font-bold text-gray-900">{filteredMentors.length}</span> mentors available
              </p>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="rating">⭐ Highest Rated</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💰 Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">

              {/* Price Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Price Range
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ₹{priceRange[0]} - ₹{priceRange[1]}/hour
                    </span>
                  </h4>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        min="0"
                        placeholder="Min"
                      />
                    </div>
                    <span className="text-gray-400 self-center">—</span>
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value) || 0])
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        min="0"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Availability</h4>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Mentors</option>
                    <option value="available">Available Now</option>
                    <option value="this-week">This Week</option>
                    <option value="weekends">Weekends Only</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setPriceRange([0, 100000]);
                      setSelectedExpertise([]);
                      setSelectedAvailability("all");
                      setCurrentPage(1);
                    }}
                    className="px-6 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mentors Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : paginatedMentors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedMentors.map((mentor, index) => (
                <div
                  key={mentor._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Mentor Header */}
                  <div className="relative p-6 pb-0">
                    {/* Top Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      {mentor.instructorRating >= 4.5 && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                          ⭐ Top Rated
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={mentor.instructorImage}
                          alt={mentor.instructorName}
                          className="w-20 h-20 rounded-2xl object-cover border-3 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {mentor.instructorName}
                        </h3>
                        <p className="text-emerald-600 font-semibold text-sm mb-2">
                          {mentor.profession}
                        </p>
                        {renderStars(mentor.instructorRating)}
                      </div>
                    </div>

                    {/* Program Badge */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        <Award className="w-3 h-3" />
                        {mentor.programName}
                      </span>
                    </div>
                  </div>

                  {/* Mentor Details */}
                  <div className="p-6 pt-0">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          Time Slots
                        </span>
                        <span className="font-semibold text-gray-900">
                          {mentor.time?.length || 0} Available
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          Sessions
                        </span>
                        <span className="font-semibold text-gray-900">
                          {Math.floor(Math.random() * 500) + 100}+ Completed
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          Language
                        </span>
                        <span className="font-semibold text-gray-900">
                          English, Hindi
                        </span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <span className="text-gray-500 text-xs">Starting from</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">
                              ₹{mentor.amount}
                            </span>
                            <span className="text-gray-500 text-sm">/hour</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </div>
                      </div>

                      {user?.role === "user" && (
                        <Link to={`/findMentor/mentorsDetails/${mentor._id}`}>
                          <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all group">
                            <span className="flex items-center justify-center gap-2">
                              Book Session
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && renderPagination()}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No mentors found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any mentors matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setPriceRange([0, 100000]);
                setSelectedExpertise([]);
                setCurrentPage(1);
              }}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(FindMentorPage)