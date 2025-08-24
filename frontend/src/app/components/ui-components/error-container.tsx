import React from "react";
import { AlertTriangle } from "lucide-react";
export const ErrorContainer = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center gap-2 text-red-500 p-3 bg-red-50 rounded-xl text-center justify-center text-sm max-w-md mx-auto">
      <AlertTriangle className="w-4 h-4" />
      {message}
    </div>
  );
};
