import React from "react";
import Footer from "./homePage Components/Footer";

const AboutPage = () => {
  return (
    <>
      <div className="font-sans text-gray-800">
        <section className="relative bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-50 py-20 px-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-200 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative max-w-6xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Empowering Learners,<br />Enabling Educators
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Delivering accessible, high-quality education — anytime, anywhere
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
              {[
                { number: "100K+", label: "Active Learners" },
                { number: "1,000+", label: "Expert Instructors" },
                { number: "2,500+", label: "Quality Courses" },
                { number: "150+", label: "Countries Reached" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-20 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img
                src="https://media.istockphoto.com/id/1183803820/photo/group-of-school-children-with-teacher-on-field-trip-in-nature-learning-science.jpg?s=612x612&w=0&k=20&c=bVUAikVLGkCoJ21g7WTlN1wD6etDwDBcp5LX_Rq7UOI="
                alt="Learning Journey"
                className="relative rounded-3xl w-full shadow-2xl"
              />
            </div>
            <div className="lg:w-1/2">
              <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                A Journey of <span className="text-emerald-600">Transformation</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Since our inception, we've aimed to democratize education by bridging the gap between students and top-tier educators. Through innovative tools, engaging content, and personalized mentoring, we've created a platform where anyone can learn and grow.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Trusted Platform</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Global Reach</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Expert Faculty</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6 md:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                What We Stand For
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission & Values</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Guided by our core principles, we're building the future of education
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "Accessible Learning",
                  description: "Making quality education available for everyone, everywhere.",
                  color: "from-emerald-400 to-emerald-600"
                },
                {
                  icon: "🚀",
                  title: "Instructor Empowerment",
                  description: "Helping educators succeed with tools, reach, and monetization.",
                  color: "from-teal-400 to-emerald-600"
                },
                {
                  icon: "🤝",
                  title: "Community Growth",
                  description: "Building a supportive ecosystem for peer-to-peer learning.",
                  color: "from-emerald-400 to-teal-600"
                }
              ].map((value, idx) => (
                <div key={idx} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="text-5xl mb-4">{value.icon}</div>
                    <h3 className="font-bold text-xl mb-3 text-gray-800">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Core Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The passionate individuals driving our mission forward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ayesha Rahman",
                role: "Founder & CEO",
                img: "https://i.pravatar.cc/300?img=11",
                bio: "Visionary leader with 15+ years in EdTech"
              },
              {
                name: "Rohan Mehta",
                role: "Chief Technology Officer",
                img: "https://i.pravatar.cc/300?img=12",
                bio: "Tech innovator building scalable learning solutions"
              },
              {
                name: "Nisha Kapoor",
                role: "Head of Learning Experience",
                img: "https://i.pravatar.cc/300?img=13",
                bio: "Expert in curriculum design and pedagogy"
              }
            ].map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img 
                    className="relative w-32 h-32 rounded-full border-4 border-white shadow-xl" 
                    src={member.img} 
                    alt={member.name} 
                  />
                </div>
                <h4 className="font-bold text-xl mb-1">{member.name}</h4>
                <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Culture Gallery */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-6 md:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                Our Culture
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Inside the Learning Culture</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Where innovation meets education
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "https://media.istockphoto.com/id/1788132806/photo/startup-co-working-space.jpg?s=612x612&w=0&k=20&c=5b3pbg4fEM_mG_Qi0iOPc27t-6HP2g2Lh28XTYYfOq8=",
                "https://media.istockphoto.com/id/1146143664/photo/business-meetup-millennials-pacing-technologies.jpg?s=612x612&w=0&k=20&c=ZIxFTzBEOJyKn6Box-xiUNRbnM6Ou6_NHSiq3Bv_QNA=",
                "https://media.istockphoto.com/id/1443627942/photo/teacher-greeting-student-in-classroom.jpg?s=612x612&w=0&k=20&c=iDOF8-TJsFmcrRPuMEeDItfHflR_RdFDip8-5AFS-qs=",
                "https://media.istockphoto.com/id/1318360204/photo/team-meeting-and-brainstorming-in-modern-office.jpg?s=612x612&w=0&k=20&c=b31BXJBrkt3F8ivuOlCqpymMkuG8P_SoVBBa1DVtbQs=",
              ].map((src, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={src}
                      alt="Campus"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-gradient-to-r from-emerald-600 to-teal-600 py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-emerald-50 text-lg mb-8">
              Join thousands of learners and educators transforming the future of education
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Explore Courses
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300">
                Become an Instructor
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default React.memo(AboutPage);