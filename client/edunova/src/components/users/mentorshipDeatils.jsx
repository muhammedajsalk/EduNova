import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MultiRingLoader from "../../utilis/spinner";
import LoadingButton from "../../utilis/loadingButton";

const InstructorBooking = () => {
  const [instructor, setInstructor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false)

  const { id: instructorId } = useParams();

  const data = {
    selectedDate,
    selectedTime,
    currentMonth
  }


  const fetchInstructor = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/mentorShip/${instructorId}`,
        { withCredentials: true }
      );

      if (data.success) {
        const mentorshipDate = new Date(data.data.date);
        setCurrentMonth(
          new Date(mentorshipDate.getFullYear(), mentorshipDate.getMonth())
        );
        setSelectedDate(mentorshipDate.getDate());
        setInstructor({
          ...data.data,
          availableDates: [data.data.date],
        });
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchInstructor();
  }, [instructorId]);

  const handlePayment = async (plan) => {
    setBuyLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/mentorShip/buy`,
        {
          mentorshipId: instructor._id,
          programFee: instructor.amount
        },
        { withCredentials: true }
      );

      const { order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order?.amount,
        currency: order?.currency,
        name: "E-Learning Platform",
        description: `Plan Mentorship`,
        order_id: order?.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/users/mentorShip/verify`,
              {
                razorpay_payment_id: response?.razorpay_payment_id,
                razorpay_order_id: response?.razorpay_order_id,
                razorpay_signature: response?.razorpay_signature,
                instructorId: instructor.instructorId,
                mentorshipId: instructor._id,
                selectedDate: selectedDate,
                selectedTimes: selectedTime,
                programFee: instructor.amount,
                programName: instructor.programName
              },
              { withCredentials: true }
            );
            toast.success("Payment successful! Access granted.");
            fetchInstructor();
            setSelectedDate(null);
            setSelectedTime(null);
          } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Something went wrong during payment.";
            toast.error(message)
          }
        },
        theme: {
          color: "#50C878",
        },
      };

      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong during payment.";
      toast.warning(message)
    }finally{
      setBuyLoading(false)
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = Array(new Date(year, month, 1).getDay()).fill(null);
    for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) {
      days.push(i);
    }
    return days;
  };

  const formatTime = (t) =>
    new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const isDateAvailable = (day) =>
    instructor?.availableDates?.some((d) => {
      const dateObj = new Date(d);
      return (
        dateObj.getDate() === day &&
        dateObj.getMonth() === currentMonth.getMonth() &&
        dateObj.getFullYear() === currentMonth.getFullYear()
      );
    });

  if (loading) return <MultiRingLoader />;

  if (!instructor || !currentMonth) {
    return <div className="p-4">Loading instructor details...</div>;
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-25">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-lg p-6 shadow-sm flex items-start space-x-4">
            <img
              src={instructor.instructorImage}
              alt={instructor.instructorName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{instructor.instructorName}</h2>
              <p className="text-gray-600 text-sm">{instructor.profession}</p>
              <div className="flex items-center mt-2 space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm">{instructor.instructorRating}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
            </div>

            <div className="grid grid-cols-7 text-sm text-center font-medium text-gray-500">
              {dayNames.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mt-2">
              {days.map((day, idx) => (
                <div key={idx}>
                  {day && (
                    <button
                      onClick={() => isDateAvailable(day) && setSelectedDate(day)}
                      disabled={!isDateAvailable(day)}
                      className={`w-full rounded-lg py-2 ${selectedDate === day
                        ? "bg-emerald-500 text-white"
                        : isDateAvailable(day)
                          ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          : "text-gray-300 cursor-not-allowed"
                        }`}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-base font-medium mb-4">Available Time Slots</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {instructor.time?.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTime(t)}
                    className={`p-3 border rounded-lg ${selectedTime === t
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                      : "border-gray-200 text-gray-700"
                      }`}
                  >
                    {formatTime(t)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <h3 className="text-lg font-medium mb-6">Booking Summary</h3>

          <div className="flex justify-between text-sm mb-2">
            <span>Session Type</span><span>1-on-1 Mentoring</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Duration</span><span>60 mins</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Date & Time</span>
            <span>
              {selectedDate && selectedTime
                ? `${monthNames[currentMonth.getMonth()]} ${selectedDate}, ${currentMonth.getFullYear()} - ${formatTime(selectedTime)}`
                : "Select date & time"}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Session Rate</span><span>₹{instructor.amount}.00</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total</span><span className="text-emerald-600">₹{instructor.amount}.00</span>
          </div>

          <LoadingButton
            loading={buyLoading} 
            disabled={!selectedDate || !selectedTime}
            onClick={() => handlePayment()}
            className={`w-full py-3 rounded-lg text-white ${selectedDate && selectedTime
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Book Session
          </LoadingButton>

        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default React.memo(InstructorBooking)