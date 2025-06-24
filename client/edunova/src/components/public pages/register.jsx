import React, { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { useFormik } from 'formik'
import { registerSceama } from '../../../schema/schema';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Register() {
  const [role, setRole] = useState("Student");
  const [otpInput, setOtpInput] = useState(false)

  const initialValue = {
    name: "",
    email: "",
    password: "",
    otp: ""
  }

  function createAccount(values) {
    if (!otpInput) {
      alert("Please confirm your email by entering the 6-digit OTP.");
    }
    axios.post("http://localhost:5000/api/users/auth/register", values, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message)
      }
      )
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message)
        console.log(err.response?.data?.message || err.message)
      })
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
    setOtpInput(true)
    toast.success("the Otp send successfully")
    axios.post("http://localhost:5000/api/users/auth/otpSent", { email: values.email })
      .then((res) => console.log(res.data.message))
      .catch((err) => {
        console.error("OTP send error:", err.response?.data?.message || err.message)
        toast.error(err.response?.data?.message || err.message)
      })
    setTimeout(()=>{
       setOtpInput(false)
    },180000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
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
              className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "Student" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("Instructor")}
              className={`w-1/2 px-4 py-2 text-sm font-medium ${role === "Instructor" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                }`}
            >
              Instructor
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                axios.post('http://localhost:5000/api/users/auth/register', credentialResponse, { withCredentials: true })
                  .then((res) => {
                    toast.success(res.data.message)
                  }
                  )
                  .catch((err) => {
                    const msg = err.response?.data?.message || err.message;
                    toast.error(msg)
                  }
                  )
              }}
              onError={() => {
                console.log("Login Failed");
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
                <button className="w-50 border border-gray-300 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium" onClick={sentOtp} disabled={errors.email}>Get Otp</button>
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
              <p className='text-blue-500'>after 3 min send otp system is on</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700"
            >
              Create Account
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            By signing up, you agree to our <span className="text-blue-600 underline">Terms of Service</span> and <span className="text-blue-600 underline">Privacy Policy</span>.
          </p>

          <p className="text-sm text-center mt-4">
            Already have an account? <Link to={'/login'}><span className="text-blue-600 font-medium">Sign in</span></Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
