import React, { useContext } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import UserContext from '../../userContext';

function AdminLogin() {
  const [submiting, setSubmiting] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {user, setUser }=useContext(UserContext)
  const navigate = useNavigate()
  function loginAccount() {
    setSubmiting(true)
    axios.post("http://localhost:5000/api/admin/auth/login", { email, password }, { withCredentials: true })
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-indigo-900 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <img
            src="https://media.istockphoto.com/id/1344731992/photo/diverse-team-of-data-center-system-administrators-and-it-specialists-use-laptop-and-tablet.jpg?s=612x612&w=0&k=20&c=TNpqdTFPlD7fatcJFGzPBFZGxT1B5qTY4SNI6Y8lrEI="
            alt="Dashboard"
            className="rounded-md mb-6 mx-auto"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-300">
            Manage your business with powerful admin tools
          </p>
        </div>
      </div>

      <div className="md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Login Admin Account</h2>
          <div className="space-y-3 mb-6">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                setSubmiting(true)
                axios.post('http://localhost:5000/api/admin/auth/login', credentialResponse, { withCredentials: true })
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
                console.log("Login Failed");
              }}
            />
          </div>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            loginAccount();
          }}>
            <div>
              <label className="block mb-1 text-sm">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-800 text-white py-2 rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              {submiting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Loging...
                </>
              ) : (
                "Login Account"
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default React.memo(AdminLogin)
