import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [forgetLink, setForgetLink] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setForgetLink(true)
        axios.post("http://localhost:5000/api/users/auth/forgetPassword", { email })
            .then((res) => toast.success("sent a reset link in your email"))
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message)
                console.log(err.response?.data?.message || err.message)
            }
            ).finally(() => {
                setForgetLink(false)
            })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    Forgot your password?
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter your email address and we’ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition flex justify-center items-center"
                    >
                        {forgetLink ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white text-center" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <span className="text-indigo-600 hover:underline">
                        <Link to={'/login'}>
                            Back to Login
                        </Link>
                    </span>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
