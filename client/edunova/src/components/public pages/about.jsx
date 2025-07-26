import React from "react";
import Footer from "./homePage Components/Footer";

const AboutPage = () => {
  return (
    <>
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
            src="https://media.istockphoto.com/id/1183803820/photo/group-of-school-children-with-teacher-on-field-trip-in-nature-learning-science.jpg?s=612x612&w=0&k=20&c=bVUAikVLGkCoJ21g7WTlN1wD6etDwDBcp5LX_Rq7UOI="
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
              <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://i.pravatar.cc/300?img=11" alt="Founder" />
              <h4 className="font-bold">Ayesha Rahman</h4>
              <p className="text-gray-500 text-sm">Founder & CEO</p>
            </div>
            <div>
              <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://i.pravatar.cc/300?img=12" alt="CTO" />
              <h4 className="font-bold">Rohan Mehta</h4>
              <p className="text-gray-500 text-sm">Chief Technology Officer</p>
            </div>
            <div>
              <img className="w-24 h-24 rounded-full mx-auto mb-3" src="https://i.pravatar.cc/300?img=13" alt="Head of Learning" />
              <h4 className="font-bold">Nisha Kapoor</h4>
              <p className="text-gray-500 text-sm">Head of Learning Experience</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-12 px-6 md:px-20">
          <h2 className="text-2xl font-semibold text-center mb-10">Inside the Learning Culture</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://media.istockphoto.com/id/1788132806/photo/startup-co-working-space.jpg?s=612x612&w=0&k=20&c=5b3pbg4fEM_mG_Qi0iOPc27t-6HP2g2Lh28XTYYfOq8=",
              "https://media.istockphoto.com/id/1146143664/photo/business-meetup-millennials-pacing-technologies.jpg?s=612x612&w=0&k=20&c=ZIxFTzBEOJyKn6Box-xiUNRbnM6Ou6_NHSiq3Bv_QNA=",
              "https://media.istockphoto.com/id/1443627942/photo/teacher-greeting-student-in-classroom.jpg?s=612x612&w=0&k=20&c=iDOF8-TJsFmcrRPuMEeDItfHflR_RdFDip8-5AFS-qs=",
              "https://media.istockphoto.com/id/1318360204/photo/team-meeting-and-brainstorming-in-modern-office.jpg?s=612x612&w=0&k=20&c=b31BXJBrkt3F8ivuOlCqpymMkuG8P_SoVBBa1DVtbQs=",
            ].map((src, idx) => (
              <div key={idx} className="w-full aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={src}
                  alt="Campus"
                  className="w-full h-full object-cover"
                />
              </div>
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
      <Footer />
    </>
  );
};

export default React.memo(AboutPage)
