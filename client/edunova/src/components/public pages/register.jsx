import React, { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { useFormik } from 'formik'
import { registerSceama } from '../../../schema/schema';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [role, setRole] = useState("Student");
  const [otpInput, setOtpInput] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submiting,setSubmiting]=useState(false)

  const navigate = useNavigate()

  const initialValue = {
    name: "",
    email: "",
    password: "",
    otp: "",
  }

  function createAccount(values) {
    if (!otpInput) {
      alert("Please confirm your email by entering the 6-digit OTP.");
    }
    setSubmiting(true)
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/auth/register`, { ...values, role: "user" }, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message)
        setTimeout(() => {
          navigate('/login')
        }, 2000);
      }
      )
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message)
      })
      .finally(()=>setSubmiting(false))
  }

  const { values, handleBlur, handleSubmit, handleChange, errors, touched } = useFormik({
    initialValues: initialValue,
    validationSchema: registerSceama,
    onSubmit: (values) => {
      createAccount(values)
    }
  })

  function sentOtp(e) {
    e.preventDefault()
    if (!values.email) return toast.warning("Enter your email first");
    setSendingOtp(true);
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/auth/otpSent`, { email: values.email, role: "user" })
      .then((res) => {
        setOtpInput(true)
        toast.success(res.data.message)
      })
      .catch((err) => {
        console.error("OTP send error:")
        toast.error(err.response?.data?.message || err.message)
      })
      .finally(() => {
        setSendingOtp(false);
      });
    setTimeout(() => {
      setOtpInput(false)
      setSendingOtp(false);
    }, 180000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      {role === "Student" ? (
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8">
            <img
              src="https://media.istockphoto.com/id/1757344400/photo/smiling-college-student-writing-during-a-class-at-the-university.jpg?s=612x612&w=0&k=20&c=_o2ZaJedvI0VfuH2rjGjMpYqXlBm_0BUv9Qxy2tHqK0="
              alt="Instructor"
              className="rounded-lg w-full h-64 object-cover mb-6"
            />
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">Start Your Student Journey</h2>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Join thousands of instructors sharing their knowledge
            </p>
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Create Account</h2>
            <div className="flex mb-4 border border-gray-300 rounded-md overflow-hidden w-full max-w-xs">
              <button
                onClick={() => setRole("Student")}
                className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "Student" ? "bg-emerald-600 text-white" : "bg-white text-gray-700"
                  }`}
              >
                Student
              </button>
              <button
                onClick={() => setRole("Instructor")}
                className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "Instructor" ? "bg-emerald-600 text-white" : "bg-white text-gray-700"
                  }`}
              >
                Instructor
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  setSubmiting(true)
                  axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/auth/register`, credentialResponse, { withCredentials: true })
                    .then((res) => {
                      toast.success(res.data.message)
                      setTimeout(() => {
                        navigate('/learningDashboard')
                      }, 2000);
                    }
                    )
                    .catch((err) => {
                      const msg = err.response?.data?.message || err.message;
                      toast.error(msg)
                    }
                    )
                    .finally(()=>setSubmiting(false))
                }}
                onError={() => {
                  
                }}
              />
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.name && touched.name && (<p className="text-red-500">{errors.name}</p>)}
              <div className='flex'>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {!otpInput && (
                  <button
                    className="w-50 border border-gray-300 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center gap-2"
                    onClick={sentOtp}
                    disabled={errors.email || sendingOtp}
                  >
                    {sendingOtp ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Get OTP"
                    )}
                  </button>
                )}
              </div>
              {errors.email && touched.email && (<p className="text-red-500">{errors.email}</p>)}
              {otpInput && (
                <>
                  <input
                    type="password"
                    placeholder="Enter The Otp"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md"
                    name="otp"
                    value={values.otp}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {errors.otp && touched.otp && (<p className="text-red-500">{errors.otp}</p>)}
                </>
              )}
              <input
                type="password"
                placeholder="Create a password"
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.password && touched.password && (<p className="text-red-500">{errors.password}</p>)}
              {otpInput && (
                <p className='text-emerald-500'>after 3 min send otp system is on</p>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                {submiting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              <Link to={'/policy'}>
                By signing up, you agree to our <span className="text-emerald-600 underline">Terms of Service</span> and <span className="text-emerald-600 underline">Privacy Policy</span>.
              </Link>
            </p>
            <p className="text-sm text-center mt-4">
              Already have an account? <Link to={'/login'}><span className="text-emerald-600 font-medium">Sign in</span></Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8">
            <img
              src="https://media.istockphoto.com/id/515264678/photo/portrait-of-confident-caucasian-male-teacher-in-classroom.jpg?s=612x612&w=0&k=20&c=XxZPrrrC7XsjzLZN1TqKnp6k4OozMxLSv_zrvCDjP7I="
              alt="Instructor"
              className="rounded-lg w-full h-64 object-cover mb-6"
            />
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">Start Your Instructor Journey</h2>
            <p className="text-gray-600 text-center text-sm md:text-base">
              Share to lakhs of student your knowledge
            </p>
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Create Account</h2>
            <div className="flex mb-4 border border-gray-300 rounded-md overflow-hidden w-full max-w-xs">
              <button
                onClick={() => setRole("Student")}
                className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "Student" ? "bg-emerald-600 text-white" : "bg-white text-gray-700"
                  }`}
              >
                Student
              </button>
              <button
                onClick={() => setRole("Instructor")}
                className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "Instructor" ? "bg-emerald-600 text-white" : "bg-white text-gray-700"
                  }`}
              >
                Instructor
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-gray-600 text-center text-sm md:text-base">
                Become a instructor is some procedures are there
              </p>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-medium py-2 rounded-md hover:bg-emerald-700"
            >
              <Link to={'/instructorRegistor'}>
                Create Account
              </Link>
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              <Link to={'/policy'}>
                By signing up, you agree to our <span className="text-emerald-600 underline">Terms of Service</span> and <span className="text-emerald-600 underline">Privacy Policy</span>.
              </Link>
            </p>
            <p className="text-sm text-center mt-4">
              Already have an account? <Link to={'/login'}><span className="text-emerald-600 font-medium">Sign in</span></Link>
            </p>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default React.memo(Register)