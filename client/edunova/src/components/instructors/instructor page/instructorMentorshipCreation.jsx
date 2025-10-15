import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  isToday,
  isBefore
} from "date-fns";
import { Calendar, Clock, DollarSign, BookOpen, ChevronLeft, ChevronRight, Save, Send } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object({
  programName: Yup.string()
    .required("Program name is required")
    .min(3, "Must be at least 3 characters"),
  programFee: Yup.number()
    .required("Program fee is required")
    .min(0, "Must be positive")
    .typeError("Must be a valid number"),
  selectedDate: Yup.date().required("Please select a date"),
  selectedTimes: Yup.array().min(1, "Select at least one time slot")
});

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

function MentorshipProgramCreator() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      programName: "",
      programFee: "",
      selectedDate: null,
      selectedTimes: []
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/instructor/createMentorShip`, values, { withCredentials: true });
        toast.success(response.data.message);

        setTimeout(() => {
          setIsSubmitting(false);
          formik.resetForm();
        }, 1500);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  });



  const toggleTimeSlot = (slot) => {
    if (!formik.values.selectedDate) {
      toast.error("Please select a date first");
      return;
    }

    const [time, meridian] = slot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    const dateTime = new Date(formik.values.selectedDate);
    dateTime.setHours(
      hours % 12 + (meridian === "PM" ? 12 : 0),
      minutes,
      0,
      0
    );

    const exists = formik.values.selectedTimes.some(
      (t) => new Date(t).getTime() === dateTime.getTime()
    );

    formik.setFieldValue(
      "selectedTimes",
      exists
        ? formik.values.selectedTimes.filter(
          (t) => new Date(t).getTime() !== dateTime.getTime()
        )
        : [...formik.values.selectedTimes, dateTime]
    );
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const saveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const publishProgram = () => formik.submitForm();

  const handleDateClick = async (day) => {
    if (isBefore(day, new Date()) && !isToday(day)) {
      toast.error("Cannot select past dates");
      return;
    }
    formik.setFieldValue("selectedDate", day);
    try {
      await saveSelectedDate(day);
    } catch (error) {

    }
  };

  const today = new Date();

  return (
    <div className="min-h-screen via-indigo-50 to-purple-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                Program Details
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Program Name</label>
                <div className="relative">
                  <input
                    name="programName"
                    value={formik.values.programName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-4 pr-12 border-2 rounded-xl bg-gray-50/50 transition-all duration-200 ${formik.touched.programName && formik.errors.programName
                        ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                      }`}
                    placeholder="e.g., Advanced React Development Mentorship"
                  />
                  <BookOpen className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {formik.touched.programName && formik.errors.programName && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {formik.errors.programName}
                  </p>
                )}
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Program Fee (USD)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="programFee"
                    value={formik.values.programFee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-4 pl-12 pr-4 border-2 rounded-xl bg-gray-50/50 transition-all duration-200 ${formik.touched.programFee && formik.errors.programFee
                        ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                      }`}
                    placeholder="99.00"
                  />
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {formik.touched.programFee && formik.errors.programFee && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {formik.errors.programFee}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
                Select Date
              </h2>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-xl font-semibold text-gray-900">
                    {format(currentMonth, "MMMM yyyy")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {days.map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {allDays.map((day, idx) => {
                    const isPast = isBefore(day, today) && !isToday(day);
                    const isSelected = isSameDay(day, formik.values.selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isTodayDay = isToday(day);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDateClick(day)}
                        disabled={isPast}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${isSelected
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105"
                            : isPast
                              ? "text-gray-300 cursor-not-allowed"
                              : isCurrentMonth
                                ? isTodayDay
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                  : "text-gray-700 hover:bg-gray-100 hover:scale-105"
                                : "text-gray-400 hover:text-gray-600"
                          }`}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>

                {formik.touched.selectedDate && formik.errors.selectedDate && (
                  <p className="text-red-600 text-sm mt-4 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {formik.errors.selectedDate}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                Available Time Slots
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {timeSlots.map((time) => {
                  const isSelected = formik.values.selectedTimes.some(
                    (t) => format(new Date(t), "hh:mm a") === time
                  );

                  return (
                    <label key={time} className="relative cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTimeSlot(time)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 text-center font-medium transition-all duration-200 ${isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg scale-105"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 group-hover:scale-105"
                        }`}>
                        <Clock className={`w-4 h-4 mx-auto polkadot mb-2 ${isSelected ? "text-white" : "text-gray-500"
                          }`} />
                        {time}
                      </div>
                    </label>
                  );
                })}
              </div>

              {formik.touched.selectedTimes && formik.errors.selectedTimes && (
                <p className="text-red-600 text-sm mt-4 flex items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {formik.errors.selectedTimes}
                </p>
              )}
            </div>

            <div className="flex gap-4 lg:hidden">
              <button
                type="button"
                onClick={saveDraft}
                className="flex-1 flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={publishProgram}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 h-fit">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-orange-600" />
              </div>
              Preview
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-600 mb-1">Program Title</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formik.values.programName || "Untitled Program"}
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-600 mb-1">Program Fee</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ${formik.values.programFee || "0.00"}
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-600 mb-1">Selected Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formik.values.selectedDate
                    ? format(formik.values.selectedDate, "EEEE, MMMM d, yyyy")
                    : "No date selected"
                  }
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-600 mb-1">Time Slots</p>
                {formik.values.selectedTimes.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formik.values.selectedTimes.map((time, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-200 text-purple-800 text-sm font-medium rounded-full">
                        {format(new Date(time), "hh:mm a")}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No time slots selected</p>
                )}
              </div>
            </div>

            <div className="hidden lg:block mt-8 space-y-3">
              <button
                type="button"
                onClick={saveDraft}
                className="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={publishProgram}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? "Publishing..." : "Publish Program"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default React.memo(MentorshipProgramCreator)