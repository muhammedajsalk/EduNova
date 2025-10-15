import React, { useContext, useEffect, useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  VideoCameraIcon,
  LockClosedIcon,
  PlusCircleIcon,
  DevicePhoneMobileIcon,
  XMarkIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import axios from 'axios';
import UserContext from '../../../userContext';

const InstructorEarningsPage = () => {
  const [chartType, setChartType] = useState('area');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showAddUPIModal, setShowAddUPIModal] = useState(false);
  const [showPoolDetailsModal, setShowPoolDetailsModal] = useState(false);
  const [selectedPoolMonth, setSelectedPoolMonth] = useState('December 2024');
  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, accountNumber: '****4532', bankName: 'State Bank of India', ifsc: 'SBIN0001234', isDefault: true }
  ]);
  const [upiAccounts, setUpiAccounts] = useState([
    { id: 1, upiId: 'instructor@paytm', provider: 'Paytm', isDefault: true }
  ]);
  const [selectedPaymentAccount, setSelectedPaymentAccount] = useState('bank-1');

  // Revenue Pool Data
  const currentInstructorRank = 3; // Current instructor's rank
  const totalSubscriptionPool = 12500.00; // Total subscription revenue
  const adminShare = totalSubscriptionPool * 0.4; // 40% admin
  const instructorPool = totalSubscriptionPool * 0.6; // 60% instructors

  const { user } = useContext(UserContext)

  useEffect(()=>{
     axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/instructor/summary`,{instructor:{id:user._id}},{withCredentials:true})
     .then(res=>{ 
        
     })
     .catch((err)=>{
        
     })
  },[])

  // Ranking Distribution Percentages
  const rankingDistribution = [
    { rank: 1, name: 'Sarah Johnson', percentage: 25, students: 487, rating: 4.9, earnings: 0 },
    { rank: 2, name: 'Michael Chen', percentage: 20, students: 423, rating: 4.8, earnings: 0 },
    { rank: 3, name: 'You', percentage: 15, students: 385, rating: 4.7, earnings: 0, isCurrentUser: true },
    { rank: 4, name: 'Emily Davis', percentage: 12, students: 298, rating: 4.6, earnings: 0 },
    { rank: 5, name: 'Robert Wilson', percentage: 10, students: 234, rating: 4.5, earnings: 0 },
    { rank: 6, name: 'Lisa Anderson', percentage: 8, students: 187, rating: 4.4, earnings: 0 },
    { rank: 7, name: 'James Taylor', percentage: 5, students: 145, rating: 4.3, earnings: 0 },
    { rank: 8, name: 'Maria Garcia', percentage: 3, students: 98, rating: 4.2, earnings: 0 },
    { rank: 9, name: 'David Brown', percentage: 1.5, students: 67, rating: 4.1, earnings: 0 },
    { rank: 10, name: 'Jennifer Lee', percentage: 0.5, students: 45, rating: 4.0, earnings: 0 }
  ];

  // Calculate earnings for each rank
  rankingDistribution.forEach(instructor => {
    instructor.earnings = (instructorPool * instructor.percentage) / 100;
  });

  const yourPoolEarnings = rankingDistribution.find(i => i.isCurrentUser)?.earnings || 0;

  // Pool distribution chart data
  const poolPieData = [
    { name: 'Admin Share', value: adminShare, color: '#ef4444' },
    { name: 'Instructor Pool', value: instructorPool, color: '#10b981' }
  ];

  // Monthly pool trend
  const poolTrendData = [
    { month: 'Jul', totalPool: 8500, yourShare: 850 },
    { month: 'Aug', totalPool: 9200, yourShare: 920 },
    { month: 'Sep', totalPool: 10100, yourShare: 1212 },
    { month: 'Oct', totalPool: 11000, yourShare: 1320 },
    { month: 'Nov', totalPool: 11800, yourShare: 1416 },
    { month: 'Dec', totalPool: 12500, yourShare: 1125 }
  ];

  // Data
  const stats = [
    {
      name: 'Total Earnings',
      value: '$45,231.89',
      change: '+12.5%',
      changeType: 'positive',
      icon: ArrowTrendingUpIcon,
      color: 'emerald'
    },
    {
      name: 'Pool Earnings',
      value: `$${yourPoolEarnings.toFixed(2)}`,
      change: `Rank #${currentInstructorRank}`,
      changeType: 'neutral',
      icon: TrophyIcon,
      color: 'purple'
    },
    {
      name: 'Direct Earnings',
      value: '$2,847.00',
      change: 'Course Sales',
      changeType: 'neutral',
      icon: AcademicCapIcon,
      color: 'blue'
    },
    {
      name: 'Blocked Amount',
      value: '$2,350.00',
      change: '5 Sessions',
      changeType: 'neutral',
      icon: LockClosedIcon,
      color: 'orange'
    },
    {
      name: 'Pending Payout',
      value: '$1,847.00',
      change: 'Processing',
      changeType: 'neutral',
      icon: ClockIcon,
      color: 'amber'
    }
  ];

  const chartData = [
    { month: 'Jul', revenue: 3200 },
    { month: 'Aug', revenue: 3800 },
    { month: 'Sep', revenue: 3600 },
    { month: 'Oct', revenue: 4100 },
    { month: 'Nov', revenue: 4235 },
    { month: 'Dec', revenue: 4500 }
  ];

  const breakdown = [
    {
      source: 'Course Sales',
      amount: '$2,847',
      percentage: 45,
      icon: AcademicCapIcon,
      color: 'emerald'
    },
    {
      source: 'Pool Revenue',
      amount: `$${yourPoolEarnings.toFixed(0)}`,
      percentage: 18,
      icon: UsersIcon,
      color: 'purple'
    },
    {
      source: 'Mentoring',
      amount: '$988',
      percentage: 15,
      icon: VideoCameraIcon,
      color: 'blue'
    },
    {
      source: 'Direct Subscriptions',
      amount: '$400',
      percentage: 6,
      icon: UserGroupIcon,
      color: 'indigo'
    }
  ];

  const blockedSessions = [
    { id: 1, student: 'John Smith', date: '2024-12-25', time: '10:00 AM', amount: 500 },
    { id: 2, student: 'Emily Johnson', date: '2024-12-26', time: '2:00 PM', amount: 450 },
    { id: 3, student: 'Michael Brown', date: '2024-12-27', time: '11:00 AM', amount: 500 },
    { id: 4, student: 'Sarah Davis', date: '2024-12-28', time: '3:00 PM', amount: 450 },
    { id: 5, student: 'Robert Wilson', date: '2024-12-29', time: '4:00 PM', amount: 450 },
  ];

  const transactions = [
    {
      id: 1,
      date: '2024-12-20',
      course: 'Advanced React Development',
      student: 'John Smith',
      amount: 89.99,
      status: 'completed',
      type: 'course'
    },
    {
      id: 2,
      date: '2024-12-19',
      course: 'Revenue Pool Share',
      student: 'System',
      amount: yourPoolEarnings,
      status: 'pending',
      type: 'pool'
    },
    {
      id: 3,
      date: '2024-12-18',
      course: 'JavaScript Fundamentals',
      student: 'Michael Brown',
      amount: 49.99,
      status: 'completed',
      type: 'course'
    },
    {
      id: 4,
      date: '2024-12-17',
      course: 'Mentoring Session',
      student: 'Sarah Davis',
      amount: 150.00,
      status: 'completed',
      type: 'mentoring'
    },
    {
      id: 5,
      date: '2024-12-16',
      course: 'Web Design Masterclass',
      student: 'Robert Wilson',
      amount: 79.99,
      status: 'completed',
      type: 'course'
    }
  ];

  const recentPayouts = [
    { date: '2024-11-15', amount: 3125.00, status: 'completed', method: 'Bank Transfer' },
    { date: '2024-10-30', amount: 2850.00, status: 'completed', method: 'UPI' },
    { date: '2024-10-15', amount: 2200.00, status: 'completed', method: 'Bank Transfer' }
  ];

  const totalStudents = 385;
  const availableBalance = 1847.00;
  const minimumPayout = 100.00;

  // Handlers
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.student.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      refunded: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSelectTransaction = (id) => {
    setSelectedTransactions(prev =>
      prev.includes(id) 
        ? prev.filter(tid => tid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    }
  };

  const handleRequestPayout = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleAddBankAccount = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAccount = {
      id: bankAccounts.length + 1,
      accountNumber: `****${formData.get('accountNumber').slice(-4)}`,
      bankName: formData.get('bankName'),
      ifsc: formData.get('ifsc'),
      isDefault: false
    };
    setBankAccounts([...bankAccounts, newAccount]);
    setShowAddBankModal(false);
  };

  const handleAddUPI = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUPI = {
      id: upiAccounts.length + 1,
      upiId: formData.get('upiId'),
      provider: formData.get('provider'),
      isDefault: false
    };
    setUpiAccounts([...upiAccounts, newUPI]);
    setShowAddUPIModal(false);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-lg font-bold text-emerald-600">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your revenue and manage payouts</p>
        </div>

        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 ${
                  stat.color === 'emerald' ? 'bg-emerald-100' : 
                  stat.color === 'amber' ? 'bg-amber-100' : 
                  stat.color === 'orange' ? 'bg-orange-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-blue-100'
                } rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'emerald' ? 'text-emerald-600' : 
                    stat.color === 'amber' ? 'text-amber-600' : 
                    stat.color === 'orange' ? 'text-orange-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-blue-600'
                  }`} />
                </div>
                {stat.changeType === 'positive' && (
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.changeType === 'neutral' && (
                  <p className="mt-1 text-sm text-gray-500">{stat.change}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Pool Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Subscription Revenue Pool</h2>
                <p className="text-sm text-gray-600">Monthly distribution based on instructor rankings</p>
              </div>
            </div>
            <button
              onClick={() => setShowPoolDetailsModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pool Distribution */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Pool Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={poolPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {poolPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                    Admin (40%)
                  </span>
                  <span className="font-medium">${adminShare.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
                    Instructors (60%)
                  </span>
                  <span className="font-medium">${instructorPool.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Your Position */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your Position</h3>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full text-white mb-3">
                    <span className="text-2xl font-bold">#{currentInstructorRank}</span>
                  </div>
                  <p className="text-sm text-gray-600">Current Ranking</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">${yourPoolEarnings.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Your pool earnings (15%)</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Students</span>
                  <span className="font-medium">{totalStudents}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium">4.7 ⭐</span>
                </div>
              </div>
            </div>

            {/* Pool Trend */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your Pool Earnings Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={poolTrendData}>
                  <defs>
                    <linearGradient id="colorPool" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Area 
                    type="monotone" 
                    dataKey="yourShare" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fill="url(#colorPool)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Rankings */}
          <div className="mt-6 bg-white rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Current Month Rankings</h3>
            <div className="space-y-3">
              {rankingDistribution.slice(0, 5).map((instructor) => (
                <div
                  key={instructor.rank}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    instructor.isCurrentUser 
                      ? 'bg-purple-50 border-purple-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankBadge(instructor.rank)}`}>
                      {instructor.rank}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {instructor.name}
                        {instructor.isCurrentUser && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">You</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {instructor.students} students • {instructor.rating} rating
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${instructor.earnings.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{instructor.percentage}% of pool</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blocked Sessions Info */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <LockClosedIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Blocked Amount Details</h3>
                <p className="text-sm text-gray-600 mt-1">
                  These amounts will be released after completing scheduled mentorship sessions
                </p>
                <div className="mt-4 space-y-2">
                  {blockedSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <VideoCameraIcon className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{session.student}</p>
                          <p className="text-xs text-gray-500">{session.date} at {session.time}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-orange-600">${session.amount}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View all {blockedSessions.length} pending sessions →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart & Breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
                <p className="text-sm text-gray-600 mt-1">Last 6 months performance</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    chartType === 'area' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    chartType === 'line' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Line
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'area' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Revenue Breakdown */}
          <div className="xl:col-span-1 space-y-6">
            {/* Student Count Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Active Students</p>
                  <p className="text-3xl font-bold mt-2">{totalStudents}</p>
                  <p className="text-emerald-100 text-sm mt-2">+27 this month</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            {/* Revenue Sources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
              <div className="space-y-4">
                {breakdown.map((item) => (
                  <div key={item.source}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${
                          item.color === 'emerald' ? 'bg-emerald-100' : 
                          item.color === 'blue' ? 'bg-blue-100' : 
                          item.color === 'purple' ? 'bg-purple-100' :
                          'bg-indigo-100'
                        } rounded-lg`}>
                          <item.icon className={`h-5 w-5 ${
                            item.color === 'emerald' ? 'text-emerald-600' : 
                            item.color === 'blue' ? 'text-blue-600' : 
                            item.color === 'purple' ? 'text-purple-600' :
                            'text-indigo-600'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.source}</p>
                          <p className="text-xs text-gray-500">{item.amount}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${
                          item.color === 'emerald' ? 'bg-emerald-500' : 
                          item.color === 'blue' ? 'bg-blue-500' : 
                          item.color === 'purple' ? 'bg-purple-500' :
                          'bg-indigo-500'
                        } h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <p className="text-sm text-gray-600 mt-1">Manage and track your earnings</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Export CSV</span>
              </button>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Types</option>
                  <option value="course">Courses</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="pool">Pool Revenue</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FunnelIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.length === filteredTransactions.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course/Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student/Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={() => handleSelectTransaction(transaction.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.course}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {transaction.type === 'pool' ? (
                            <span className="text-purple-600 font-medium">Revenue Pool</span>
                          ) : (
                            transaction.type
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {transaction.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-emerald-600 hover:text-emerald-900 font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">24</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Payout Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payout Request</h2>
              <p className="text-sm text-gray-600 mt-1">Request withdrawal of your earnings</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-emerald-600">${availableBalance.toFixed(2)}</p>
            </div>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800">Payout request submitted successfully!</p>
                <p className="text-xs text-emerald-600 mt-1">You'll receive your funds within 3-5 business days.</p>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Payout Information</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Minimum payout amount: ${minimumPayout.toFixed(2)}</li>
                <li>• Processing time: 3-5 business days for Bank, Instant for UPI</li>
                <li>• Pool revenue distributed on the 1st of each month</li>
                <li>• Blocked amounts released after session completion</li>
              </ul>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setSelectedMethod('bank')}
                className={`pb-2 px-1 font-medium text-sm transition-colors ${
                  selectedMethod === 'bank'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bank Account
              </button>
              <button
                onClick={() => setSelectedMethod('upi')}
                className={`pb-2 px-1 font-medium text-sm transition-colors ${
                  selectedMethod === 'upi'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                UPI
              </button>
            </div>

            {/* Bank Accounts */}
            {selectedMethod === 'bank' && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Select Bank Account</h3>
                  <button
                    onClick={() => setShowAddBankModal(true)}
                    className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <PlusCircleIcon className="h-4 w-4" />
                    <span>Add Account</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      onClick={() => setSelectedPaymentAccount(`bank-${account.id}`)}
                      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        selectedPaymentAccount === `bank-${account.id}`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {selectedPaymentAccount === `bank-${account.id}` && (
                        <div className="absolute top-2 right-2">
                          <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                      )}
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          selectedPaymentAccount === `bank-${account.id}` ? 'bg-emerald-100' : 'bg-gray-100'
                        }`}>
                          <BuildingLibraryIcon className={`h-5 w-5 ${
                            selectedPaymentAccount === `bank-${account.id}` ? 'text-emerald-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{account.bankName}</p>
                          <p className="text-xs text-gray-600 mt-1">Account: {account.accountNumber}</p>
                          <p className="text-xs text-gray-500">IFSC: {account.ifsc}</p>
                          {account.isDefault && (
                            <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UPI Accounts */}
            {selectedMethod === 'upi' && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Select UPI ID</h3>
                  <button
                    onClick={() => setShowAddUPIModal(true)}
                    className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <PlusCircleIcon className="h-4 w-4" />
                    <span>Add UPI</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {upiAccounts.map((upi) => (
                    <div
                      key={upi.id}
                      onClick={() => setSelectedPaymentAccount(`upi-${upi.id}`)}
                      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        selectedPaymentAccount === `upi-${upi.id}`
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {selectedPaymentAccount === `upi-${upi.id}` && (
                        <div className="absolute top-2 right-2">
                          <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                      )}
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          selectedPaymentAccount === `upi-${upi.id}` ? 'bg-emerald-100' : 'bg-gray-100'
                        }`}>
                          <DevicePhoneMobileIcon className={`h-5 w-5 ${
                            selectedPaymentAccount === `upi-${upi.id}` ? 'text-emerald-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{upi.upiId}</p>
                          <p className="text-xs text-gray-600 mt-1">Provider: {upi.provider}</p>
                          {upi.isDefault && (
                            <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payout Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payout Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                defaultValue={availableBalance}
                max={availableBalance}
                min={minimumPayout}
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-medium"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Enter an amount between ${minimumPayout.toFixed(2)} and ${availableBalance.toFixed(2)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRequestPayout}
              className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <BanknotesIcon className="h-5 w-5" />
              <span>Request Payout</span>
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View Payout History
            </button>
          </div>

          {/* Recent Payouts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Payouts</h3>
            <div className="space-y-3">
              {recentPayouts.map((payout, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">${payout.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{payout.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date(payout.date).toLocaleDateString()}</p>
                    <p className="text-xs font-medium text-emerald-600 capitalize">{payout.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pool Details Modal */}
      {showPoolDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Revenue Pool Details</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedPoolMonth} Distribution</p>
              </div>
              <button
                onClick={() => setShowPoolDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Pool Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Pool</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${totalSubscriptionPool.toFixed(2)}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Admin Share (40%)</p>
                <p className="text-2xl font-bold text-red-600 mt-1">${adminShare.toFixed(2)}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Instructor Pool (60%)</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">${instructorPool.toFixed(2)}</p>
              </div>
            </div>

            {/* Distribution Rules */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Distribution Rules</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Rankings based on: Student count (40%), Ratings (30%), Course completions (30%)</li>
                <li>• Top 3 instructors receive 60% of the instructor pool</li>
                <li>• Minimum 50 active students required to qualify</li>
                <li>• Distribution processed on 1st of each month</li>
              </ul>
            </div>

            {/* Full Rankings Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pool %</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rankingDistribution.map((instructor) => (
                    <tr 
                      key={instructor.rank} 
                      className={instructor.isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'}
                    >
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankBadge(instructor.rank)}`}>
                          {instructor.rank}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {instructor.name}
                          {instructor.isCurrentUser && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">You</span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{instructor.students}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{instructor.rating} ⭐</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{instructor.percentage}%</td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-600">
                        ${instructor.earnings.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPoolDetailsModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAddBankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Bank Account</h3>
              <button
                onClick={() => setShowAddBankModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddBankAccount}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="holderName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddBankModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add UPI Modal */}
      {showAddUPIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add UPI ID</h3>
              <button
                onClick={() => setShowAddUPIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddUPI}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    placeholder="yourname@upi"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider
                  </label>
                  <select
                    name="provider"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Provider</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="BHIM">BHIM</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUPIModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add UPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorEarningsPage;