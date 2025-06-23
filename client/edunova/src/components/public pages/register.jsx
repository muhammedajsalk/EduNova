import React, { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { useFormik } from 'formik'
import { registerSceama } from '../../../schema/schema';

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
      .then((res) => console.log(res.data.message))
      .catch((err) => console.log(err.response?.data?.message || err.message))
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
    if (!values.email) return alert("Enter your email first.");
    setOtpInput(true)
    axios.post("http://localhost:5000/api/users/auth/otpSent", { email: values.email })
      .then((res) => console.log(res.data.message))
      .catch((err) => console.error("OTP send error:", err.response?.data?.message || err.message))
  }

  console.log(values)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">

        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8">
          <img
            src="https://images.unsplash.com/photo-1584697964154-94d8f6f8303f"
            alt="Instructor"
            className="rounded-lg w-full h-64 object-cover mb-6"
          />
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">Start Your Teaching Journey</h2>
          <p className="text-gray-600 text-center text-sm md:text-base">
            Join thousands of instructors sharing their knowledge
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Create Account</h2>

          {/* Role Toggle */}
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

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                axios.post('http://localhost:5000/api/users/auth/register', credentialResponse, { withCredentials: true })
                  .then((res) => console.log(res.data.message))
                  .catch((err) => {
                    const msg = err.response?.data?.message || err.message;
                    console.log(msg)
                  }
                  )
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Form Fields */}
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
              <button className="w-50 border border-gray-300 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium" onClick={sentOtp}>Get Otp</button>
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
            <p className="text-sm text-gray-500">Password strength: <span className="text-red-500">Weak</span></p>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700"
              onClick={createAccount}
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            By signing up, you agree to our <span className="text-blue-600 underline">Terms of Service</span> and <span className="text-blue-600 underline">Privacy Policy</span>.
          </p>

          <p className="text-sm text-center mt-4">
            Already have an account? <a href="#" className="text-blue-600 font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
