import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="absolute w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin" />

        {/* Middle pulsing circle */}
        <div className="absolute w-16 h-16 bg-primary rounded-full animate-pulse" />

        {/* Loading text */}
        <div className="absolute -bottom-20 text-primary font-medium animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loader;
