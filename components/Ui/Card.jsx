import TWM from "@/helper/twMerge";
import React from "react";

export const Card = ({ className, children }) => {
  return (
    <div className={TWM("p-4 bg-gray-400 rounded-4xl", className)}>
      {children}
    </div>
  );
};
