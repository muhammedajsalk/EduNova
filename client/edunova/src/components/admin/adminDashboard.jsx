import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaUsers, FaBell, FaCog, FaChartBar, FaUserShield, FaClipboardCheck, FaCreditCard } from 'react-icons/fa';

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

function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md min-h-screen hidden md:block">
        <div className="p-6 text-xl font-bold border-b">AdminControl</div>
        <nav className="p-4 text-sm space-y-2">
          <div className="text-indigo-600 font-semibold flex items-center gap-2"><FaChartBar /> Dashboard</div>
          <div className="flex items-center gap-2 text-gray-700"><FaChartBar /> Analytics</div>
          <div className="flex items-center gap-2 text-gray-700"><FaUsers /> Users</div>
          <div className="flex items-center gap-2 text-gray-700"><FaCog /> Settings</div>
          <div className="flex items-center gap-2 text-gray-700"><FaClipboardCheck /> Reports</div>
          <div className="flex items-center gap-2 text-gray-700"><FaUserShield /> Course Approval</div>
          <div className="flex items-center gap-2 text-gray-700"><FaUsers /> Instructors</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mb-6">Real-time platform metrics and system status</p>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Active Users</h3>
            <div className="text-xl font-semibold">2.4M <span className="text-green-500 text-sm">+12% vs last month</span></div>
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
            <div className="text-xl font-semibold">$847,293 <span className="text-green-500 text-sm">+8.3% vs last month</span></div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <p className="text-2xl font-semibold">48</p>
            <p className="text-sm text-gray-700">User Verifications</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow text-center">
            <p className="text-2xl font-semibold">156</p>
            <p className="text-sm text-gray-700">Content Reviews</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <p className="text-2xl font-semibold">23</p>
            <p className="text-sm text-gray-700">Partner Applications</p>
          </div>
          <div className="bg-indigo-100 p-4 rounded shadow text-center">
            <p className="text-2xl font-semibold">12</p>
            <p className="text-sm text-gray-700">Payment Approvals</p>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">System Alerts</h3>

          <div className="space-y-2">
            {/* Critical Alerts */}
            <div className="text-red-600 font-semibold">Critical Alerts (2)</div>
            <ul className="text-sm ml-4 list-disc text-gray-700">
              <li>Database CPU Usage at 85% <span className="text-gray-400 text-xs ml-2">10 minutes ago</span></li>
              <li>API Response Time  2s <span className="text-gray-400 text-xs ml-2">25 minutes ago</span></li>
            </ul>

            {/* Warning Alerts */}
            <div className="text-yellow-600 font-semibold mt-4">Warning Alerts (3)</div>
            <ul className="text-sm ml-4 list-disc text-gray-700">
              <li>Storage Space 75% Full <span className="text-gray-400 text-xs ml-2">1 hour ago</span></li>
              <li>Cache Miss Rate Increased <span className="text-gray-400 text-xs ml-2">2 hours ago</span></li>
              <li>Background Job Delays <span className="text-gray-400 text-xs ml-2">2 hours ago</span></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
