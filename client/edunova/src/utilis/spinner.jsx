const MultiRingLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute w-full h-full border-4 border-emerald-200 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-emerald-600 rounded-full animate-spin border-t-transparent"></div>
        
        {/* Inner ring */}
        <div className="absolute w-14 h-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute w-14 h-14 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-emerald-500 rounded-full animate-spin border-b-transparent [animation-direction:reverse]"></div>
      </div>
    </div>
  );
};

export default MultiRingLoader;
