"use client";
import React from "react";
import Link from "next/link";

import { paths } from "@/utils/paths";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl font-extrabold text-black mb-4">404</div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href={paths.accounts}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-800 transition"
        >
          Go to home page
        </Link>
      </div>
    </div>
  );
}
