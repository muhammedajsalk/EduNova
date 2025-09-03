import { useState } from 'react';
import {FaSearch, FaDownload, FaChevronDown, FaEye } from 'react-icons/fa';

export default function PaymentTransactionsDashboard() {
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedMethod, setSelectedMethod] = useState('All Methods');
  const [selectedAmount, setSelectedAmount] = useState('All Amounts');
  const [sortBy, setSortBy] = useState('Date');
  const [currentPage, setCurrentPage] = useState(1);

  const transactions = [
    {
      id: 'TRX-2401-1234',
      user: 'John Smith',
      email: 'john.smith@email.com',
      date: 'Jan 15, 2024 14:30',
      amount: '$209.99',
      method: 'Credit Card',
      status: 'Success'
    },
    {
      id: 'TRX-2401-1235',
      user: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      date: 'Jan 15, 2024 13:45',
      amount: '$149.50',
      method: 'PayPal',
      status: 'Pending'
    },
    {
      id: 'TRX-2401-1236',
      user: 'Michael Brown',
      email: 'm.brown@email.com',
      date: 'Jan 15, 2024 12:15',
      amount: '$599.99',
      method: 'Bank Transfer',
      status: 'Success'
    },
    {
      id: 'TRX-2401-1237',
      user: 'Emma Wilson',
      email: 'emma.w@email.com',
      date: 'Jan 15, 2024 11:30',
      amount: '$89.99',
      method: 'Credit Card',
      status: 'Failed'
    },
    {
      id: 'TRX-2401-1238',
      user: 'David Lee',
      email: 'david.lee@email.com',
      date: 'Jan 15, 2024 10:45',
      amount: '$199.99',
      method: 'PayPal',
      status: 'Success'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card':
        return '💳';
      case 'PayPal':
        return '🅿️';
      case 'Bank Transfer':
        return '🏦';
      default:
        return '💳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Payment Transactions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h3>
              <p className="text-2xl font-bold text-gray-900">$487,392.54</p>
              <p className="text-sm text-green-600 mt-1">+12.5% from last period</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">1,847</p>
              <p className="text-sm text-green-600 mt-1">+8.2% from last period</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Average Transaction</h3>
              <p className="text-2xl font-bold text-gray-900">$263.88</p>
              <p className="text-sm text-red-600 mt-1">-3.1% from last period</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Success Rate</h3>
              <p className="text-2xl font-bold text-gray-900">98.7%</p>
              <p className="text-sm text-green-600 mt-1">+0.5% from last period</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option>All Status</option>
                    <option>Success</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                  
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option>All Methods</option>
                    <option>Credit Card</option>
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                  </select>
                  
                  <select
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option>All Amounts</option>
                    <option>$0-$100</option>
                    <option>$100-$500</option>
                    <option>$500+</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Last 30 days</span>
                  <FaChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option>Date</option>
                    <option>Amount</option>
                    <option>Status</option>
                  </select>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  <FaDownload className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.user}</div>
                        <div className="text-sm text-gray-500">{transaction.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{transaction.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1">
                        <FaEye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.id}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="font-medium text-gray-900">{transaction.user}</p>
                  <p className="text-sm text-gray-500">{transaction.email}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{transaction.method}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">{transaction.amount}</span>
                    <button className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1">
                      <FaEye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1-5</span> of <span className="font-medium">234</span> transactions
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  ‹
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}