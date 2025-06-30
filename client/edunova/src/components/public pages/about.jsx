import React from "react";
import Navbar from "./homePage Components/navbar";

const AboutPage = () => {
  return (
    <>
  <Navbar />
  <div className="font-sans text-gray-800 mt-10">

    <section className="bg-gradient-to-r from-indigo-100 to-indigo-50 py-12 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Empowering Learners, Enabling Educators
      </h1>
      <p className="text-gray-600 mb-6">
        Delivering accessible, high-quality education — anytime, anywhere
      </p>
      <div className="flex flex-wrap justify-center gap-6 mt-6 text-indigo-700 font-semibold">
        <div>100K+ Learners</div>
        <div>1,000+ Expert Instructors</div>
        <div>2,500+ Courses</div>
        <div>Global Learning Community</div>
      </div>
    </section>

    <section className="px-6 md:px-20 py-12 flex flex-col md:flex-row items-center gap-10">
      <img
        src="https://via.placeholder.com/400x300"
        alt="Learning Journey"
        className="rounded-lg w-full md:w-1/2"
      />
      <div className="md:w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Our Journey</h2>
        <p className="text-gray-600">
          Since our inception, we've aimed to democratize education by bridging the gap between students and top-tier educators. Through innovative tools, engaging content, and personalized mentoring, we've created a platform where anyone can learn and grow.
        </p>
      </div>
    </section>

    <section className="bg-gray-50 py-12 px-6 md:px-20">
      <h2 className="text-2xl font-semibold text-center mb-10">Our Mission & Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="font-bold text-indigo-600 mb-2">Accessible Learning</h3>
          <p className="text-gray-600">Making quality education available for everyone, everywhere.</p>
        </div>
        <div>
          <h3 className="font-bold text-indigo-600 mb-2">Instructor Empowerment</h3>
          <p className="text-gray-600">Helping educators succeed with tools, reach, and monetization.</p>
        </div>
        <div>
          <h3 className="font-bold text-indigo-600 mb-2">Community Growth</h3>
          <p className="text-gray-600">Building a supportive ecosystem for peer-to-peer learning and collaboration.</p>
        </div>
      </div>
    </section>

    <section className="py-12 px-6 md:px-20">
      <h2 className="text-2xl font-semibold text-center mb-10">Meet the Core Team</h2>
      <div className="flex flex-col md:flex-row justify-center gap-10 text-center">
        <div>
          <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://via.placeholder.com/96" alt="Founder" />
          <h4 className="font-bold">Ayesha Rahman</h4>
          <p className="text-gray-500 text-sm">Founder & CEO</p>
        </div>
        <div>
          <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://via.placeholder.com/96" alt="CTO" />
          <h4 className="font-bold">Rohan Mehta</h4>
          <p className="text-gray-500 text-sm">Chief Technology Officer</p>
        </div>
        <div>
          <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://via.placeholder.com/96" alt="Head of Learning" />
          <h4 className="font-bold">Nisha Kapoor</h4>
          <p className="text-gray-500 text-sm">Head of Learning Experience</p>
        </div>
      </div>
    </section>

    <section className="bg-gray-100 py-12 px-6 md:px-20">
      <h2 className="text-2xl font-semibold text-center mb-10">Inside the Learning Culture</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill().map((_, i) => (
          <img key={i} src={`https://via.placeholder.com/200x150?text=Campus+${i + 1}`} className="rounded-lg" alt={`Campus ${i + 1}`} />
        ))}
      </div>
    </section>

    <section className="py-12 px-6 md:px-20 text-center">
      <h2 className="text-2xl font-semibold mb-6">Our Achievements</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {Array(4).fill().map((_, i) => (
          <img key={i} src={`https://via.placeholder.com/150x100?text=Badge+${i + 1}`} alt={`Badge ${i + 1}`} className="rounded shadow-md" />
        ))}
      </div>
    </section>

    <section className="bg-indigo-50 py-12 text-center">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Ready to Start Your Learning Journey?</h2>
      <div className="flex justify-center gap-6 mt-4">
        <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">Explore Courses</button>
        <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded hover:bg-indigo-100 transition">Become an Instructor</button>
      </div>
    </section>
  </div>
  <Navbar />
</>
  );
};

export default React.memo(AboutPage)
