import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  User, Shield, Clipboard, CreditCard, Bell, Settings, TrendingUp, Eye, Heart, 
  Activity, Users, DollarSign, Award, AlertCircle, CheckCircle2, Clock, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter, Search
} from 'lucide-react';

import axios from 'axios'

const userData = [
  { name: 'Jan', value: 2.2, growth: 2.1 },
  { name: 'Feb', value: 2.3, growth: 2.2 },
  { name: 'Mar', value: 2.4, growth: 2.3 },
  { name: 'Apr', value: 2.41, growth: 2.35 },
];

const revenueData = [
  { name: 'Jan', value: 700000, target: 650000 },
  { name: 'Feb', value: 730000, target: 700000 },
  { name: 'Mar', value: 800000, target: 750000 },
  { name: 'Apr', value: 847293, target: 800000 },
];

const MetricCard = ({ title, value, change, changeType, icon: Icon, gradient, trend }) => (
  <div className={`group relative overflow-hidden rounded-3xl p-6 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 border-0 transform hover:-translate-y-1`}>
    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
          <Icon className="w-6 h-6 text-white drop-shadow-sm" />
        </div>
        <div className={`flex items-center text-xs font-bold px-3 py-1 rounded-full ${
          changeType === 'positive' 
            ? 'bg-emerald-500/20 text-emerald-700' 
            : 'bg-red-500/20 text-red-700'
        }`}>
          {changeType === 'positive' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="text-3xl font-bold text-white drop-shadow-sm">{value}</p>
        {trend && (
          <div className="flex items-center text-xs text-white/70">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
    </div>
  </div>
);

const ChartContainer = ({ title, subtitle, value, change, children, actions }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-start justify-between mb-6">
      <div className="space-y-1">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {actions && (
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">{subtitle}</p>
        {value && (
          <div className="flex items-baseline space-x-2 mt-3">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className={`text-sm font-semibold ${
              change?.startsWith('+') ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
    <div className="relative">
      {children}
    </div>
  </div>
);

const ModernWatchTable = ({ title, icon: Icon, data, columns, actions = true }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
    <div className="px-8 py-6 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Search className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            {columns.map((col, idx) => (
              <th key={idx} className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/50">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200 group">
              <td className="px-8 py-5 whitespace-nowrap">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {row.lectureTitle || row.title}
                </div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                {row.courseTitle || row.course}
              </td>
              <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                {row.instructorName || row.instructor}
              </td>
              <td className="px-8 py-5 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                  {row.totalWatchTime|| row.metric}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ModernLikeTable = ({ title, icon: Icon, data, columns, actions = true }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
    <div className="px-8 py-6 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Search className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            {columns.map((col, idx) => (
              <th key={idx} className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/50">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200 group">
              <td className="px-8 py-5 whitespace-nowrap">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {row.lectureTitle || row.title}
                </div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                {row.courseTitle || row.course}
              </td>
              <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                {row.instructorName || row.instructor}
              </td>
              <td className="px-8 py-5 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                  {row.like}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AlertItem = ({ type, message, time, status = 'active' }) => (
  <div className={`group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg ${
    type === 'critical' 
      ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:border-red-300' 
      : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300'
  }`}>
    <div className="flex items-start space-x-4">
      <div className={`p-2 rounded-xl ${
        type === 'critical' ? 'bg-red-100' : 'bg-amber-100'
      }`}>
        {type === 'critical' ? (
          <AlertCircle className={`w-5 h-5 ${type === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
        ) : (
          <Clock className="w-5 h-5 text-amber-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <p className="font-semibold text-gray-900 mb-1">{message}</p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            status === 'resolved' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {status === 'resolved' ? (
              <><CheckCircle2 className="w-3 h-3 mr-1" /> Resolved</>
            ) : (
              <>Active</>
            )}
          </span>
        </div>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${
      type === 'critical' ? 'from-red-400 to-red-600' : 'from-amber-400 to-orange-500'
    } transition-all duration-300 w-0 group-hover:w-full`} />
  </div>
);

function AdminDashboard() {
  const [topWatched, setTopWatched] = useState([]);
  const [topLiked, setTopLiked] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/topLectures")
    .then((res) => {
      setTopWatched(res.data.data[0]?.topWatched)
      setTopLiked(res.data.data[0]?.topLiked)
    })
    .catch((err) => console.log("Fetching issue"))
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-16">
      <main className="px-8 py-8 space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="User"
            value="48"
            change="+12%"
            changeType="positive"
            trend="vs last month"
            icon={Shield}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Content Reviews"
            value="156"
            change="+8%"
            changeType="positive"
            trend="vs last month"
            icon={Clipboard}
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          <MetricCard
            title="Instructor Applications"
            value="23"
            change="+15%"
            changeType="positive"
            trend="vs last month"
            icon={Users}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <MetricCard
            title="Payment Approvals"
            value="12"
            change="+23%"
            changeType="positive"
            trend="vs last month"
            icon={DollarSign}
            gradient="bg-gradient-to-br from-orange-500 to-red-600"
          />
        </section>
        <section className="grid lg:grid-cols-2 gap-8">
          <ChartContainer
            title="Monthly Active Users"
            subtitle="User engagement and growth metrics"
            value="2.41M"
            change="+12% vs last month"
            actions={true}
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={userData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(20px)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#userGradient)"
                  dot={{ fill: '#3B82F6', strokeWidth: 3, r: 5 }}
                  activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 3, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Monthly Revenue"
            subtitle="Revenue performance and targets"
            value="$847,293"
            change="+8.3% vs last month"
            actions={true}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData} barCategoryGap="20%">
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(20px)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#revenueGradient)" 
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="target" 
                  fill="#E5E7EB" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </section>
        <section className="grid lg:grid-cols-2 gap-8">
          <ModernWatchTable
            title="Top Watched Lectures"
            icon={Eye}
            data={topWatched}
            columns={['Lecture', 'Course', 'Instructor', 'Watch Time']}
          />
          <ModernLikeTable
            title="Top Liked Lectures"
            icon={Heart}
            data={topLiked}
            columns={['Lecture', 'Course', 'Instructor', 'Likes']}
          />
        </section>
        <section>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">System Health</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  System Operational
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-red-600 uppercase tracking-wide">Critical Alerts (2)</h4>
                  <span className="text-xs text-gray-500">Immediate attention required</span>
                </div>
                <div className="space-y-4">
                  <AlertItem
                    type="critical"
                    message="Database CPU Usage at 85%"
                    time="10 minutes ago"
                    status="active"
                  />
                  <AlertItem
                    type="critical"
                    message="API Response Time exceeding 2s"
                    time="25 minutes ago"
                    status="active"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wide">Warning Alerts (3)</h4>
                  <span className="text-xs text-gray-500">Monitor closely</span>
                </div>
                <div className="space-y-4">
                  <AlertItem
                    type="warning"
                    message="Storage Space 75% Full"
                    time="1 hour ago"
                    status="active"
                  />
                  <AlertItem
                    type="warning"
                    message="Cache Miss Rate Increased to 15%"
                    time="2 hours ago"
                    status="resolved"
                  />
                  <AlertItem
                    type="warning"
                    message="Background Job Processing Delays"
                    time="2 hours ago"
                    status="active"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default React.memo(AdminDashboard);