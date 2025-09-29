import React, { useState } from 'react';
import { FaSearch, FaDownload, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';

function PayoutsDashboard() {
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [selectedMethod, setSelectedMethod] = useState('All Methods');
    const [sortBy, setSortBy] = useState('Date');
    const [currentPage, setCurrentPage] = useState(1);

    const payouts = [
        {
            id: 'PO-2024-001',
            instructor: 'Alice Johnson',
            email: 'alice.johnson@email.com',
            date: 'Jul 15, 2024 09:30',
            amount: '$500.00',
            method: 'Bank Transfer',
            status: 'Pending',
        },
        {
            id: 'PO-2024-002',
            instructor: 'David Kim',
            email: 'david.kim@email.com',
            date: 'Jul 14, 2024 16:45',
            amount: '$1,200.00',
            method: 'PayPal',
            status: 'Pending',
        },
        {
            id: 'PO-2024-003',
            instructor: 'Emma Thomas',
            email: 'emma.t@email.com',
            date: 'Jul 13, 2024 13:20',
            amount: '$800.00',
            method: 'Bank Transfer',
            status: 'Pending',
        },
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`/api/admin/payouts/${id}/approve`);
        } catch (err) {
            console.error("Error approving:", err);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`/api/admin/payouts/${id}/reject`);
        } catch (err) {
            console.error("Error rejecting:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Instructor Payouts</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Transactions', value: '$487,392.54', change: '+12.5%', color: 'text-green-600' },
                        { label: 'Total Users', value: '1,847', change: '+8.2%', color: 'text-green-600' },
                        { label: 'Average Transaction', value: '$263.88', change: '-3.1%', color: 'text-red-600' },
                        { label: 'Success Rate', value: '98.7%', change: '+0.5%', color: 'text-green-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-sm text-gray-500 mb-1">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last period</p>
                        </div>
                    ))}
                </div>

                {/* Filter Section */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Search + Filters */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            {/* Search Bar */}
                            <div className="relative w-full sm:w-auto flex-1">
                                <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search payouts..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
                            >
                                <option>All Status</option>
                                <option>Paid</option>
                                <option>Pending</option>
                                <option>Processing</option>
                            </select>

                            {/* Method Filter */}
                            <select
                                value={selectedMethod}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
                            >
                                <option>All Methods</option>
                                <option>Bank Transfer</option>
                                <option>PayPal</option>
                            </select>
                        </div>

                        {/* Right: Sort + Export */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-end gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded"
                                >
                                    <option>Date</option>
                                    <option>Amount</option>
                                    <option>Status</option>
                                </select>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                <FaDownload className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>


                {/* Payout Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Instructor</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payouts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{p.instructor}</div>
                                            <div className="text-sm text-gray-500">{p.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{p.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{p.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(p.status)}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(p.id)}
                                                    className="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(p.id)}
                                                    className="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden p-4 space-y-4">
                        {payouts.map((p) => (
                            <div key={p.id} className="border p-4 rounded-lg shadow-sm bg-white">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-semibold text-gray-800">{p.instructor}</h4>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(p.status)}`}>{p.status}</span>
                                </div>
                                <p className="text-sm text-gray-600">{p.email}</p>
                                <p className="text-sm text-gray-700 mt-2">Amount: {p.amount}</p>
                                <p className="text-sm text-gray-700">Date: {p.date}</p>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleApprove(p.id)}
                                        className="flex-1 text-white text-xs bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(p.id)}
                                        className="flex-1 text-white text-xs bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                    <p>Showing 1–3 of 3 payouts</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">‹</button>
                        <button className="px-3 py-1 bg-emerald-600 text-white rounded">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default React.memo(PayoutsDashboard)