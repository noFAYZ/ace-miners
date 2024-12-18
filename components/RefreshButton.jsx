import { RotateCw } from "lucide-react";
import React, { useState } from "react";

const RefreshButton = ({ onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    setIsAnimating(true);
    try {
      await onClick();
    } finally {
      // Keep animation for at least 1 second for smoothness
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAnimating}
      className={`
        relative group
        px-5 py-1
        bg-primary
        hover:from-blue-600 hover:to-indigo-700
        rounded-full
        transform transition-all duration-200
        ${isAnimating ? null : "hover:scale-105"}
        shadow-lg hover:shadow-xl
        overflow-hidden
      `}
    >
      {/* Background pulse effect */}
      <div
        className={`
        absolute inset-0
        bg-white opacity-0 group-hover:opacity-20
        transform scale-x-0 group-hover:scale-x-100
        transition-transform duration-500
        origin-left
      `}
      />

      {/* Content container */}
      <div className="flex items-center gap-2">
        {/* Rotating icon */}
        <RotateCw
          className={`w-5 h-5 text-white transition-transform duration-700 
            ${isAnimating ? "animate-spin" : "group-hover:rotate-180"}`}
        />

        {/* Text */}
        <span
          className={`
          text-white text-14
          transition-all duration-200
          ${isAnimating ? "opacity-70" : "group-hover:tracking-wider"}
        `}
        >
          Refresh
        </span>
      </div>

      {/* Border gradient animation */}
      <div
        className={`
        absolute inset-0 border-2 border-white/30
        rounded-lg opacity-0 group-hover:opacity-100
        transition-opacity duration-200
      `}
      />

      {/* Loading dots */}
      {isAnimating && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </button>
  );
};

export default RefreshButton;
