import React, { useContext, useState } from "react";
import { Clock, Users, Award, TrendingUp, Play, Calendar, Star, ChevronRight } from 'lucide-react';
import UserContext from "../../userContext";
import { Link } from "react-router-dom";

const LearningDashboard = () => {
  const [visibleCourses, setVisibleCourses] = useState(3);
  const [activeTab, setActiveTab] = useState('all');

  const allCourses = [
    {
      title: "UI/UX Design Fundamentals",
      progress: 75,
      time: "2.5 hours left",
      image: "https://media.istockphoto.com/id/1075599562/photo/programmer-working-with-program-code.jpg?s=612x612&w=0&k=20&c=n3Vw5SMbMCWW1YGG6lnTfrwndNQ8B_R4Vw-BN7LkqpA=",
      level: "Intermediate",
      rating: 4.8,
      students: "2.3k"
    },
    {
      title: "Web Development Bootcamp",
      progress: 45,
      time: "6 hours left",
      image: "https://media.istockphoto.com/id/1451456915/photo/female-freelance-developer-coding-and-programming-coding-on-two-with-screens-with-code.jpg?s=612x612&w=0&k=20&c=BFFIc-xOwzeRyR8ui9VkFKEqqqQFBbISJzr-ADN6hS8=",
      level: "Advanced",
      rating: 4.9,
      students: "5.1k"
    },
    {
      title: "Digital Marketing Essentials",
      progress: 30,
      time: "8 hours left",
      image: "https://media.istockphoto.com/id/1265038430/photo/website-designer-creative-planning-phone-app-development-template-layout-framework-wireframe.jpg?s=612x612&w=0&k=20&c=sgKiBYMwfcdw7W4q4lLxwqpm4PovVLZ9CE7wCLbBWHk=",
      level: "Beginner",
      rating: 4.7,
      students: "1.8k"
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Courses', count: 3 },
    { id: 'inprogress', label: 'In Progress', count: 2 },
    { id: 'completed', label: 'Completed', count: 1 }
  ];

   const { user } = useContext(UserContext);

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
          
          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">75%</p>
                  <p className="text-sm text-gray-600">Week Progress</p>
                </div>
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} className="text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Active Courses</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play size={16} className="text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">12h</p>
                  <p className="text-sm text-gray-600">This Week</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock size={16} className="text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-gray-600">Certificates</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award size={16} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Courses Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Your Courses</h2>
            
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.slice(0, visibleCourses).map((course, idx) => (
              <article 
                key={idx} 
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Multiple badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                      {course.progress}% Complete
                    </div>
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                      <Play size={24} className="text-emerald-600 ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-xl text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    {/* Course meta info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="font-bold text-emerald-600">{course.progress}%</span>
                    </div>
                    <div className="relative w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 relative"
                        style={{ width: `${course.progress}%` }}
                      >
                        <div className="absolute right-0 top-0 w-1 h-full bg-white/30"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2">
                      <Play size={16} />
                      Continue
                    </button>
                    <button className="p-3 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors duration-200">
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
            {[
              {
                title: "UI Design Portfolio Review",
                mentor: "Alex Thompson",
                time: "Today, 2:00 PM",
                avatar: "https://i.pravatar.cc/40",
                topic: "Portfolio Review",
                duration: "45 min",
                status: "upcoming"
              },
              {
                title: "JavaScript Best Practices",
                mentor: "Sarah Chen",
                time: "Tomorrow, 10:00 AM",
                avatar: "https://i.pravatar.cc/41",
                topic: "Code Review",
                duration: "60 min",
                status: "scheduled"
              },
            ].map((session, idx) => (
              <div
                key={idx}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <img 
                        src={session.avatar} 
                        alt={session.mentor} 
                        className="w-14 h-14 rounded-full ring-2 ring-gray-100 group-hover:ring-emerald-200 transition-all duration-200" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'upcoming' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {session.status}
                        </span>
                        <span className="text-xs text-gray-500">{session.duration}</span>
                      </div>
                      
                      <h4 className="font-serif font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {session.title}
                      </h4>
                      
                      <p className="text-gray-600">with <span className="font-medium">{session.mentor}</span></p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{session.topic}</span>
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
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
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