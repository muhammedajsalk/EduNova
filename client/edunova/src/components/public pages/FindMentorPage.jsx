import React, { useState } from "react";
import Footer from "./homePage Components/Footer";
import UserContext from "../../userContext";
import { useContext } from "react";

const mentorsData = [
  {
    name: "Sarah Johnson",
    role: "Senior Product Manager",
    company: "Tech Solutions Inc",
    tags: ["Product Management", "UX Design"],
    description:
      "10+ years experience in product development and user experience design",
    price: 120,
    rating: 4.8,
    available: "Mon 2-4 PM, Wed 1-3 PM",
    avatar: "https://via.placeholder.com/80x80?text=SJ",
  },
  {
    name: "Michael Chen",
    role: "Senior Software Engineer",
    company: "Innovation Labs",
    tags: ["Software Development", "Leadership"],
    description: "Full-stack developer with focus on scalable architecture",
    price: 150,
    rating: 4.9,
    available: "Tue 3-5 PM, Thu 2-4 PM",
    avatar: "https://via.placeholder.com/80x80?text=MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Data Science Lead",
    company: "Analytics Co",
    tags: ["Data Science", "Machine Learning"],
    description:
      "Specializing in data-driven decision making and AI implementation",
    price: 135,
    rating: 4.7,
    available: "Wed 1-3 PM, Fri 2-4 PM",
    avatar: "https://via.placeholder.com/80x80?text=ER",
  },
  {
    name: "David Kim",
    role: "Marketing Director",
    company: "Growth Ventures",
    tags: ["Marketing"],
    description: "Digital marketing expert with focus on growth strategies",
    price: 110,
    rating: 4.6,
    available: "Mon 3-4 PM, Thu 1-3 PM",
    avatar: "https://via.placeholder.com/80x80?text=DK",
  },
  {
    name: "Lisa Thompson",
    role: "UX Research Lead",
    company: "Design Studio",
    tags: ["UX Design", "Research"],
    description: "User experience researcher with focus on accessibility",
    price: 140,
    rating: 4.8,
    available: "Tue 2-4 PM, Fri 3-5 PM",
    avatar: "https://via.placeholder.com/80x80?text=LT",
  },
  {
    name: "James Wilson",
    role: "Engineering Manager",
    company: "Tech Giants",
    tags: ["Software Development", "Leadership"],
    description: "Engineering leader with focus on team development",
    price: 160,
    rating: 4.8,
    available: "Wed 3-5 PM, Thu 4-6 PM",
    avatar: "https://via.placeholder.com/80x80?text=JW",
  },
];

const topics = [
  "Software Development",
  "Product Management",
  "UX Design",
  "Data Science",
  "Marketing",
  "Business Strategy",
  "Leadership",
  "Career Growth",
];

const FindMentorPage = () => {
  const [selectedTopic, setSelectedTopic] = useState("Software Development");
  const { user } = useContext(UserContext);

  return (
    <>
      <div className="px-4 md:px-20 py-10 font-sans mt-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Mentor</h1>
          <p className="text-gray-600 mb-6">
            Connect with industry experts who can guide your journey
          </p>
          <div className="max-w-md mx-auto flex items-center border px-3 py-2 rounded shadow-sm mb-6">
            <input
              type="text"
              placeholder="Search mentors by name or expertise"
              className="w-full outline-none"
            />
            <button className="ml-2 text-indigo-600 hover:underline">Filters</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {topics.map((topic) => (
            <button
              key={topic}
              className={`px-4 py-2 text-sm rounded-full ${selectedTopic === topic
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
                }`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {mentorsData
            .filter((mentor) => mentor.tags.includes(selectedTopic))
            .map((mentor, i) => (
              <div key={i} className="border rounded-lg p-5 shadow-sm">
                <div className="flex items-center mb-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{mentor.name}</h4>
                    <p className="text-sm text-gray-500">
                      {mentor.role} <br />
                      {mentor.company}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mb-3">
                  {mentor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-3">{mentor.description}</p>
                <p className="text-sm font-semibold mb-1">${mentor.price}/hour</p>
                <p className="text-sm text-gray-500 mb-4">
                  Available: {mentor.available}
                </p>
                {user?.role === "user" && (
                  <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                    Book Session
                  </button>
                )}
              </div>
            ))}
        </div>

        <div className="flex justify-between text-sm items-center px-2">
          <p className="text-gray-500">Showing 1-6 of 24 mentors</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                className={`w-8 h-8 rounded-full ${n === 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default React.memo(FindMentorPage)
