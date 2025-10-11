import React, { useContext, useEffect, useState } from "react";
import {
  Clock, Users, Award, TrendingUp, Play, Calendar, Star, ChevronRight,
  BookOpen, Target, Zap, ArrowRight, CheckCircle,
  Video, Trophy, Flame, Search
} from 'lucide-react';
import UserContext from "../../userContext";
import { Link } from "react-router-dom";
import axios from "axios";

const LearningDashboard = () => {
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [activeTab, setActiveTab] = useState('all');
  const [coursesData, setCoursesData] = useState([]);
  const [mentorshipData, setMentorshipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/userById/${user?._id}`, { withCredentials: true })
      .then((res) => {
        setCoursesData(res?.data?.data?.enrolledCourses || []);
        setLoading(false);
      })
      .catch(err => {

        setLoading(false);
      });
  }, [user?._id]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/getUserAllMentorship`, { withCredentials: true })
      .then((res) => setMentorshipData(res?.data?.data || []))
      .catch(err => { });
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-xl p-6 border border-gray-200">
      <div className="space-y-4">
        <div className="bg-gray-200 rounded-lg h-40 w-full"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const calculateProgress = (course) => {
    return Math.floor(Math.random() * 100);
  };

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course?.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const progress = calculateProgress(course);

    switch (activeTab) {
      case 'in-progress':
        return matchesSearch && progress > 0 && progress < 100;
      case 'completed':
        return matchesSearch && progress === 100;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Learner'}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Ready to continue your learning journey?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="flex justify-center items-center gap-2 w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors text-sm sm:text-base">
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
              <Link to={'/learningDashboard/courses'} className="w-full sm:w-auto">
                <button className="flex justify-center items-center gap-2 w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base">
                  <Play className="w-4 h-4" />
                  Continue Learning
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                Your Courses
              </h2>
              <p className="text-gray-600 mt-1">Continue your learning journey</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.slice(0, visibleCourses).map((course, idx) => {
                const progress = calculateProgress(course);
                return (
                  <Link to={`/learningDashboard/courseWatching/${course.course?._id}`} key={idx}>
                    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                        <img
                          src={course?.course?.thumbnail}
                          alt={course?.course?.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                            <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        {/* Title */}
                        <h3 className="font-semibold text-lg text-gray-900 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {course?.course?.title}
                        </h3>

                        {/* Button */}
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                          {progress > 0 ? "Continue" : "Start"} Learning
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Start Your Learning Journey</h3>
                <p className="text-gray-600">Discover courses that will help you grow your skills and advance your career.</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Load More */}
          {filteredCourses.length > visibleCourses && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleCourses(prev => prev + 6)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Load More Courses
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* Mentor Sessions */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                Upcoming Sessions
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Connect with expert mentors</p>
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 self-start sm:self-auto">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {mentorshipData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mentorshipData.slice(0, 3).map((session, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative shrink-0">
                        <img
                          src={session.instructorId?.avatar || "https://via.placeholder.com/150"}
                          alt={session.instructorId?.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-200 object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>

                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700">
                            Upcoming
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
                            1-on-1
                          </span>
                        </div>

                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {session?.programName}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          with {session.instructorId?.name}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {session?.selectedTimes
                                ? new Date(session.selectedTimes).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })
                                : "Schedule pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>45 min</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/learningDashboard/mentorshipVideoSection/${session._id}/${session?.instructorId?._id}`}
                    >
                      <button className="w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                        Join
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-xl p-6 sm:p-8 text-center border border-emerald-100">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Schedule a mentorship session to get personalized guidance
              </p>
              <Link to={"/findMentor"}>
                <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Browse Mentors
                </button>
              </Link>
            </div>
          )}
        </section>


        {/* CTA Section */}
        <div className="bg-emerald-600 rounded-xl p-8 lg:p-12 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4" />
              Accelerate Your Learning
            </div>

            <h3 className="text-3xl md:text-4xl font-bold">Ready to take your skills to the next level?</h3>

            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Join thousands of learners who are advancing their careers with our expert-led courses and personalized mentorship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                to="/courses"
                className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={'/findMentor'}>
                <button className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors">
                  <Calendar className="w-4 h-4" />
                  Schedule Mentorship
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default React.memo(LearningDashboard);