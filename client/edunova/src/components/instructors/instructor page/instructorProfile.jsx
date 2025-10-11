import React, { useState, useEffect, useContext } from 'react';
import {
    Mail, Calendar, CheckCircle, Briefcase, DollarSign,
    Users, BookOpen, Linkedin, Play
} from 'lucide-react';
import axios from 'axios';
import UserContext from '../../../userContext';

// Create a mock context as a fallback if one is not provided.


export const InstructorProfile = () => {
    // Attempt to use the provided context, but fall back to a mock user for standalone functionality.
    const { user } = useContext(UserContext)

    // State to hold all data from the API
    const [instructorData, setInstructorData] = useState(null);

    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Ensure user and user._id are available before fetching
        if (!user?._id) {
            setLoading(false);
            setError("User not found. Please log in.");
            return;
        }

        const fetchInstructorData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/instructorById/${user._id}`, { withCredentials: true });
                setInstructorData(response.data.data);
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch instructor data.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, [user]); // Re-run the effect if the user object changes

    // Helper functions
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount = 0) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Loading and Error states
    if (loading) {
        return <div className="text-center p-10 font-sans">Loading instructor profile...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500 font-sans">Error: {error}</div>;
    }

    if (!instructorData) {
        return <div className="text-center p-10 font-sans">No instructor data available.</div>;
    }

    return (
        <div className="max-w-1xl mx-auto p-6 font-sans">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-teal-600">
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <img
                                src={instructorData.avatar || `https://placehold.co/150x150/4ade80/ffffff?text=${instructorData.name?.[0] || 'A'}`}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="pt-20 pb-8 px-8">
                    {/* Name and Verification Badge */}
                    <div className="mb-2 flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-800">{instructorData.name}</h1>
                        {instructorData.verificationStatus === 'approved' && (
                            <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Verified Instructor</span>
                            </div>
                        )}
                    </div>

                    {/* Profession */}
                    <div className="mb-4">
                        <p className="text-lg text-gray-600">{instructorData.profession}</p>
                    </div>

                    {/* Bio Section */}
                    <div className="mb-6">
                        <p className="text-gray-600">{instructorData.bio}</p>
                    </div>

                    {/* Skills */}
                    {instructorData.skills && instructorData.skills.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {instructorData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact and Links */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-emerald-500" />
                                <span className="text-gray-700">{instructorData.email}</span>
                            </div>

                            {/* LinkedIn */}
                            <div className="flex items-center gap-3">
                                <Linkedin className="w-5 h-5 text-emerald-500" />
                                <a
                                    href={instructorData.linkedInProfile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:text-emerald-700 underline"
                                >
                                    View LinkedIn Profile
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Demo Video */}
                            {instructorData.demoVideo && (
                                <div className="flex items-center gap-3">
                                    <Play className="w-5 h-5 text-emerald-500" />
                                    <a
                                        href={instructorData.demoVideo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:text-emerald-700 underline"
                                    >
                                        Watch Demo Video
                                    </a>
                                </div>
                            )}

                            {/* Join Date */}
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-emerald-500" />
                                <span className="text-gray-700">
                                    Teaching since {formatDate(instructorData.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-emerald-50 rounded-lg p-4 text-center">
                            <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-emerald-700">
                                {instructorData.students || 0}
                            </div>
                            <div className="text-sm text-emerald-600">Students</div>
                        </div>
                        <div className="bg-teal-50 rounded-lg p-4 text-center">
                            <BookOpen className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-teal-700">
                                {instructorData.myCourses?.length || 0}
                            </div>
                            <div className="text-sm text-teal-600">Courses</div>
                        </div>
                        <div className="bg-cyan-50 rounded-lg p-4 text-center">
                            <DollarSign className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-cyan-700">
                                {formatCurrency(instructorData.earnings)}
                            </div>
                            <div className="text-sm text-cyan-600">Total Earnings</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <Briefcase className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-700">
                                {formatCurrency(instructorData.company_revenue)}
                            </div>
                            <div className="text-sm text-green-600">Revenue Share</div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Instructor ID:</span>
                                <span className="text-gray-700 font-mono text-xs">{instructorData._id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Account Status:</span>
                                <span className={`font-medium ${instructorData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                    {instructorData.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Verification:</span>
                                <span className={`font-medium capitalize ${instructorData.verificationStatus === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {instructorData.verificationStatus}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Withdrawals:</span>
                                <span className="text-gray-700">{instructorData.withdrawals?.length || 0} transactions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};