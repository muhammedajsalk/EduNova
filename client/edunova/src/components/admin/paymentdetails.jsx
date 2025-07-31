import { useState } from 'react';
import { Download, ChevronDown, User, Mail, Calendar, MapPin, CreditCard, Check } from 'lucide-react';

export default function PaymentDetailsPage() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const paymentHistory = [
    {
      date: 'May 15, 2023',
      transactionId: 'PAY-2023051501',
      amount: '$199.00',
      status: 'Paid'
    },
    {
      date: 'April 15, 2023',
      transactionId: 'PAY-2023041501',
      amount: '$199.00',
      status: 'Paid'
    },
    {
      date: 'March 15, 2023',
      transactionId: 'PAY-2023031501',
      amount: '$199.00',
      status: 'Paid'
    }
  ];

  const planFeatures = [
    'Unlimited access',
    'Priority support',
    'Custom analytics',
    'Team collaboration'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Payment Details</h1>
          
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">John Smith</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            
            {isUserDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="font-medium text-gray-900">John Smith</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">john.smith@email.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="font-medium text-gray-900">March 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="text-2xl font-bold text-gray-900">$199.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    Paid
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-medium text-gray-900">PAY-2023051501</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Date</span>
                  <span className="font-medium text-gray-900">May 15, 2023</span>
                </div>
              </div>
              
              <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Download Invoice
              </button>
            </div>

            {/* Subscription Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plan Name</span>
                  <span className="font-medium text-gray-900">Business Pro</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Billing Cycle</span>
                  <span className="font-medium text-gray-900">Monthly</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Billing Date</span>
                  <span className="font-medium text-gray-900">June 15, 2023</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Plan Features</h3>
                <div className="space-y-2">
                  {planFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Billing Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Billing Address</p>
                    <p className="font-medium text-gray-900">123 Business Street</p>
                    <p className="text-gray-700">New York, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-900">Visa ending in 4242</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
              
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Transaction ID</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentHistory.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-900">{payment.date}</td>
                        <td className="py-3 text-sm text-gray-600">{payment.transactionId}</td>
                        <td className="py-3 text-sm font-medium text-gray-900">{payment.amount}</td>
                        <td className="py-3">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{payment.date}</p>
                        <p className="text-sm text-gray-500">{payment.transactionId}</p>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{payment.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}