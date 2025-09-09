import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Filter,
  Eye,
  Users,
  User,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Download,
  RefreshCw,
  SortAsc,
  Grid3X3,
  List,
  BookOpen,
  Calendar,
  Mail,
  Award,
  Bell,
  TrendingUp,
  Star,
  GraduationCap
} from 'lucide-react';

const StatusBadge = React.memo(({ status }) => {
  const base = "inline-flex items-center px-3 py-1 text-xs font-bold rounded-full transition-all duration-200";
  
  if (status === true || status === "approved")
    return (
      <span className={`${base} bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 shadow-sm`}>
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  if (status === false || status === "blocked")
    return (
      <span className={`${base} bg-gradient-to-r from-red-100 to-rose-100 text-red-800 shadow-sm`}>
        <AlertCircle className="w-3 h-3 mr-1" />
        Blocked
      </span>
    );
  if (status === "pending")
    return (
      <span className={`${base} bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 shadow-sm`}>
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  return null;
});

const StatsCard = ({ title, value, icon: Icon, gradient, trend, loading = false, badge = null }) => (
  <div className={`group relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer`}>
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-1000" />
    </div>
    
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          {loading ? (
            <div className="w-6 h-6 bg-white/40 rounded animate-pulse" />
          ) : (
            <Icon className="w-6 h-6 text-white drop-shadow-md" />
          )}
        </div>
        {badge && (
          <div className="flex items-center space-x-2">
            {trend && (
              <div className="text-xs font-bold px-2 py-1 rounded-full bg-white/20 text-white/90 backdrop-blur-sm">
                {trend}
              </div>
            )}
            {badge}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white/90 tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-white drop-shadow-md tracking-tight">
          {loading ? (
            <div className="h-8 w-16 bg-white/30 rounded animate-pulse" />
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  </div>
);

const ActionButton = ({ onClick, children, variant = 'secondary', size = 'md', disabled = false }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary: "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm hover:shadow-md focus:ring-gray-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    warning: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl focus:ring-amber-500"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
};

const InstructorCard = ({ instructor, fmtDate }) => (
  <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={instructor.avatar || "/default-avatar.png"} 
            alt={instructor.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300" 
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <GraduationCap className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {instructor.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <Mail className="w-4 h-4 mr-1" />
            {instructor.email}
          </p>
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <Calendar className="w-3 h-3 mr-1" />
            Joined {fmtDate(instructor.updatedAt)}
          </p>
        </div>
      </div>
      <StatusBadge status={instructor.isActive || instructor.status || instructor.verificationStatus} />
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <BookOpen className="w-4 h-4 text-blue-500" />
        <span className="font-medium">{instructor.myCourses?.length ?? 0} Courses</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Users className="w-4 h-4 text-green-500" />
        <span className="font-medium">{instructor.students ?? 0} Students</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="font-medium">4.8 Rating</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Award className="w-4 h-4 text-purple-500" />
        <span className="font-medium">Expert</span>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <Link
        to={`/admin/instructor_details/${instructor._id}`}
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group/link"
      >
        <Eye className="w-4 h-4 mr-1 group-hover/link:scale-110 transition-transform" />
        View Details
      </Link>
      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded" />
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded" />
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

const SkeletonRow = React.memo(() => (
  <tr className="animate-pulse border-t">
    <td className="px-8 py-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </td>
    <td className="px-8 py-6"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
    <td className="px-8 py-6"><div className="h-6 w-12 bg-blue-200 rounded-full" /></td>
    <td className="px-8 py-6"><div className="h-6 w-12 bg-green-200 rounded-full" /></td>
    <td className="px-8 py-6"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
    <td className="px-8 py-6"><div className="h-6 w-20 bg-gray-200 rounded" /></td>
    <td className="px-8 py-6"><div className="h-6 w-16 bg-emerald-200 rounded-full" /></td>
  </tr>
));

function InstructorsManagement() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Name");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/AllInstructor", { withCredentials: true })
      .then((res) => setInstructors(res.data.data))
      .catch(() => setInstructors([]))
      .finally(() => setLoading(false));
  }, []);

  const { total, active, blocked, pending } = useMemo(() => {
    let active = 0, blocked = 0, pending = 0;
    for (const i of instructors) {
      if (i.verificationStatus === "pending") pending++;
      if (i.isActive === true || i.status === "approved") active++;
      if (i.isActive === false || i.status === "blocked") blocked++;
    }
    return { total: instructors.length, active, blocked, pending };
  }, [instructors]);

  const filteredSorted = useMemo(() => {
    let data = instructors.filter(inst => {
      const q = search.trim().toLowerCase();
      const match = inst.name?.toLowerCase().includes(q)
        || inst.email?.toLowerCase().includes(q);
      if (status === "All") return match;
      if (status === "Active") return match && (inst.isActive === true || inst.status === "approved");
      if (status === "Blocked") return match && (inst.isActive === false || inst.status === "blocked");
      if (status === "Pending") return match && inst.verificationStatus === "pending";
      return match;
    });

    data = [...data].sort((a, b) => {
      switch (sort) {
        case "Name":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "Courses":
          return (b.myCourses?.length ?? 0) - (a.myCourses?.length ?? 0);
        case "Students":
          return (b.students ?? 0) - (a.students ?? 0);
        case "Status":
          return `${a.status || a.isActive}`.localeCompare(`${b.status || b.isActive}`);
        default:
          return 0;
      }
    });
    return data;
  }, [instructors, search, status, sort]);

  const perPage = viewMode === 'grid' ? 9 : 6;
  const totalPages = Math.ceil(filteredSorted.length / perPage);
  const visible = useMemo(
    () => filteredSorted.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filteredSorted, currentPage, perPage]
  );

  useEffect(() => { setCurrentPage(1); }, [search, status, sort]);

  const fmtDate = iso => iso ? new Date(iso).toLocaleDateString() : "-";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/80 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Instructors Management
              </h1>
              <p className="text-gray-600 text-lg">Monitor and manage all instructors</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/admin/instructor_Pending_Section">
                <ActionButton variant="warning" size="lg">
                  <Bell className="w-4 h-4 mr-2" />
                  Instructor Verify Pending
                  {pending > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 ml-2 bg-red-600 text-white rounded-full text-xs font-bold animate-pulse">
                      {pending}
                    </span>
                  )}
                </ActionButton>
              </Link>
              <ActionButton variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </ActionButton>
              <ActionButton variant="primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </ActionButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <StatsCard
              title="Total Instructors"
              value={total}
              icon={Users}
              gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"
              trend="+18% this month"
              loading={loading}
            />
            <StatsCard
              title="Active Instructors"
              value={active}
              icon={UserCheck}
              gradient="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600"
              trend="+15% this month"
              loading={loading}
            />
            <StatsCard
              title="Blocked Instructors"
              value={blocked}
              icon={UserX}
              gradient="bg-gradient-to-br from-red-500 via-rose-500 to-pink-600"
              trend="-2% this month"
              loading={loading}
            />
          </div>

          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/30 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search instructors..."
                    value={search}
                    disabled={loading}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-gray-300"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading}
                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer transition-all duration-200 hover:border-gray-300"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active Only</option>
                    <option value="Blocked">Blocked Only</option>
                    <option value="Pending">Pending Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    disabled={loading}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-sm"
                  >
                    <option value="Name">Name</option>
                    <option value="Courses">Courses</option>
                    <option value="Students">Students</option>
                    <option value="Status">Status</option>
                  </select>
                </div>
                
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'table' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            ) : visible.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <Users className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No instructors found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              visible.map((instructor) => (
                <InstructorCard key={instructor._id} instructor={instructor} fmtDate={fmtDate} />
              ))
            )}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/30 overflow-hidden mb-8">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading instructors...</p>
              </div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/60">
                      <tr>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Instructor
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Courses
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Students
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {visible.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-8 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center space-y-3">
                              <Users className="w-12 h-12 text-gray-300" />
                              <p className="text-lg font-medium">No instructors found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        visible.map((instructor) => (
                          <tr key={instructor._id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 group">
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center space-x-4">
                                <img 
                                  src={instructor.avatar || "/default-avatar.png"} 
                                  alt={instructor.name}
                                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300 shadow-sm" 
                                />
                                <div>
                                  <div className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {instructor.name}
                                  </div>
                                  <div className="text-sm text-gray-500">ID: {instructor._id.slice(-6)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-600 font-medium">{instructor.email || "-"}</td>
                            <td className="px-8 py-6">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {instructor.myCourses?.length ?? 0}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                                <Users className="w-3 h-3 mr-1" />
                                {instructor.students ?? 0}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-600 font-medium">{fmtDate(instructor.updatedAt)}</td>
                            <td className="px-8 py-6">
                              <StatusBadge status={instructor.isActive || instructor.status || instructor.verificationStatus} />
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-2">
                                <Link
                                  to={`/admin/instructor_details/${instructor._id}`}
                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 group/link"
                                >
                                  <Eye className="w-4 h-4 mr-2 group-hover/link:scale-110 transition-transform" />
                                  View Details
                                </Link>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="lg:hidden divide-y divide-gray-100">
                  {visible.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No instructors found</p>
                    </div>
                  ) : (
                    visible.map((instructor) => (
                      <InstructorCard key={instructor._id} instructor={instructor} fmtDate={fmtDate} />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-700 font-medium">
                Showing <span className="font-bold text-blue-600">{(currentPage - 1) * perPage + 1}</span>-
                <span className="font-bold text-blue-600">{Math.min(currentPage * perPage, filteredSorted.length)}</span> of
                <span className="font-bold text-blue-600"> {filteredSorted.length}</span> instructors
              </p>
              
              <div className="flex items-center space-x-2">
                <ActionButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </ActionButton>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <ActionButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </ActionButton>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default React.memo(InstructorsManagement);