import React, { useCallback, useState } from "react";
import { ArrowDown } from "lucide-react";

interface InputSelectorProps {
  label?: string;
  labelStyle?: string;
  classNames?: string;
  className?: string;
  placeholderName?: string;
  options: { id: string; name: string }[];
  value: string;
  IconSelector?: React.ComponentType;
  name: string;
  onChange: (e: { target: { name: string; value: string } }) => void; // Updated type
}

const InputSelector: React.FC<InputSelectorProps> = ({
  label,
  className,
  classNames,
  options,
  value,
  placeholderName,
  labelStyle,
  IconSelector,
  name, // We use this to pass the field name to onChange
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle dropdown item selection
  const handleOptionClick = useCallback(
    (selectedValue: string) => {
      // Call onChange with the updated structure to pass the name and value
      onChange({ target: { name, value: selectedValue } });
      setIsOpen(false); // Close dropdown after selection
    },
    [name, onChange]
  );

  return (
    <div className="relative flex flex-col gap-2 bg-white">
      {/* Render optional icon */}

      <label className={` ${labelStyle} text-[14px]`}>{label && label}</label>

      {/* Dropdown display with current selection */}
      <div
        className={`border border-gray-500  bg-[#F3F3F3] ${className} rounded-md py-4 cursor-pointer flex  items-center `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {IconSelector && <IconSelector />}
        </div>
        <span
          style={{ fontWeight: "600" }}
          className={`text-[12px] ${className} font-medium text-[#757575] ml-2 w-full`}
        >
          {options.find((option) => option.id === value)?.name ||
            placeholderName}
        </span>
        {/* Optional icon for dropdown */}
        <ArrowDown className="mr-4" />
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <ul
          className={`absolute ${classNames} top-[82px] border border-gray-300 rounded-md bg-white w-full z-50`}
        >
          {options.map((option) => (
            <li
              key={option.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option.id)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputSelector;
