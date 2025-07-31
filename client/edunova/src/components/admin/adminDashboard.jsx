import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  FaUserShield, FaClipboardCheck, FaCreditCard, FaBell, FaCog,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const userData = [
  { name: 'Jan', value: 2.2 },
  { name: 'Feb', value: 2.3 },
  { name: 'Mar', value: 2.4 },
  { name: 'Apr', value: 2.41 },
];

const revenueData = [
  { name: 'Jan', value: 700000 },
  { name: 'Feb', value: 730000 },
  { name: 'Mar', value: 800000 },
  { name: 'Apr', value: 847293 },
];

// Reusable StatCard component
const StatCard = ({ bgColor, title, value }) => (
  <div className={`${bgColor} p-4 rounded shadow text-center`}>
    <p className="text-2xl font-semibold">{value}</p>
    <p className="text-sm text-gray-700">{title}</p>
  </div>
);

// Reusable AlertSection component
const AlertSection = ({ label, color, items }) => (
  <div>
    <div className={`${color} font-semibold mb-2`}>{label}</div>
    <ul className="text-sm ml-4 list-disc text-gray-700">
      {items.map(({ text, time }, idx) => (
        <li key={idx}>
          {text} <span className="text-gray-400 text-xs ml-2">{time}</span>
        </li>
      ))}
    </ul>
  </div>
);

function AdminDashboard() {
  // No sidebar, no navigation state needed

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          {/* Placeholder for user/settings icons */}
          <FaUserShield className="text-gray-500" size={20} />
          <FaCog className="text-gray-500" size={20} />
          <FaBell className="text-gray-500" size={20} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 mb-6">Real-time platform metrics and system status</p>
        </section>

        {/* Charts */}
        <section className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Active Users</h3>
            <div className="text-xl font-semibold">
              2.4M <span className="text-green-500 text-sm">+12% vs last month</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={userData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</h3>
            <div className="text-xl font-semibold">
              $847,293 <span className="text-green-500 text-sm">+8.3% vs last month</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>


        {/* Payment Transactions */}
        <section className="bg-white p-4 rounded shadow mt-6">
          <div className='flex justify-between items-center '>
              <h3 className="text-lg font-semibold mb-4">Recent Payment Transactions</h3>
              <button className='text-emerald-500'>
                <Link to={'/admin/payment_transaction'}>
                   view all
                </Link>
                </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2">Transaction ID</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    id: 'TXN10234',
                    user: 'John Doe',
                    amount: '$450.00',
                    method: 'Bank Transfer',
                    status: 'Paid',
                    date: '2025-07-27',
                  },
                  {
                    id: 'TXN10235',
                    user: 'Jane Smith',
                    amount: '$320.00',
                    method: 'PayPal',
                    status: 'Pending',
                    date: '2025-07-26',
                  },
                  {
                    id: 'TXN10236',
                    user: 'Ali Khan',
                    amount: '$980.00',
                    method: 'Bank Transfer',
                    status: 'Processing',
                    date: '2025-07-25',
                  },
                ].map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{tx.id}</td>
                    <td className="px-4 py-2">{tx.user}</td>
                    <td className="px-4 py-2">{tx.amount}</td>
                    <td className="px-4 py-2">{tx.method}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${tx.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : tx.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-emerald-100 text-emerald-700'
                          }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Stat Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
          <StatCard bgColor="bg-yellow-100" title="User Verifications" value="48" />
          <StatCard bgColor="bg-red-100" title="Content Reviews" value="156" />
          <StatCard bgColor="bg-green-100" title="Partner Applications" value="23" />
          <StatCard bgColor="bg-emerald-100" title="Payment Approvals" value="12" />
        </section>
        {/* System Alerts */}
        <section className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">System Alerts</h3>

          <AlertSection
            label="Critical Alerts (2)"
            color="text-red-600"
            items={[
              { text: 'Database CPU Usage at 85%', time: '10 minutes ago' },
              { text: 'API Response Time 2s', time: '25 minutes ago' },
            ]}
          />

          <AlertSection
            label="Warning Alerts (3)"
            color="text-yellow-600"
            items={[
              { text: 'Storage Space 75% Full', time: '1 hour ago' },
              { text: 'Cache Miss Rate Increased', time: '2 hours ago' },
              { text: 'Background Job Delays', time: '2 hours ago' },
            ]}
          />
        </section>
      </main>

    </div>
  );
}

export default React.memo(AdminDashboard);
