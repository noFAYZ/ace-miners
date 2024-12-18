import React from "react";

const FormInput = React.forwardRef(
  (
    {
      label,
      placeholder,
      error,
      prefix,
      suffix,
      className = "",
      containerClassName = "",
      type = "text",
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const id = React.useId();

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {prefix}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`
            w-full
            px-3
            py-2
            bg-white
            border
            rounded-lg
            outline-none
            transition-colors
            duration-200
            ${prefix ? "pl-8" : ""}
            ${suffix ? "pr-8" : ""}
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            }
            ${
              disabled
                ? "opacity-50 cursor-not-allowed bg-gray-100"
                : "hover:border-gray-400"
            }
            ${className}
          `}
            {...props}
          />

          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {suffix}
            </div>
          )}

          {error && (
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
