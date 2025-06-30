import React from "react";

const communities = [
  {
    title: "Web Development",
    members: "15,234 members",
    image: "/community/web.jpg",
  },
  {
    title: "Data Science",
    members: "12,456 members",
    image: "/community/data.jpg",
  },
  {
    title: "UX Design",
    members: "10,789 members",
    image: "/community/ux.jpg",
  },
];

function CommunitySection() {
  return (
    <section className="bg-white py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">
        Join Our Learning Community
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {communities.map((com, idx) => (
          <div
            key={idx}
            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <img
              src={com.image}
              alt={com.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {com.title}
              </h3>
              <p className="text-sm text-gray-500">{com.members}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


export default React.memo(CommunitySection)