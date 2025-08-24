import { Account } from "@/types";
import React from "react";

export const AccountTableCard = ({ account }: { account: Account }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎮</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {account.games}
              </h3>
              <p className="text-sm text-gray-600">{account.platform}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${account.pricePS}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4 space-y-4">
        {/* Prices Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Цена PS:</span>
            <div className="font-medium text-green-600">${account.pricePS}</div>
          </div>
          <div>
            <span className="text-gray-500">Цена PS4:</span>
            <div className="font-medium text-green-600">
              ${account.pricePS4}
            </div>
          </div>
        </div>

        {/* Games Library */}
        {account.games && (
          <div>
            <span className="text-sm text-gray-500">Игры:</span>
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {account.games}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div>
              <span>Создано:</span>
              <span className="ml-1 font-medium">
                {formatDate(account.created)}
              </span>
            </div>
          </div>
          {account.id && <div className="text-gray-400">ID: #{account.id}</div>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-white border-t border-gray-100">
        <div className="flex space-x-3">
          <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
            Просмотр
          </button>

          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
            ♡
          </button>
        </div>
      </div>
    </div>
  );
};
