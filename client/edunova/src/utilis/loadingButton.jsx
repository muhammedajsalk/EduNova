import React from "react";

const LoadingButton = ({ loading, children, className, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 
      ${loading ? "bg-emerald-500 cursor-not-allowed text-white" : ""}
      ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
