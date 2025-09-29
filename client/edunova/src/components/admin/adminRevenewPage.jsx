import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Target, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminRevenew = () => {
    const revenueData = [
        { month: 'Jan', value: 40000 },
        { month: 'Feb', value: 45000 },
        { month: 'Mar', value: 55000 },
        { month: 'Apr', value: 65000 },
        { month: 'May', value: 75000 },
        { month: 'Jun', value: 85000 },
    ];

    const planTypeData = [
        { name: 'Standart Plan', value: 85000, color: '#3B82F6' },
        { name: 'Premium Plan', value: 120000, color: '#1D4ED8' },
        { name: 'Mentoring Commision', value: 45000, color: '#60A5FA' },
    ];

    const sourceData = [
        { name: 'Subscriptions', value: 60, color: '#3B82F6' },
        { name: 'Ads', value: 25, color: '#10B981' },
        { name: 'Mentoring Commision', value: 15, color: '#F59E0B' },
    ];

    const instructors = [
        { name: 'Sarah Johnson', avatar: '👩‍🏫', revenue: '$45,670', students: 1234, courses: 8, status: 'Active' },
        { name: 'Michael Chen', avatar: '👨‍💼', revenue: '$38,920', students: 897, courses: 6, status: 'Active' },
        { name: 'Emily Davis', avatar: '👩‍💻', revenue: '$32,450', students: 756, courses: 5, status: 'Active' },
    ];

    const payoutRequests = [
        { name: 'David Wilson', avatar: '👨‍🎓', amount: '$12,450', date: '2024-01-15', status: 'Pending' },
        { name: 'Lisa Anderson', avatar: '👩‍🔬', amount: '$8,920', date: '2024-01-14', status: 'Approved' },
        { name: 'James Taylor', avatar: '👨‍🏫', amount: '$6,780', date: '2024-01-13', status: 'Rejected' },
    ];

    


    const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{change}</span>
                    <TrendingUp className="w-4 h-4 ml-1" />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
                <p className="text-gray-600 text-sm">{title}</p>
            </div>
        </div>
    );

    const StatusBadge = ({ status }) => {
        const statusColors = {
            Active: 'bg-green-100 text-green-800',
            Pending: 'bg-yellow-100 text-yellow-800',
            Approved: 'bg-green-100 text-green-800',
            Rejected: 'bg-red-100 text-red-800',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8 mt-18">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value="$1,245,890"
                        change="+12.5%"
                        changeType="positive"
                        icon={DollarSign}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value="$145,670"
                        change="+8.2%"
                        changeType="positive"
                        icon={Calendar}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Today's Sales"
                        value="$12,450"
                        change="+23.1%"
                        changeType="positive"
                        icon={Target}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        title="Platform Commission"
                        value="$56,330"
                        change="+18.6%"
                        changeType="positive"
                        icon={UserCheck}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Conversion Rate"
                        value="3.2%"
                        change="+2.1%"
                        changeType="positive"
                        icon={TrendingUp}
                        color="bg-emerald-500"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                    <div className="xl:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Revenue Trends</h2>
                            <div className="flex space-x-4">
                                <button className="text-sm text-gray-600 hover:text-gray-900">Weekly</button>
                                <button className="text-sm text-blue-600 font-medium">Monthly</button>
                                <button className="text-sm text-gray-600 hover:text-gray-900">Last 6 months</button>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: '#1D4ED8' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Source</h2>
                        <div className="h-48 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sourceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {sourceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {sourceData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                                        <span className="text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="font-medium">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Plan Type</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={planTypeData} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {planTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Earning Instructors</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-200">
                                        <th className="pb-3 text-sm font-medium text-gray-600">Instructor</th>
                                        <th className="pb-3 text-sm font-medium text-gray-600">Revenue</th>
                                        <th className="pb-3 text-sm font-medium text-gray-600">Students</th>
                                        <th className="pb-3 text-sm font-medium text-gray-600">Courses</th>
                                        <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {instructors.map((instructor, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                        <span className="text-sm">{instructor.avatar}</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">{instructor.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 font-semibold text-gray-900">{instructor.revenue}</td>
                                            <td className="py-4 text-gray-600">{instructor.students}</td>
                                            <td className="py-4 text-gray-600">{instructor.courses}</td>
                                            <td className="py-4">
                                                <StatusBadge status={instructor.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Payout Requests</h2>
                            <div className="flex space-x-2">
                                <button className="text-sm text-blue-600 hover:text-blue-700">
                                    <Link to={'/admin/payout'}>
                                        View All
                                    </Link>
                                </button>
                                <button className="text-sm text-blue-600 hover:text-blue-700">Refresh</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-200">
                                        <th className="pb-3 text-sm font-medium text-gray-600">Instructor</th>
                                        <th className="pb-3 text-sm font-medium text-gray-600">Amount</th>
                                        <th className="pb-3 text-sm font-medium text-gray-600">Request Date</th>
                                        <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                                        <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {payoutRequests.map((request, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                        <span className="text-sm">{request.avatar}</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">{request.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 font-semibold text-gray-900">{request.amount}</td>
                                            <td className="py-4 text-gray-600">{request.date}</td>
                                            <td className="py-4">
                                                <StatusBadge status={request.status} />
                                            </td>
                                            <td className="py-4">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AdminRevenew);