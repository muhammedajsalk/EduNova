import React, { useState } from 'react';
import { Search, Calendar, Filter, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Users} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const ScheduledStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState('All Dates');
  const [mentorship,setMentorship]=useState([])

  useEffect(()=>{
    axios.get("http://localhost:5000/api/instructor/getAllMentorship",{withCredentials:true})
    .then((res)=>setMentorship(res.data?.data))
    .catch((err)=>console.log(err.response?.data?.message || err.message))
  },[])

  console.log("mentoship",mentorship)

  const students = [
    {
      id: 1,
      name: 'Emily Johnson',
      avatar: '👩‍💼',
      date: 'Dec 15, 2023',
      time: '2:00 PM - 3:00 PM',
      duration: '60 mins',
      topic: 'Career Guidance',
      status: 'Upcoming'
    },
    {
      id: 2,
      name: 'Michael Smith',
      avatar: '👨‍💻',
      date: 'Dec 15, 2023',
      time: '4:00 PM - 5:00 PM',
      duration: '60 mins',
      topic: 'Technical Interview Prep',
      status: 'Upcoming'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      avatar: '👩‍🎓',
      date: 'Dec 16, 2023',
      time: '10:00 AM - 11:30 AM',
      duration: '90 mins',
      topic: 'Resume Review',
      status: 'Upcoming'
    },
    {
      id: 4,
      name: 'David Brown',
      avatar: '👨‍💼',
      date: 'Dec 16, 2023',
      time: '1:00 PM - 2:00 PM',
      duration: '60 mins',
      topic: 'Project Planning',
      status: 'Completed'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      avatar: '👩‍🔬',
      date: 'Dec 17, 2023',
      time: '3:00 PM - 4:00 PM',
      duration: '60 mins',
      topic: 'Leadership Skills',
      status: 'Cancelled'
    }
  ];


  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-yellow-100 text-black-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReschedule = (studentId) => {
    console.log('Reschedule student:', studentId);
    // Add reschedule logic here
  };

  const handleCancel = (studentId) => {
    console.log('Cancel session for student:', studentId);
    // Add cancel logic here
  };

  const handleMoreActions = (studentId) => {
    console.log('More actions for student:', studentId);
    // Add more actions logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Scheduled Students</h1>
            <p className="text-gray-600 mt-1">View and manage your scheduled mentorship sessions</p>
          </div>
          
          {/* Mentorship Button */}
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 self-start lg:self-auto">
            <Users size={20} />
            <span className="font-medium">
                <Link to={'/instructorDashboard/Mentorship/scheduledStudent/creation'}>
                   Create Mentorship
                </Link>
            </span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Date Range Filter */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500">
                <Calendar size={20} className="text-gray-400" />
                <span className="text-gray-700">{dateRange}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 pr-10 bg-white"
              >
                <option value="All">Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 pr-10 bg-white"
              >
                <option value="Name">Sort</option>
                <option value="Name">Name</option>
                <option value="Date">Date</option>
                <option value="Status">Status</option>
                <option value="Topic">Topic</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div className="col-span-3">Student Name</div>
            <div className="col-span-3">Session Date & Time</div>
            <div className="col-span-1">Duration</div>
            <div className="col-span-2">Topic</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          {/* Students List */}
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student.id} className="px-6 py-4">
                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      {student.avatar}
                    </div>
                    <span className="font-medium text-gray-900">{student.name}</span>
                  </div>
                  <div className="col-span-3 text-gray-700">
                    <div className="font-medium">{student.date}</div>
                    <div className="text-sm text-gray-500">{student.time}</div>
                  </div>
                  <div className="col-span-1 text-gray-700">{student.duration}</div>
                  <div className="col-span-2 text-gray-700">{student.topic}</div>
                  <div className="col-span-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <button
                      onClick={() => handleReschedule(student.id)}
                      className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleCancel(student.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                      {student.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.topic}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>{student.date}</span>
                      <span>{student.duration}</span>
                    </div>
                    <div className="mt-1">{student.time}</div>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => handleReschedule(student.id)}
                      className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(student.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleMoreActions(student.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 ml-auto"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing 1 to 5 of 12 entries
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledStudents;