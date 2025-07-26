import React from "react";

const communities = [
  {
    title: "Web Development",
    members: "15,234 members",
    image: "https://media.istockphoto.com/id/1430393066/photo/creative-startup-and-team-webinar-on-laptop-for-professional-internet-communication-in-office.jpg?s=612x612&w=0&k=20&c=mCwrbA9A1u4ezzncWOFOBx0NV3sykfx84ZRM_HdkjGw=",
  },
  {
    title: "Data Science",
    members: "12,456 members",
    image: "https://media.istockphoto.com/id/1455300089/photo/data-science-specialists-working-at-office-together.jpg?s=612x612&w=0&k=20&c=jBUGB7l3IVtiFuhTmuviWkSuBxJbYQqXFrI9smSY_Ec=",
  },
  {
    title: "UX Design",
    members: "10,789 members",
    image: "https://media.istockphoto.com/id/1218511457/photo/top-view-asian-ux-developer-and-ui-designer-brainstorming-about-mobile-app-interface.jpg?s=612x612&w=0&k=20&c=Py1-O62Y4vFzJ_BoMPdRmr8h-bqN1gcFZy6tWWSw0JI=",
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