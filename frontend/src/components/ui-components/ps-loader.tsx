"use client";

import React from "react";

interface PSLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  showText?: boolean;
}

export const PSLoader: React.FC<PSLoaderProps> = ({
  size = "md",
  showText = true,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 h-full min-h-screen">
      {/* Логотип с анимацией */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Вращающееся кольцо */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>

        {/* Логотип PS в центре */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">PS</span>
          </div>
        </div>
      </div>

      {/* Текст */}
      {showText && (
        <div className="text-center">
          <h2
            className={`${textSizeClasses[size]} font-bold text-gray-800 mb-1`}
          >
            PS Play
          </h2>
        </div>
      )}
    </div>
  );
};
