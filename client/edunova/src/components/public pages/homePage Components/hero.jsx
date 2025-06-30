import React from "react";

import {Link} from 'react-router-dom'

function HeroSection() {
  return (
    <section className="pt-24 flex flex-col-reverse lg:flex-row items-center justify-between px-6 py-16 max-w-7xl mx-auto gap-10">
      
      <div className="max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Transform Your Skills with <br /> Expert-Led Learning
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Access courses, 1-on-1 mentorship, and a thriving learning community
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold">
            <Link to={'/courses'}>
               Explore Courses
            </Link>
          </button>
          <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-full font-semibold">
            <Link to={'/instructorRegistor'}>
                Become an Instructor
            </Link>
          </button>
        </div>
        <div className="flex space-x-8 text-center text-gray-700 font-semibold">
          <div>
            <p className="text-xl">10k+</p>
            <p className="text-sm text-gray-500">Students</p>
          </div>
          <div>
            <p className="text-xl">500+</p>
            <p className="text-sm text-gray-500">Courses</p>
          </div>
          <div>
            <p className="text-xl">200+</p>
            <p className="text-sm text-gray-500">Mentors</p>
          </div>
        </div>
      </div>

     
      <div className="w-full lg:w-[45%]">
        <img
          src="https://media.istockphoto.com/id/639359406/photo/students-studying-in-college-library.jpg?s=612x612&w=0&k=20&c=8ItJkQbEDQPMRkjqxCCpCKIBThJ6dZ2HLWfwQ4Zj470=" // Replace with actual image path
          alt="Learning"
          className="rounded-xl shadow-md"
        />
      </div>
    </section>
  );
}

export default React.memo(HeroSection)
