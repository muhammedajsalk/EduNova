import React, { useState } from 'react';

export default function Register() {
  const [role, setRole] = useState("Student");

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
              className={`w-1/2 px-4 py-2 text-sm font-medium ${
                role === "Student" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("Instructor")}
              className={`w-1/2 px-4 py-2 text-sm font-medium ${
                role === "Instructor" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              Instructor
            </button>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100">
              <span className="mr-2">🔵</span> Continue with Google
            </button>
            <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100">
              <span className="mr-2">🍎</span> Continue with Apple
            </button>
            <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100">
              <span className="mr-2">📘</span> Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Form Fields */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
            <input
              type="password"
              placeholder="Create a password"
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
            <p className="text-sm text-gray-500">Password strength: <span className="text-red-500">Weak</span></p>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700"
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
