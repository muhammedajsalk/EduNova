import React, { useContext, useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Eye, EyeOff, Shield, Mail, Lock } from 'lucide-react';
import UserContext from '../../userContext';


function AdminLogin() {
  const [submiting, setSubmiting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function loginAccount() {
    setSubmiting(true)
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/auth/login`, { email, password }, { withCredentials: true })
      .then((res) => {
        setUser({role:"admin"})
        toast.success(res.data.message)
        setTimeout(() => {
          navigate('/adminDashboard')
        }, 2000);
      })
      .catch((err) => toast.error(err.response?.data?.message || err.message))
      .finally(() => setSubmiting(false))
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <div className="lg:w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
              <Shield size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            Welcome to <span className="text-emerald-300">Admin Dashboard</span>
          </h1>
          <p className="text-lg text-emerald-100 leading-relaxed">
            Manage your business with powerful admin tools
          </p>
        </div>
      </div>

      <div className="lg:w-1/2 p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login Admin Account</h2>
            <p className="text-gray-600">Access your administrative dashboard</p>
          </div>

          <div className="mb-6">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                setSubmiting(true)
                axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/auth/login`, credentialResponse, { withCredentials: true })
                  .then((res) => {
                    setUser({role:"admin"})
                    toast.success(res.data.message)
                    setTimeout(() => {
                      navigate('/adminDashboard')
                    }, 2000);
                  })
                  .catch((err) => {
                    const msg = err.response?.data?.message || err.message;
                    toast.error(msg)
                  }
                  ).finally(() => {
                    setSubmiting(false)
                  })
              }}
              onError={() => {
                
              }}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            loginAccount();
          }}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {submiting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Loging...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Login Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Secure admin access protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default React.memo(AdminLogin);