import TWM from "@/helper/twMerge";
import React from "react";

export const Button = ({ children, className, kind, ...rest }) => {
  let defaultClass = "";
  if ((kind = "pill")) {
    defaultClass =
      "rounded-full bg-gray-600 px-5 py-3 text-gray-200 font-500 text-14";
  }
  if ((kind = "outline-primary")) {
    defaultClass =
      "rounded-full px-5 py-3 text-white font-500 text-14 border border-primary hover:bg-primary";
  }
  return (
    <button className={TWM(defaultClass, className)} {...rest}>
      {children}
    </button>
  );
};
