import React from "react";
import Navbar from "./homePage Components/navbar";

const AboutPage = () => {
  return (
    <>
      <Navbar/>
      <div className="font-sans text-gray-800 mt-10">
      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-100 to-indigo-50 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          We’re Building the Future of Digital Experience
        </h1>
        <p className="text-gray-600 mb-6">
          Transforming ideas into impactful solutions since 2015
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-indigo-700 font-semibold">
          <div>10+ Years Experience</div>
          <div>500+ Projects Completed</div>
          <div>200+ Global Clients</div>
          <div>98% Client Satisfaction</div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 md:px-20 py-12 flex flex-col md:flex-row items-center gap-10">
        <img
          src="https://via.placeholder.com/400x300"
          alt="Our Team"
          className="rounded-lg w-full md:w-1/2"
        />
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600">
            Founded in 2015, our expert team is driven to revolutionize digital experiences. Through a balance of innovation, creativity, and reliability, we've delivered user-focused solutions for web, mobile, and enterprise platforms globally.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-gray-50 py-12 px-6 md:px-20">
        <h2 className="text-2xl font-semibold text-center mb-10">Our Mission & Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-bold text-indigo-600 mb-2">Innovation First</h3>
            <p className="text-gray-600">Pushing boundaries and embracing new ideas to deliver future-ready digital solutions.</p>
          </div>
          <div>
            <h3 className="font-bold text-indigo-600 mb-2">Client Success</h3>
            <p className="text-gray-600">Your success is our success. We’re committed to results.</p>
          </div>
          <div>
            <h3 className="font-bold text-indigo-600 mb-2">Sustainable Growth</h3>
            <p className="text-gray-600">Building lasting partnerships and sustainable outcomes for the future.</p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-12 px-6 md:px-20">
        <h2 className="text-2xl font-semibold text-center mb-10">Meet Our Leadership</h2>
        <div className="flex flex-col md:flex-row justify-center gap-10 text-center">
          <div>
            <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://via.placeholder.com/96" alt="David Anderson" />
            <h4 className="font-bold">David Anderson</h4>
            <p className="text-gray-500 text-sm">Chief Executive Officer</p>
          </div>
          <div>
            <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://via.placeholder.com/96" alt="Sarah Johnson" />
            <h4 className="font-bold">Sarah Johnson</h4>
            <p className="text-gray-500 text-sm">Chief Technology Officer</p>
          </div>
          <div>
            <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://via.placeholder.com/96" alt="Michael Chen" />
            <h4 className="font-bold">Michael Chen</h4>
            <p className="text-gray-500 text-sm">Head of Design</p>
          </div>
        </div>
      </section>

      {/* Life at Company */}
      <section className="bg-gray-100 py-12 px-6 md:px-20">
        <h2 className="text-2xl font-semibold text-center mb-10">Life at Company</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill().map((_, i) => (
            <img key={i} src={`https://via.placeholder.com/200x150?text=Image+${i + 1}`} className="rounded-lg" alt={`Life ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-semibold mb-6">Our Achievements</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {Array(4).fill().map((_, i) => (
            <img key={i} src={`https://via.placeholder.com/150x100?text=Award+${i + 1}`} alt={`Award ${i + 1}`} className="rounded shadow-md" />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-50 py-12 text-center">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Want to Join Our Journey?</h2>
        <div className="flex justify-center gap-6 mt-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">Get In Touch</button>
          <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded hover:bg-indigo-100 transition">View Careers</button>
        </div>
      </section>
    </div>
    <Navbar/>
    </>
  );
};

export default AboutPage;
