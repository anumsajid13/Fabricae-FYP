"use client";

import React from "react";

interface DropdownProps {
  id: string;
  options: string[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  options,
  value,
  onChange,
  label,
  className,
}) => {
  return (
    <div className={`relative ${className || ""}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-white mb-2 text-center font-medium"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full  text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-customPurple shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-neutral-900 text-white hover:bg-neutral-700"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
