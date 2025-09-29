import React from "react";
import { FaGraduationCap, FaBook, FaUsers, FaTrophy, FaPlayCircle, FaUserTie, FaCheckCircle } from "react-icons/fa";

function StatsAndHowItWorks() {
  return (
    <section className="bg-white">
      <div className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div>
            <FaPlayCircle className="text-emerald-600 text-4xl mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Choose Your Course</h4>
            <p className="text-gray-600">
              Browse our extensive library of expert-led courses
            </p>
          </div>
          <div>
            <FaUserTie className="text-emerald-600 text-4xl mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Learn from Experts</h4>
            <p className="text-gray-600">
              Get personalized guidance from industry professionals
            </p>
          </div>
          <div>
            <FaCheckCircle className="text-emerald-600 text-4xl mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Get Certified</h4>
            <p className="text-gray-600">
              Earn recognized certificates upon completion
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(StatsAndHowItWorks)