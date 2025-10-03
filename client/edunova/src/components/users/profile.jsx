import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Camera, Mail, User, Calendar, Shield, CheckCircle } from 'lucide-react';
import UserContext from '../../userContext';

export const UserProfile = () => {
  const { user } = useContext(UserContext);

  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: 'https://placehold.co/150x150/a7f3d0/14532d?text=User'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id) {
      const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `http://localhost:5000/api/admin/userById/${user._id}`,
            { withCredentials: true }
          );

          const fetchedUser = response.data.data;
          if (!fetchedUser) throw new Error("User data not found.");

          setUserData(fetchedUser);
          setProfileData({
            name: fetchedUser.name || '',
            email: fetchedUser.email || '',
            avatar: fetchedUser.avatar || 'https://placehold.co/150x150/a7f3d0/14532d?text=User'
          });
        } catch (err) {
          let errorMessage = "An unexpected error occurred.";
          if (err.response) {
            errorMessage = err.response.data.message || `Error: ${err.response.status}`;
          } else if (err.request) {
            errorMessage = "Network error. Please check your connection.";
          } else {
            errorMessage = err.message;
          }
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setLoading(false);
      setError("No user ID provided to fetch profile.");
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading Profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500 bg-red-100 p-6 rounded-lg shadow-md">{error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">User data not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-1xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-teal-600">
          <div className="absolute -bottom-16 left-8">
            <img
              src={profileData.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-8 px-8">
          {/* Name and Verification Badge */}
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">{profileData.name}</h1>
            {userData.isVerified && (
              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-700">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-700 capitalize">{userData.role || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-700 capitalize">{userData.provider || 'N/A'} Account</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-700">Joined {formatDate(userData.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-700">{userData.enrolledCourses?.length || 0}</div>
              <div className="text-sm text-emerald-600">Enrolled Courses</div>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-teal-700">{userData.userLikedVideos?.length || 0}</div>
              <div className="text-sm text-teal-600">Liked Videos</div>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-700">{userData.mentorshipId?.length || 0}</div>
              <div className="text-sm text-cyan-600">Mentorships</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{userData.isActive ? 'Active' : 'Inactive'}</div>
              <div className="text-sm text-green-600">Account Status</div>
            </div>
          </div>

          {/* Account Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">User ID:</span>
                <span className="text-gray-700 font-mono break-all">{userData._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Google ID:</span>
                <span className="text-gray-700 font-mono break-all">{userData.googleId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated:</span>
                <span className="text-gray-700">{formatDate(userData.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subscription:</span>
                <span className="text-gray-700">{userData.subscriptionId ? 'Active' : 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
