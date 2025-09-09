import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  User, Shield, Clipboard, CreditCard, Bell, Settings, TrendingUp, Eye, Heart, 
  Activity, Users, DollarSign, Award, AlertCircle, CheckCircle2, Clock, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter, Search, RefreshCw,
  Calendar, Download, Zap, Globe, Server, Database
} from 'lucide-react';
import axios from 'axios';

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

const MetricCard = ({ title, value, change, changeType, icon: Icon, gradient, trend, loading = false }) => (
  <div className={`group relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg hover:shadow-2xl transition-all duration-500 border-0 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer`}>
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-1000" />
    </div>
    
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-6">
        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          {loading ? (
            <div className="w-6 h-6 bg-white/40 rounded animate-pulse" />
          ) : (
            <Icon className="w-6 h-6 text-white drop-shadow-md" />
          )}
        </div>
        <div className={`flex items-center text-xs font-bold px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
          changeType === 'positive' 
            ? 'bg-emerald-500/25 text-emerald-100 group-hover:bg-emerald-400/30' 
            : 'bg-red-500/25 text-red-100 group-hover:bg-red-400/30'
        }`}>
          {changeType === 'positive' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {change}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-white/90 tracking-wide">{title}</p>
        <p className="text-4xl font-bold text-white drop-shadow-md tracking-tight">{value}</p>
        {trend && (
          <div className="flex items-center text-sm text-white/80 font-medium">
            <TrendingUp className="w-4 h-4 mr-2" />
            {trend}
          </div>
        )}
      </div>
    </div>
  </div>
);

const ChartContainer = ({ title, subtitle, value, change, children, actions }) => (
  <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 group">
    <div className="flex items-start justify-between mb-8">
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
          {actions && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors hover:scale-110">
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors hover:scale-110">
                <Download className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors hover:scale-110">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
        {value && (
          <div className="flex items-baseline space-x-3 mt-4">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
              change?.startsWith('+') 
                ? 'text-emerald-700 bg-emerald-100' 
                : 'text-red-700 bg-red-100'
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

const ModernDataTable = ({ title, icon: Icon, data, columns, valueKey, actions = true, colorScheme = 'blue' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const colorSchemes = {
    blue: {
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-100 to-indigo-100',
      text: 'text-blue-800',
      hover: 'hover:from-blue-50/50 hover:to-indigo-50/50'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-purple-100 to-pink-100',
      text: 'text-purple-800',
      hover: 'hover:from-purple-50/50 hover:to-pink-50/50'
    }
  };

  const scheme = colorSchemes[colorScheme];

  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/30 overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="px-8 py-6 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-r ${scheme.gradient} rounded-2xl shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{data?.length || 0} entries</p>
            </div>
          </div>
          {actions && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110">
                <Filter className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50/80 to-gray-100/60">
              {columns.map((col, idx) => (
                <th key={idx} className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {data?.map((row, idx) => (
              <tr key={idx} className={`transition-all duration-300 group/row cursor-pointer ${scheme.hover}`}>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="font-bold text-gray-900 group-hover/row:text-blue-600 transition-colors text-base">
                    {row.lectureTitle || row.title}
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {row.courseTitle || row.course}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {row.instructorName || row.instructor}
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${scheme.bg} ${scheme.text} shadow-sm`}>
                    {row[valueKey]}
                  </span>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan={columns.length} className="px-8 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-full animate-pulse" />
                    <p>Loading data...</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AlertItem = ({ type, message, time, status = 'active' }) => (
  <div className={`group relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
    type === 'critical' 
      ? 'bg-gradient-to-r from-red-50 via-red-25 to-rose-50 border-red-200 hover:border-red-300 hover:shadow-red-100' 
      : 'bg-gradient-to-r from-amber-50 via-yellow-25 to-orange-50 border-amber-200 hover:border-amber-300 hover:shadow-amber-100'
  }`}>
    {status === 'active' && (
      <div className={`absolute inset-0 ${
        type === 'critical' ? 'bg-red-400' : 'bg-amber-400'
      } opacity-20 animate-pulse`} />
    )}
    
    <div className="relative flex items-start space-x-4">
      <div className={`p-3 rounded-xl shadow-md ${
        type === 'critical' ? 'bg-red-100 shadow-red-200' : 'bg-amber-100 shadow-amber-200'
      }`}>
        {type === 'critical' ? (
          <AlertCircle className={`w-6 h-6 ${type === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
        ) : (
          <Clock className="w-6 h-6 text-amber-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <p className="font-bold text-gray-900 text-base leading-tight">{message}</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            status === 'resolved' 
              ? 'bg-green-100 text-green-800 shadow-green-200' 
              : 'bg-gray-100 text-gray-800 shadow-gray-200'
          }`}>
            {status === 'resolved' ? (
              <><CheckCircle2 className="w-3 h-3 mr-1" /> Resolved</>
            ) : (
              <>Active</>
            )}
          </span>
        </div>
        <p className="text-sm text-gray-600 font-medium">{time}</p>
      </div>
    </div>
    
    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${
      type === 'critical' ? 'from-red-400 to-red-600' : 'from-amber-400 to-orange-500'
    } transition-all duration-700 ${status === 'active' ? 'w-full' : 'w-0'} group-hover:w-full`} />
  </div>
);

const SystemHealthCard = ({ title, value, status, icon: Icon }) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          status === 'good' ? 'bg-green-100' : status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <Icon className={`w-5 h-5 ${
            status === 'good' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600'
          }`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div className={`w-3 h-3 rounded-full ${
        status === 'good' ? 'bg-green-400' : status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
      }`} />
    </div>
  </div>
);

function AdminDashboard() {
  const [topWatched, setTopWatched] = useState([]);
  const [topLiked, setTopLiked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/admin/topLectures")
      .then((res) => {
        setTopWatched(res.data.data[0]?.topWatched || []);
        setTopLiked(res.data.data[0]?.topLiked || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetching issue", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/80 mt-16">
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">Monitor and manage your platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Last 30 days</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <main className="px-8 space-y-12 pb-12">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <MetricCard
            title="Total Users"
            value="48"
            change="+12%"
            changeType="positive"
            trend="vs last month"
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"
            loading={loading}
          />
          <MetricCard
            title="Content Reviews"
            value="156"
            change="+8%"
            changeType="positive"
            trend="vs last month"
            icon={Clipboard}
            gradient="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600"
            loading={loading}
          />
          <MetricCard
            title="Active Instructors"
            value="23"
            change="+15%"
            changeType="positive"
            trend="vs last month"
            icon={Award}
            gradient="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"
            loading={loading}
          />
          <MetricCard
            title="Monthly Revenue"
            value="$12.4K"
            change="+23%"
            changeType="positive"
            trend="vs last month"
            icon={DollarSign}
            gradient="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600"
            loading={loading}
          />
        </section>

        <section className="grid lg:grid-cols-2 gap-10">
          <ChartContainer
            title="Monthly Active Users"
            subtitle="User engagement and growth metrics"
            value="2.41M"
            change="+12% vs last month"
            actions={true}
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={userData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(20px)',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={4}
                  fill="url(#userGradient)"
                  dot={{ fill: '#3B82F6', strokeWidth: 4, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 4, fill: '#fff' }}
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
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={revenueData} barCategoryGap="20%">
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(20px)',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#revenueGradient)" 
                  radius={[12, 12, 0, 0]}
                />
                <Bar 
                  dataKey="target" 
                  fill="#E5E7EB" 
                  radius={[12, 12, 0, 0]}
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

        <section className="grid lg:grid-cols-2 gap-10">
          <ModernDataTable
            title="Top Watched Lectures"
            icon={Eye}
            data={topWatched}
            columns={['Lecture', 'Course', 'Instructor', 'Watch Time']}
            valueKey="totalWatchTime"
            colorScheme="blue"
          />
          <ModernDataTable
            title="Top Liked Lectures"
            icon={Heart}
            data={topLiked}
            columns={['Lecture', 'Course', 'Instructor', 'Likes']}
            valueKey="like"
            colorScheme="purple"
          />
        </section>

        <section>
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/30 p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">System Health</h3>
                  <p className="text-gray-600 mt-1">Real-time system monitoring</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 shadow-md">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  System Operational
                </span>
                <span className="text-sm text-gray-500 font-medium">Last updated: 2 mins ago</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <SystemHealthCard
                title="CPU Usage"
                value="67%"
                status="good"
                icon={Zap}
              />
              <SystemHealthCard
                title="Memory Usage"
                value="45%"
                status="good"
                icon={Database}
              />
              <SystemHealthCard
                title="API Response"
                value="245ms"
                status="good"
                icon={Globe}
              />
              <SystemHealthCard
                title="Server Load"
                value="1.2"
                status="good"
                icon={Server}
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-red-600 uppercase tracking-wide">Critical Alerts (2)</h4>
                  <span className="text-sm text-gray-500 font-medium">Immediate attention required</span>
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
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-amber-600 uppercase tracking-wide">Warning Alerts (3)</h4>
                  <span className="text-sm text-gray-500 font-medium">Monitor closely</span>
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