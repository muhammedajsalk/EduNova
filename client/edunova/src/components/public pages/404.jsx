import React from 'react';
import { Link } from 'react-router-dom';

const NotFound404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <img 
        src="https://media.istockphoto.com/id/626103976/photo/astronaut-in-outer-space.jpg?s=612x612&w=0&k=20&c=4qPEaxKEgv8Gbxn3gU-Acp90ztafahEes8Slt3loabM=" 
        alt="Earth from space"
        className="w-full max-w-md rounded-lg shadow-md mb-6"
      />

      <h2 className="text-sm text-gray-500 mb-1">Houston, we have a problem!</h2>

      <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>

      <p className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</p>

      <p className="text-gray-500 mb-6">
        The page you’re looking for has floated away into space.
      </p>

      <div className="w-full max-w-sm mx-auto mb-6">
        <input
          type="text"
          placeholder="Search our universe..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex gap-4 mb-8">
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Return Home
        </Link>
        <button className="px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100">
          Report Problem
        </button>
      </div>

      <div className="text-sm text-gray-500 space-x-4">
        <Link to="/" className="hover:underline text-blue-500">Home</Link>
        <Link to="/products" className="hover:underline text-blue-500">Products</Link>
        <Link to="/about" className="hover:underline text-blue-500">About Us</Link>
        <Link to="/contact" className="hover:underline text-blue-500">Contact</Link>
      </div>
    </div>
  );
};

export default React.memo(NotFound404)
