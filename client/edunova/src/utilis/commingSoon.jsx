import React from 'react';

const ComingSoonPage = () => {
  return (
    <>
      <style jsx>{`
        @keyframes flip {
          0%, 100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes pencil-write {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
          }
          25% {
            transform: translateX(10px) translateY(10px) rotate(-45deg);
          }
          50% {
            transform: translateX(-10px) translateY(-10px) rotate(-45deg);
          }
          75% {
            transform: translateX(5px) translateY(5px) rotate(-45deg);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(-45deg);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-flip {
          animation: flip 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }

        .animate-pencil {
          animation: pencil-write 2s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4 overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-500"></div>
          <div className="absolute bottom-20 left-20 w-28 h-28 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-1000"></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Main Icon Container */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Central Book Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Book layers */}
                <div className="w-24 h-28 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-md shadow-2xl transform rotate-3 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-24 h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-md shadow-xl transform -rotate-3 animate-pulse animation-delay-200"></div>
                <div className="absolute top-0 left-0 w-24 h-28 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-md shadow-lg animate-pulse animation-delay-400"></div>
                
                {/* Book pages with flip animation */}
                <div className="absolute top-2 left-2 right-2 bottom-2 bg-white rounded-sm animate-flip shadow-inner"></div>
                
                {/* Graduation cap */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="relative animate-bounce">
                    <div className="w-16 h-1 bg-gray-800 shadow-md"></div>
                    <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[20px] border-b-gray-800 absolute -top-5 left-1/2 transform -translate-x-1/2"></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full absolute -top-7 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                    {/* Tassel */}
                    <div className="absolute -top-6 left-1/2 w-8 h-0.5 bg-emerald-600 transform -translate-x-1/2 origin-left animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pencil */}
            <div className="absolute top-1/2 right-0 animate-pencil">
              <div className="relative">
                <div className="w-16 h-2 bg-teal-500 rounded-full shadow-md"></div>
                <div className="absolute right-0 top-0 w-0 h-0 border-l-[8px] border-l-teal-500 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
                <div className="absolute left-0 top-0 w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
            </div>

            {/* Floating study elements */}
            <div className="absolute -top-4 -right-4 animate-float">
              <div className="w-8 h-8 bg-emerald-400 rounded-full opacity-70 shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">A+</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 animate-float animation-delay-1000">
              <div className="w-10 h-10 bg-teal-400 rounded-lg opacity-70 shadow-lg flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
            </div>
            <div className="absolute top-0 -left-8 animate-float animation-delay-500">
              <div className="w-6 h-6 bg-green-400 rounded-full opacity-70 shadow-lg"></div>
            </div>

            {/* Sparkles */}
            <div className="absolute top-1/4 right-1/4 text-emerald-400 animate-sparkle">✦</div>
            <div className="absolute bottom-1/4 left-1/4 text-teal-400 animate-sparkle animation-delay-700">✦</div>
            <div className="absolute top-1/2 left-0 text-green-400 animate-sparkle animation-delay-400">✦</div>
          </div>

          {/* Text content */}
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-4 animate-pulse">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-2 font-semibold">
            Your Learning Journey Begins Here
          </p>

          {/* 👇 Added line here */}
          <p className="text-lg text-emerald-700 font-medium mb-6 animate-pulse">
            We’re currently working on it 🚀
          </p>

          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            We're crafting an amazing educational experience just for you. Get ready to unlock your potential!
          </p>

          {/* Progress bar */}
          <div className="w-80 h-3 bg-gray-200 rounded-full mx-auto mb-2 overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-full animate-progress shadow-lg"></div>
          </div>
          <p className="text-sm text-gray-500 mb-8">Loading amazing content...</p>

          {/* Additional info */}
          <div className="mt-12 flex justify-center space-x-8 text-gray-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">100+</div>
              <div className="text-sm">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">50+</div>
              <div className="text-sm">Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">24/7</div>
              <div className="text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoonPage;
