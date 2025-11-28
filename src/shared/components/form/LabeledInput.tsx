import React, { useState } from "react";
import { clsx } from "clsx";

export interface LabeledInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  className,
  labelClassName,
  wrapperClassName,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let newVal = e.target.value.trim();
    if (type === "number" && newVal !== "") {
      newVal = String(parseFloat(newVal));
      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, value: newVal },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const actualType = type === "password" && showPassword ? "text" : type;

  return (
    <div
      className={clsx(
        "w-full flex flex-col",
        props.disabled && "transition-none opacity-50",
        wrapperClassName
      )}
    >
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            "flex items-center text-[12px] font-semibold px-3 py-2 text-[#343942]",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          type={actualType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          className={clsx(
            "w-full h-10 outline outline-[#cacdd0] text-base rounded-[12px] border border-[#e0e4ea] px-3 pr-10 py-2 shadow-xs",
            "transition-colors duration-150 ease-in-out",
            "placeholder:text-[17px] placeholder:font-normal placeholder:text-[#6c7482]",
            props.disabled
              ? "cursor-not-allowed focus-visible:outline-none"
              : "focus-visible:outline-[#cacdd0] hover:outline-[#cacdd0]",
            error &&
              "active:outline-red-500 focus-visible:outline-red-600 hover:outline-red-500",
            className
          )}
          {...props}
        />

        {/* Глазик */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7482] hover:text-[#343942]"
          >
            {showPassword ? (
              // Иконка "open eye"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.8"
                  d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                />
                <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
              </svg>
            ) : (
              // Иконка "closed eye"
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.8"
                  d="M3 3l18 18M10.58 10.58A3 3 0 0113.42 13.42M9.88 5.64A9.99 9.99 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.978 9.978 0 01-4.132 5.411M6.29 6.29C4.5 7.57 3.27 9.64 2.458 12c.878 2.796 2.874 5.05 5.438 6.3"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
