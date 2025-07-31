import React, { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  DollarSign, 
  Users, 
  Eye, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Star, 
  MessageCircle, 
  Bell,
  Award,
  PlayCircle,
  Clock,
  Target,
  Zap,
  BarChart3,
  Activity,
  Globe,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import UserContext from '../../../userContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
  const [timeRange, setTimeRange] = useState('3months');
  const [data,setData]=useState([])
  const { user } = useContext(UserContext);

  useEffect(()=>{ 
      axios.get("http://localhost:5000/api/instructor/course/courseByInstructorId",{ withCredentials: true })
      .then((res)=>setData(res.data.data))
      .catch((err)=>console.log())
  },[])

  const stats = [
    {
      label: "Total Revenue",
      value: user.earnings,
      sub: "+15% from last month",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+15%",
      changeType: "positive"
    },
    {
      label: "Active Students",
      value: user.students,
      sub: "Current enrollments",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      change: "+23%",
      changeType: "positive"
    },
    {
      label: "Total Watch Time",
      value: user.watchingHours,
      sub: "Last 30 days",
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      change: "+8%",
      changeType: "positive"
    },
    {
      label: "Total Courses",
      value: data.length,
      sub: "Active courses",
      icon: BookOpen,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      change: "+2",
      changeType: "positive"
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 4200, students: 85 },
    { month: 'Feb', revenue: 5800, students: 92 },
    { month: 'Mar', revenue: 7200, students: 108 },
    { month: 'Apr', revenue: 6800, students: 98 },
    { month: 'May', revenue: 9200, students: 125 },
    { month: 'Jun', revenue: 12458, students: 145 },
  ];

  const topCourses = [
    { name: 'Advanced React Development', students: 324, revenue: '$4,850', growth: '+12%', rating: 4.9 },
    { name: 'Python for Beginners', students: 256, revenue: '$3,420', growth: '+8%', rating: 4.7 },
    { name: 'UI/UX Design Masterclass', students: 189, revenue: '$2,890', growth: '+15%', rating: 4.8 },
  ];

  const activities = [
    {
      message: 'New enrollment in "Advanced Web Development"',
      time: "2 hours ago",
      type: "enrollment",
      icon: Users,
      color: "text-blue-500"
    },
    {
      message: 'New comment on "Python Basics"',
      time: "4 hours ago",
      type: "comment",
      icon: MessageCircle,
      color: "text-green-500"
    },
    {
      message: 'Student completed "UI/UX Design Fundamentals"',
      time: "6 hours ago",
      type: "completion",
      icon: Award,
      color: "text-purple-500"
    },
    {
      message: 'Course "React Hooks" reached 1000 students',
      time: "1 day ago",
      type: "milestone",
      icon: Target,
      color: "text-orange-500"
    },
    {
      message: 'New 5-star review received',
      time: "2 days ago",
      type: "review",
      icon: Star,
      color: "text-yellow-500"
    }
  ];

  const StatCard = ({ stat }) => {
    
    const IconComponent = stat.icon;
    return (
      <div className="group bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className={`flex items-center text-xs font-medium ${
            stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {stat.change}
          </div>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {stat.value}
          </h3>
          <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
          <p className="text-gray-500 text-xs mt-1">{stat.sub}</p>
        </div>
      </div>
    );
  };

  

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back {user.name}, 
              </h1>
              <p className="text-gray-600 text-sm flex items-center mt-1">
                <Globe className="w-4 h-4 mr-1" />
                Here's what's happening with your courses
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300">
              <Link to={'/instructorDashboard/createCourse'}>
                  Create Course
              </Link>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Revenue Overview</h2>
                <p className="text-gray-600 text-sm">Track your earnings over time</p>
              </div>
              <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                {['1month', '3months', '6months'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeRange(period)}
                    className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${
                      timeRange === period
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {period === '1month' ? '1M' : period === '3months' ? '3M' : '6M'}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#revenueGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Courses */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Top Performing Courses</h2>
            <div className="space-y-3">
              {topCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{course.name}</h3>
                    <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {course.students}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {course.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-green-600 text-sm">{course.revenue}</span>
                      <span className="text-emerald-600 text-xs font-medium">{course.growth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <IconComponent className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions & Insights */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-300">
                <PlayCircle className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">Create Course</span>
              </button>
              <button className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-300">
                <BarChart3 className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">View Analytics</span>
              </button>
              <button className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:shadow-md transition-all duration-300">
                <MessageCircle className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">Messages</span>
              </button>
              <button className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-md transition-all duration-300">
                <Activity className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">Live Sessions</span>
              </button>
            </div>
            
            {/* Insights */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 text-indigo-600 mr-2" />
                <h3 className="font-semibold text-indigo-900 text-sm">Quick Insight</h3>
              </div>
              <p className="text-sm text-indigo-700 mb-2">
                Your courses are performing 23% better than last month! Consider creating similar content.
              </p>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View Detailed Report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(InstructorDashboard);