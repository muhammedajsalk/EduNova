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
    axios.get(`http://localhost:5000/api/admin/userById/${user?._id}`, { withCredentials: true })
      .then((res) => {
        setCoursesData(res?.data?.data?.enrolledCourses || []);
        setLoading(false);
      })
      .catch(err => {
        
        setLoading(false);
      });
  }, [user?._id]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/getUserAllMentorship`, { withCredentials: true })
      .then((res) => setMentorshipData(res?.data?.data || []))
      .catch(err => {});
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

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name || 'Learner'}
                </h1>
                <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Flame, value: "15", label: "Day Streak", color: "bg-orange-100 text-orange-600" },
                  { icon: Trophy, value: "5", label: "Level", color: "bg-yellow-100 text-yellow-600" },
                  { icon: Target, value: "3", label: "Goals", color: "bg-emerald-100 text-emerald-600" },
                  { icon: Award, value: "12", label: "Certificates", color: "bg-blue-100 text-blue-600" },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors">
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Play className="w-4 h-4" />
                Continue Learning
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Today's Learning Goals
            </h3>
            <span className="text-sm text-gray-600">3 of 5 completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
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

              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                {['all', 'in-progress', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                  </button>
                ))}
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
                    <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      {/* Course Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${progress === 100
                            ? 'bg-emerald-100 text-emerald-700'
                            : progress > 0
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                          {progress === 100 ? 'Completed' : progress > 0 ? `${progress}% Complete` : 'New'}
                        </span>
                      </div>

                      {/* Course Thumbnail */}
                      <div className="relative aspect-[16/9] bg-gray-100">
                        <img
                          src={course?.course?.thumbnail}
                          alt={course?.course?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-emerald-600 ml-0.5" fill="currentColor" />
                          </div>
                        </div>

                        {/* Course Stats */}
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center gap-3 text-white text-sm">
                            <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                              <Video className="w-3 h-3" />
                              <span>12</span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                              <Clock className="w-3 h-3" />
                              <span>3h 45m</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        {/* Course Info */}
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">
                            Development
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">4.9</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {course?.course?.title}
                        </h3>

                        {/* Progress Bar */}
                        {progress > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-emerald-600 font-semibold">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <button className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-100 transition-colors">
                          {progress > 0 ? 'Continue' : 'Start'} Learning
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-6 h-6 text-emerald-600" />
                Upcoming Sessions
              </h2>
              <p className="text-gray-600 mt-1">Connect with expert mentors</p>
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {mentorshipData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mentorshipData.slice(0, 2).map((session, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative">
                        <img
                          src={session.instructorId?.avatar || "https://via.placeholder.com/150"}
                          alt={session.instructorId?.name}
                          className="w-12 h-12 rounded-full border-2 border-gray-200"
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

                        <h4 className="font-semibold text-gray-900">{session?.programName}</h4>
                        <p className="text-gray-600 text-sm">with {session.instructorId?.name}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
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

                    <Link to={`/learningDashboard/mentorshipVideoSection/${session._id}/${session?.instructorId?._id}`}>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                        Join
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-xl p-8 text-center border border-emerald-100">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
              <p className="text-gray-600 mb-4">Schedule a mentorship session to get personalized guidance</p>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Browse Mentors
              </button>
            </div>
          )}
        </section>

        {/* Statistics */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Learning Statistics
            </h2>
            <p className="text-gray-600 mt-1">Track your progress and achievements</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Study Time",
                value: "48.5",
                unit: "hours this month",
                change: "+12%",
                icon: Clock,
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                label: "Completed",
                value: "12",
                unit: "courses finished",
                change: "+3",
                icon: Award,
                color: "bg-blue-100 text-blue-600",
              },
              {
                label: "Certificates",
                value: "8",
                unit: "earned",
                change: "+2",
                icon: Star,
                color: "bg-purple-100 text-purple-600",
              },
              {
                label: "Study Streak",
                value: "15",
                unit: "days in a row",
                change: "+5",
                icon: Flame,
                color: "bg-orange-100 text-orange-600",
              },
            ].map((stat, idx) => {
              const IconComponent = stat.icon;

              return (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        {stat.change}
                      </span>
                    </div>

                    <div>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600 mt-1">{stat.unit}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-2">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
              <button className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors">
                <Calendar className="w-4 h-4" />
                Schedule Mentorship
              </button>
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