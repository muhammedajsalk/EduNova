import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Star,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
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
  const [mentorsData, setMentorsData] = useState([]);

  const user = { role: "user" };

  // Fetch mentors
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/public/allMentorShip")
      .then((res) => setMentorsData(res.data?.data || []))
      .catch((err) => {
        console.error("Failed to fetch mentors:", err);
        setMentorsData([]);
      });
  }, []);

  console.log("mentorData", mentorsData)

  // Filter & Sort
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

      return matchesSearch && matchesPrice;
    });

    // Immutable sort
    return [...result].sort((a, b) => {
      if (sortBy === "price") return a.amount - b.amount;
      return (b.instructorRating || 0) - (a.instructorRating || 0);
    });
  }, [searchQuery, priceRange, sortBy, mentorsData]);

  console.log("filteredData", filteredMentors)

  // Pagination
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

  const renderStars = (rating) => {
    const ratingValue = Number(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < ratingValue
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
          }`}
      />
    ));
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect Mentor
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connect with industry experts who can accelerate your career growth
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors by name, expertise, or program..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600 font-medium">
              {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""} found
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}/hour
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="0"
                    max="2000"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value) || 0])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="0"
                    max="2000"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setPriceRange([0, 2000]);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mentors Grid */}
        {paginatedMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedMentors.map((mentor) => (
              <div
                key={mentor._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-center mb-4">
                    <img
                      src={mentor.instructorImage}
                      alt={mentor.instructorName}
                      className="w-16 h-16 rounded-2xl object-cover mr-4 border-2 border-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{mentor.instructorName}</h3>
                      <p className="text-emerald-600 font-semibold text-sm">
                        {mentor.profession}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {mentor.programName}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">${mentor.amount}</span>
                        <span className="text-gray-500 text-sm ml-1">/hour</span>
                      </div>
                      <div className="flex items-center">{renderStars(mentor.instructorRating)}</div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Available Time Slot {mentor.time.length}</span>
                    </div>
                    {user?.role === "user" && (
                      <Link to={`/findMentor/mentorsDetails/${mentor._id}`}>
                        <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105">
                          Book Session
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No mentors found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setPriceRange([0, 2000]);
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentSafePage - 1)}
              disabled={currentSafePage === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 hover:text-emerald-600"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-medium ${page === currentSafePage
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentSafePage + 1)}
              disabled={currentSafePage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 hover:text-emerald-600"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMentorPage;
