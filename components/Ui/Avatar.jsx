import TWM from "@/helper/twMerge";
import React from "react";
import { IconVerificationBadge } from "../Icon";

export const Avatar = ({
  src,
  className,
  verified = false,
  verificationIconClass,
}) => {
  return (
    <div className="relative">
      <img
        src={src}
        className={TWM(
          "rounded-full w-14 h-14 object-cover object-center",
          className
        )}
        alt=""
      />
      {verified && (
        <div
          className={TWM(
            "text-primary h-6 w-6 absolute bottom-0 right-0",
            verificationIconClass
          )}
        >
          <IconVerificationBadge></IconVerificationBadge>
        </div>
      )}
    </div>
  );
};
