import React, { useState } from 'react';
import {
  Bell,
  Check,
  X,
  Search,
  Filter,
  Trash2,
  Archive,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Calendar,
  MessageSquare,
  User,
  ShoppingBag,
  Settings,
  ChevronDown,
  MoreVertical,
  Clock,
  Mail,
  Eye
} from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useContext } from 'react';
import UserContext from '../../userContext';
import { getIcon } from '../../../../../server/utilis/iconMap';
import { useMemo } from 'react';

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
  withCredentials: true,
});

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const { user, notificationCo, setNotificationCo } = useContext(UserContext);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notification/${user._id}`)
      .then((res) => {
        setNotifications(res.data);
        const unread = res.data.filter(n => !n.read).length;
        setNotificationCo(unread);
      })
      .catch((err) => { });
  }, [user._id]);

  useEffect(() => {
    socket.on("notification", (data) => {
      if (data.userId === user._id) {
        setNotifications((prev) => [...prev, data]);
      }
    })
    return () => {
      socket.off("notification");
    };
  }, [])





  const categories = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },

    {
      id: 'order',
      label: 'Orders',
      count: notifications.filter(n => [
        "course_new",
        "course_enrolled",
        "subscription_purchased",
        "subscription_expiry_reminder",
        "subscription_ended",
        "mentorship_new",
        "mentorship_purchased",
        "mentorship_cancelled"
      ].includes(n.category)).length
    },

    {
      id: 'message',
      label: 'Messages',
      count: notifications.filter(n => [
        "message",
        "student_enrolled_message"
      ].includes(n.category)).length
    },

    {
      id: 'billing',
      label: 'Billing',
      count: notifications.filter(n => [
        "subscription_purchased",
        "subscription_expiry_reminder",
        "subscription_ended"
      ].includes(n.category)).length
    },

    {
      id: 'security',
      label: 'Security',
      count: notifications.filter(n => [
        "auth_login_failed",
        "instructor_attempt_failed"
      ].includes(n.category)).length
    },

    {
      id: 'system',
      label: 'System',
      count: notifications.filter(n => [
        "system_health",
        "course_verification",
        "instructor_application_verification"
      ].includes(n.category)).length
    },
  ];





  const filteredNotifications = useMemo(() => {
    return notifications.filter(
      notification => {
        const matchesFilter = selectedFilter === 'all' ||
          (selectedFilter === 'unread' && !notification.read) ||
          notification.category === selectedFilter;

        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
      }
    );
  }, [notifications, selectedFilter, searchTerm]);


  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n._id === id ? { ...n, read: true } : n
    ));
    axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/notification/read/${id}`).catch(console.error);
    setNotificationCo(prev => prev - 1);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/notification/read-all/${user._id}`).catch(console.error);
    setNotificationCo(0);
  };

  const deleteNotification = (id) => {

    setNotifications(notifications.filter(n => n._id !== id));
    axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/notification/${id}`).catch(console.error);
    setNotificationCo(prev => prev - 1);

    setShowDropdown(null);
  };

  const archiveNotification = (id) => {
    setNotifications(notifications.filter(n => n._id !== id));
    axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/notification/archive/${id}`).catch(console.error);
    setNotificationCo(prev => prev - 1)
    setShowDropdown(null);
  };

  const toggleSelection = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(nId => nId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n._id));
    }
  };

  const deleteSelected = async () => {
    try {
      setNotifications((prev) =>
        prev.filter((n) => !selectedNotifications.includes(n._id))
      );

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/notification/bulk-delete`, {
        ids: selectedNotifications,
      });

      setNotificationCo(prev => prev - 1)
      setSelectedNotifications([]);
    } catch (err) {
      console.error("Error deleting selected notifications:", err);
    }
  };




  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 hover:bg-green-50';
      case 'error':
        return 'bg-red-50 border-red-200 hover:bg-red-50';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-50';
      case 'info':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-50';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-50';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div className="flex items-start sm:items-center space-x-4">
                <Bell className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    You have {notifications.filter((n) => !n.read).length} unread notifications
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={markAllAsRead}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-emerald-600 bg-white border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  Mark all as read
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Filters
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedFilter(category.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all ${selectedFilter === category.id
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${selectedFilter === category.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={selectAll}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Select all</span>
                  </label>
                  {selectedNotifications.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" onClick={deleteSelected}>
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Delete
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Archive className="w-4 h-4 inline mr-1" />
                        Archive
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                  <div className="text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
                  </div>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getIcon(notification.icon)
                  return (
                    <div
                      key={notification._id}
                      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${!notification.read ? 'border-l-4' : ''
                        } ${getTypeStyles(notification.type)}`}
                    >
                      <div className="p-6">
                        <div className="flex items-start">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification._id)}
                            onChange={() => toggleSelection(notification._id)}
                            className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          />

                          {/* Icon */}
                          <div className={`ml-4 flex-shrink-0 ${getIconColor(notification.type)}`}>
                            <Icon className="w-6 h-6" />
                          </div>

                          {/* Content */}
                          <div className="ml-4 flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-sm font-semibold text-gray-900">
                                    {notification.title}
                                  </h3>
                                  {!notification.read && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                                      New
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </span>
                                  <span className="capitalize px-2 py-0.5 bg-gray-100 rounded">
                                    {notification.category}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="ml-4 flex items-center gap-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification._id)}
                                    className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Mark as read"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}

                                <div className="relative">
                                  <button
                                    onClick={() => setShowDropdown(showDropdown === notification._id ? null : notification._id)}
                                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {showDropdown === notification._id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                      <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <Eye className="w-4 h-4" />
                                        Mark as read
                                      </button>
                                      <button
                                        onClick={() => archiveNotification(notification._id)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <Archive className="w-4 h-4" />
                                        Archive
                                      </button>
                                      <button
                                        onClick={() => deleteNotification(notification._id)}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons (optional) */}
                            {notification.actions && notification.type === 'warning' && (
                              <div className="mt-4 flex gap-3">
                                <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                                  Renew Subscription
                                </button>
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                  Remind Later
                                </button>
                              </div>
                            )}

                            {notification.actions && notification.type === 'error' && (
                              <div className="mt-4 flex gap-3">
                                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                                  Review Security
                                </button>
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                  Dismiss
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Load More */}
            {filteredNotifications.length > 0 && (
              <div className="mt-8 text-center">
                <button className="px-6 py-3 text-sm font-medium text-emerald-600 bg-white border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                  Load More Notifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center">
        <Filter className="w-6 h-6" />
      </button>
    </div>
  );
};

export default React.memo(NotificationsPage)