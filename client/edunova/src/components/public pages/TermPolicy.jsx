import React from "react";
import Navbar from "./homePage Components/navbar";
import Footer from "./homePage Components/Footer";

export default function TermsPrivacy() {
  return (
    <>
      <Navbar />
      <div className="px-4 md:px-20 py-10 text-gray-800 bg-white w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Terms of Service & Privacy Policy
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Last updated: June 17, 2025
        </p>
        <p className="text-center mb-10 text-gray-600">
          Please read these terms and conditions carefully before using our services.
          These documents govern your use of our platform and outline how we collect,
          use, and protect your information.
        </p>

        {/* Table of Contents */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <h3 className="font-semibold mb-2">Terms of Service</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-indigo-600">
              <li>1. Acceptance of Terms</li>
              <li>2. User Registration</li>
              <li>3. User Obligations</li>
              <li>4. Intellectual Property Rights</li>
              <li>5. Service Modifications</li>
              <li>6. Termination</li>
              <li>7. Limitation of Liability</li>
              <li>8. Governing Law</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Privacy Policy</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-indigo-600">
              <li>1. Information We Collect</li>
              <li>2. How We Use Your Information</li>
              <li>3. Information Sharing</li>
              <li>4. Data Security</li>
              <li>5. Cookies</li>
              <li>6. Your Rights</li>
              <li>7. Changes to Privacy Policy</li>
              <li>8. Contact Information</li>
            </ul>
          </div>
        </div>

        {/* Terms of Service */}
        <section className="space-y-6 mb-12">
          <h2 className="text-xl font-semibold">Terms of Service</h2>
          <div>
            <h3 className="font-medium">1. Acceptance of Terms</h3>
            <p className="text-sm text-gray-700">
              By accessing and using this website, you accept and agree to be bound by
              the terms and provision of this agreement.
            </p>
          </div>
          <div>
            <h3 className="font-medium">2. User Registration</h3>
            <p className="text-sm text-gray-700">
              Users must provide accurate and complete information during registration.
              You are responsible for maintaining the confidentiality of your account.
            </p>
          </div>
          <div>
            <h3 className="font-medium">3. User Obligations</h3>
            <p className="text-sm text-gray-700">
              Users agree to use the service only for lawful purposes and in accordance
              with these terms. You must not interfere with the proper working of the platform.
            </p>
          </div>
          <div>
            <h3 className="font-medium">4. Intellectual Property Rights</h3>
            <p className="text-sm text-gray-700">
              All content and functionality are owned by us and protected by intellectual
              property laws.
            </p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Privacy Policy</h2>
          <div>
            <h3 className="font-medium">1. Information We Collect</h3>
            <p className="text-sm text-gray-700">
              We collect information that you provide directly to us, including when you
              create an account, make a purchase, or contact us for support.
            </p>
          </div>
          <div>
            <h3 className="font-medium">2. How We Use Your Information</h3>
            <p className="text-sm text-gray-700">
              We use your information to provide, maintain, and improve our services and
              to communicate with you.
            </p>
          </div>
          <div>
            <h3 className="font-medium">3. Information Sharing</h3>
            <p className="text-sm text-gray-700">
              We do not sell your personal data. We only share it as described in this
              policy, and only when required.
            </p>
          </div>
          <div>
            <h3 className="font-medium">4. Data Security</h3>
            <p className="text-sm text-gray-700">
              We implement proper security measures to protect your data from unauthorized
              access or disclosure.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <div className="mt-10 p-6 bg-gray-50 rounded-md">
          <h4 className="font-semibold mb-2">Questions or Concerns?</h4>
          <p className="text-sm text-gray-700">
            If you have any questions about these Terms of Service or Privacy Policy,
            please contact us at:
          </p>
          <a
            href="mailto:support@example.com"
            className="text-indigo-600 text-sm underline"
          >
            edunova@gmail.com
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}
