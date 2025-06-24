import React from "react";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 w-full">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-white text-xl font-bold mb-2">EduFlow</h3>
          <p className="mb-4 text-sm">
            Transforming lives through expert-led online education.
          </p>
          <div className="flex space-x-4">
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaLinkedinIn className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="text-white font-semibold mb-2">Courses</h4>
          <ul className="space-y-1 text-sm">
            <li>Web Development</li>
            <li>Data Science</li>
            <li>UX Design</li>
            <li>Business</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="text-white font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-sm">
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Press</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="text-white font-semibold mb-2">Resources</h4>
          <ul className="space-y-1 text-sm">
            <li>Help Center</li>
            <li>Terms</li>
            <li>Privacy</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      {/* Bottom text */}
      <p className="text-center text-sm text-gray-500 pb-6">
        © 2025 EduNova. All rights reserved.
      </p>
    </footer>
  );
}
