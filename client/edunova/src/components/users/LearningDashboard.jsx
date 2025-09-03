import React, { useContext, useEffect, useState } from "react";
import { Clock, Users, Award, TrendingUp, Play, Calendar, Star, ChevronRight } from 'lucide-react';
import UserContext from "../../userContext";
import { Link } from "react-router-dom";
import axios from "axios";

const LearningDashboard = () => {
  const [visibleCourses, setVisibleCourses] = useState(3);
  const [activeTab, setActiveTab] = useState('all');
  const [coursesData, setCoursesData] = useState([])
  const [mentorshipData, setMentorshipData] = useState([])

  const { user } = useContext(UserContext);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/admin/userById/${user?._id}`, { withCredentials: true })
      .then((res) => setCoursesData(res?.data?.data?.enrolledCourses || []))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/getUserAllMentorship`, { withCredentials: true })
      .then((res) => setMentorshipData(res?.data?.data))
      .catch(err => console.log(err))
  }, [])


  console.log("mentorshipData", mentorshipData)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="px-6 md:px-12 py-8 space-y-10 max-w-7xl mx-auto">

        {/* Enhanced Header with Quick Actions */}
        <div className="relative">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-font-sans font-bold text-gray-900">
                    Welcome back, {user.name}
                  </h1>
                  <p className="text-gray-600 text-lg flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Thursday, July 25, 2025 • Keep learning!
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 shadow-sm">
                <Calendar size={16} />
                <span className="text-sm font-medium">Schedule</span>
              </button>
              <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-lg">
                <Play size={16} />
                <span className="text-sm font-medium">Continue Learning</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Courses Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Your Courses</h2>
          </div>

          {console.log(coursesData)}

          {coursesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.slice(0, visibleCourses).map((course, idx) => (
                <Link to={`/learningDashboard/courseWatching/${course.course?._id}`}>
                  <article
                    key={idx}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={course?.course?.thumbnail} alt={course?.course?.title} />
                    </div>

                    <div className="p-6 space-y-4">
                      <h3>{course?.course?.title}</h3>

                      <div className="flex items-center gap-3 pt-2">

                        <Play size={16} /> Continue


                        <ChevronRight size={16} />

                      </div>
                    </div>
                  </article>

                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-300 rounded-2xl p-10 shadow-sm">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No Courses"
                className="w-28 h-28 mb-4 opacity-80"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courses Found</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                You haven't enrolled in any courses yet. Start your learning journey now and grow your skills!
              </p>
              <Link
                to="/courses"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </section>


        {/* Enhanced Mentor Sessions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Upcoming Mentor Sessions</h2>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mentorshipData.map((session, idx) => (
              <div
                key={idx}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <img
                        src={session.instructorId?.avatar}
                        alt={session.instructorId?.name}
                        className="w-14 h-14 rounded-full ring-2 ring-gray-100 group-hover:ring-emerald-200 transition-all duration-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700`}>
                          upcomming
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {session?.programName}
                      </h4>

                      <p className="text-gray-600">with <span className="font-medium">{session.instructorId?.name}</span></p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {session?.selectedTimes
                              ? new Date(session.selectedTimes).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                              : "No date selected"}
                          </span>

                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 shrink-0">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Statistics */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Learning Analytics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Hours Learned",
                value: "48.5",
                unit: "hours",
                change: "+12%",
                trend: "up",
                icon: Clock,
                color: "blue"
              },
              {
                label: "Courses Completed",
                value: "12",
                unit: "courses",
                change: "+3",
                trend: "up",
                icon: Award,
                color: "emerald"
              },
              {
                label: "Certificates Earned",
                value: "8",
                unit: "certificates",
                change: "+2",
                trend: "up",
                icon: Star,
                color: "purple"
              },
              {
                label: "Study Streak",
                value: "15",
                unit: "days",
                change: "+5",
                trend: "up",
                icon: TrendingUp,
                color: "orange"
              },
            ].map((stat, idx) => {
              const IconComponent = stat.icon;
              const colorClasses = {
                blue: "from-blue-500 to-blue-600",
                emerald: "from-emerald-500 to-emerald-600",
                purple: "from-purple-500 to-purple-600",
                orange: "from-orange-500 to-orange-600"
              };

              return (
                <div
                  key={idx}
                  className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[stat.color]} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent size={24} className="text-white" />
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {stat.change}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.unit}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Enhanced Action Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-teal-600/80"></div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-serif font-bold">Ready to learn something new?</h3>
            <p className="text-emerald-100 max-w-md mx-auto">
              Discover our curated collection of courses designed to help you grow your skills and advance your career.
            </p>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg">
              <Link to={"/courses"}>
                Explore More Courses
              </Link>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LearningDashboard);