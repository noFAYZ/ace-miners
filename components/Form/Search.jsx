import TWM from "@/helper/twMerge";
import React from "react";
import { IconSearch } from "../Icon";

export const Search = ({ className, ...rest }) => {
  return (
    <div className="relative">
      <input className={TWM("input pr-11", className)} type="text" {...rest} />
      <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-200">
        <IconSearch className="w-6"></IconSearch>
      </button>
    </div>
  );
};
