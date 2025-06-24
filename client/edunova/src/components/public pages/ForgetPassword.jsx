import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/api/users/auth/forgetPassword", { email })
            .then((res) => toast.success("Password reset link sent to your email."))
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message)
                console.log(err.response?.data?.message || err.message)
            }
            )
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Send Reset Link
                    </button>
                </form>

                {message && (
                    <div className="mt-4 text-center text-sm text-green-600">
                        {message}
                    </div>
                )}

                <div className="mt-6 text-center text-sm">
                    <span className="text-blue-600 hover:underline">
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
