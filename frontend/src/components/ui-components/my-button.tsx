import Link from "next/link";
import React from "react";

interface MyButtonProps {
  title: string;
  onClick?: () => void;
  link?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const MyButton = ({
  title,
  onClick,
  link,
  type,
  disabled,
}: MyButtonProps) => {
  if (link) {
    return (
      <Link href={link}>
        <button className="bg-black w-full text-white p-2 rounded-md text-md hover:cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-300">
          {title}
        </button>
      </Link>
    );
  }
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`bg-black text-white p-2 rounded-md text-md  transition-all duration-300 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:cursor-pointer hover:opacity-80 hover:scale-105"
      }`}
    >
      {title}
    </button>
  );
};
