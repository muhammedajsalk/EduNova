import React, { useState } from 'react';
import { Search, Calendar, Filter, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const ScheduledStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState('All Dates');
  const [mentorship, setMentorship] = useState([])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/instructor/getAllMentorship`, { withCredentials: true })
      .then((res) => {
        setMentorship(res.data?.data)
      }
      )
      .catch((err) => {})
  }, [])


  const students = mentorship || []




  const getStatusColor = (status) => {
    switch (status) {
      case "upcomming":
        return 'bg-yellow-100 text-black-800';
      case "completed":
        return 'bg-green-100 text-green-800';
      case "canceled":
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.programName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReschedule = (studentId) => {
    
  };

  const handleCancel = (studentId) => {
    
  };

  const handleMoreActions = (studentId) => {
    
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto ">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Scheduled Students</h1>
            <p className="text-gray-600 mt-1">View and manage your scheduled mentorship sessions</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-start lg:self-auto">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
              <Users size={20} />
              <span className="font-medium">
                <Link to={'/instructorDashboard/Mentorship/scheduledStudent/creation'}>
                  Create Mentorship
                </Link>
              </span>
            </button>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
              <Eye size={20} />
              <span className="font-medium">
                <Link to={'/instructorDashboard/mentorship/previous'}>
                  Current Mentorship Preview
                </Link>
              </span>
            </button>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div className="col-span-3">Student Name</div>
            <div className="col-span-3">Session Date & Time</div>
            <div className="col-span-1">Duration</div>
            <div className="col-span-2">Topic</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student.id} className="px-6 py-4">
                <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      <img src={student.userId?.avatar} alt="" className='rounded-full' />
                    </div>
                    <span className="font-medium text-gray-900">{student.userId?.name}</span>
                  </div>
                  <div className="col-span-3 text-gray-700">
                    {student.selectedTimes && (
                      <div className="text-sm text-gray-900">
                        {new Date(student.selectedTimes).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 text-gray-700">1 hr</div>
                  <div className="col-span-2 text-gray-700">{student.programName}</div>
                  <div className="col-span-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    {student.status === "upcomming" && (
                      <>
                        <Link to={`/instructorDashboard/mentorshipVideoSection/${student._id}/${student.userId?._id}`}>
                          <button
                            onClick={() => handleReschedule(student.id)}
                            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                          >
                            Start
                          </button>
                        </Link>
                        <button
                          onClick={() => handleCancel(student.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="lg:hidden space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                      <img src={student.userId?.avatar} alt="" className='rounded-full' />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{student.userId?.name}</h3>
                      <p className="text-sm text-gray-600">{student.programName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>{student.date}</span>
                      <span>1 hr</span>
                    </div>
                    {student.selectedTimes && (
                      <div className="text-sm text-gray-900">
                        {new Date(student.selectedTimes).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 pt-2">
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

export default React.memo(ScheduledStudents)