import React from "react";
import { FaStar } from "react-icons/fa";

const experts = [
  {
    name: "David Wilson",
    title: "Senior Software Engineer",
    rating: 4.9,
    reviews: 128,
    image: "/experts/david.jpg",
  },
  {
    name: "Lisa Zhang",
    title: "UX Design Lead",
    rating: 4.8,
    reviews: 96,
    image: "/experts/lisa.jpg",
  },
  {
    name: "James Cooper",
    title: "Data Scientist",
    rating: 4.7,
    reviews: 84,
    image: "/experts/james.jpg",
  },
  {
    name: "Maria Garcia",
    title: "Product Manager",
    rating: 4.9,
    reviews: 112,
    image: "/experts/maria.jpg",
  },
];

export default function MentorSection() {
  return (
    <section className="bg-white py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
        Learn from Industry Experts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {experts.map((expert, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg text-center"
          >
            <img
              src={expert.image}
              alt={expert.name}
              className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {expert.name}
            </h3>
            <p className="text-gray-500 text-sm mb-3">{expert.title}</p>

            <div className="flex justify-center items-center text-yellow-500 text-sm mb-4">
              <FaStar className="mr-1" />
              <span className="text-gray-800 font-medium">
                {expert.rating}
              </span>
              <span className="text-gray-500 ml-1">
                ({expert.reviews} reviews)
              </span>
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition text-sm">
              Book Session
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
