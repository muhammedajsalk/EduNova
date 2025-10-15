import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar, Clock, DollarSign, Users, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import UserContext from '../../../userContext';

const MentorshipPreview = () => {
    const [mentorship, setMentorship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(UserContext)

    useEffect(() => {
        fetchMentorshipData();
    }, []);

    const fetchMentorshipData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/instructor/getMentorshipById/${user?._id}`,
                {
                    withCredentials: true,
                }
            );
            setMentorship(response.data.data);
            setError(null);
        } catch (err) {
            // ✨ KEY CHANGE IS HERE ✨
            // Check if the error response status is 400
            if (axios.isAxiosError(err) && err.response && err.response.status === 400) {
                // If it's a 400, treat it as "not found"
                setMentorship(null);
                setError(null); // Ensure no error message is shown
            } else {
                // For all other errors, show the generic error message
                setError(err.message || 'Failed to fetch mentorship data');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        // Directly create a Date object from the valid string
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC' // Optional, but good practice if the input is UTC
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-emerald-700 font-medium">Loading mentorship details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <XCircle size={32} />
                        <h2 className="text-2xl font-bold">Error</h2>
                    </div>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button
                        onClick={fetchMentorshipData}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!mentorship) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
                {/* This message will now show for 400 status codes */}
                <p className="text-gray-600 text-lg">No mentorship data found</p>
            </div>
        );
    }

    return (
        <div className="max-w-1xl mx-auto p-3">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-emerald-100">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen size={32} className="text-emerald-100" />
                        <span className="text-emerald-100 text-sm font-medium uppercase tracking-wide">
                            Mentorship Program
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{mentorship.programName}</h1>
                    <div className="flex items-center gap-2">
                        {mentorship.isActive ? (
                            <span className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                <CheckCircle size={16} />
                                Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                <XCircle size={16} />
                                Inactive
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Program Fee */}
                        <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                            <div className="bg-emerald-600 p-3 rounded-lg">
                                <DollarSign size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-emerald-700 font-medium mb-1">Program Fee</p>
                                <p className="text-3xl font-bold text-emerald-900">${mentorship.programFee}</p>
                            </div>
                        </div>

                        {/* Enrolled Students */}
                        <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
                            <div className="bg-teal-600 p-3 rounded-lg">
                                <Users size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-teal-700 font-medium mb-1">Enrolled Students</p>
                                <p className="text-3xl font-bold text-teal-900">
                                    {mentorship.students?.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-emerald-100">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Calendar size={28} />
                        Schedule
                    </h2>
                </div>

                <div className="p-8">
                    {/* Date */}
                    <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-l-4 border-emerald-600">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar size={20} className="text-emerald-600" />
                            <p className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">
                                Program Date
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatDate(mentorship.selectedDate)}
                        </p>
                    </div>

                    {/* Times */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Clock size={20} className="text-teal-600" />
                            <p className="text-sm text-teal-700 font-semibold uppercase tracking-wide">
                                Available Times
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {mentorship.selectedTimes && mentorship.selectedTimes.length > 0 ? (
                                    mentorship.selectedTimes.map((timeString) => (
                                        <div
                                            key={timeString} // Use the unique date string as the key
                                            className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                                        >
                                            <p className="text-lg font-bold text-teal-900">
                                                {formatTime(timeString)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 col-span-2">No times scheduled</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Additional Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-1">
                            <p className="text-gray-500 font-medium">Created At</p>
                            <p className="text-gray-900 font-semibold">
                                {new Date(mentorship.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-500 font-medium">Last Updated</p>
                            <p className="text-gray-900 font-semibold">
                                {new Date(mentorship.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-500 font-medium">Program ID</p>
                            <p className="text-gray-900 font-mono text-xs">{mentorship._id}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-500 font-medium">Instructor ID</p>
                            <p className="text-gray-900 font-mono text-xs">{mentorship.instructorId?._id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorshipPreview;