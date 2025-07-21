import React from "react";

const InstructorTerms = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen px-6 py-10 md:px-20 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-indigo-600">
          Instructor Terms & Conditions
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-6 text-center">
          Last Updated: July 2025
        </p>

        {/* Introduction */}
        <section className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Introduction</h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Welcome to our e-learning platform! These Terms and Conditions govern
            your participation as an instructor on our platform. By registering as
            an instructor, you agree to comply with these terms, including our
            payout policies, content guidelines, and revenue-sharing models.
          </p>
        </section>

        {/* Content Guidelines */}
        <section className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Content Guidelines</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm md:text-base space-y-2">
            <li>All content must be original and comply with copyright laws.</li>
            <li>No abusive, misleading, or inappropriate material is allowed.</li>
            <li>Courses must meet the quality standards (HD video, structured curriculum).</li>
            <li>Instructors are responsible for keeping their content updated.</li>
          </ul>
        </section>

        {/* Revenue & Payouts */}
        <section className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Revenue & Payouts</h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-2">
            The platform retains 60% of total user subscription revenue, while
            40% is allocated to the instructor pool based on watch time. 
          </p>
          <ul className="list-disc list-inside text-gray-700 text-sm md:text-base space-y-2">
            <li>Minimum payout threshold: ₹1,000.</li>
            <li>Payout cycle: Monthly, with a 30-day fraud check.</li>
            <li>Instructors must pass content and engagement thresholds (e.g., 50 watch hours/month).</li>
          </ul>
        </section>

        {/* Responsibilities */}
        <section className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Instructor Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm md:text-base space-y-2">
            <li>Maintain high-quality courses and respond to student queries.</li>
            <li>Follow all platform rules and community guidelines.</li>
            <li>Keep payment details up-to-date for timely payouts.</li>
          </ul>
        </section>

        {/* Termination */}
        <section className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Termination of Account</h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            We reserve the right to terminate instructor accounts in case of 
            policy violations, fraud, or inappropriate behavior. In such cases,
            pending payouts may be withheld until an internal review is complete.
          </p>
        </section>
      </div>
    </div>
  );
};

export default InstructorTerms;
