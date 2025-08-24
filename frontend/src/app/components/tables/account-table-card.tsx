import { Account, GamePlatform, AccountStatus } from "@/types";
import React from "react";

export const AccountTableCard = ({ account }: { account: Account }) => {
  const getPlatformIcon = (platform: GamePlatform) => {
    const icons = {
      [GamePlatform.PLAYSTATION]: "🎮",
      [GamePlatform.XBOX]: "🎯",
      [GamePlatform.STEAM]: "🚂",
      [GamePlatform.EPIC_GAMES]: "🚀",
      [GamePlatform.NINTENDO]: "🎌",
      [GamePlatform.BATTLE_NET]: "⚔️",
      [GamePlatform.ORIGIN]: "🌟",
      [GamePlatform.UBISOFT]: "🎪",
    };
    return icons[platform] || "🎮";
  };

  const getStatusColor = (status: AccountStatus) => {
    const colors = {
      [AccountStatus.AVAILABLE]: "bg-green-100 text-green-800 border-green-200",
      [AccountStatus.SOLD]: "bg-red-100 text-red-800 border-red-200",
      [AccountStatus.RESERVED]:
        "bg-yellow-100 text-yellow-800 border-yellow-200",
      [AccountStatus.PENDING]: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPlatform = (platform: GamePlatform) => {
    return platform
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {getPlatformIcon(account.platform)}
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {account.username}
              </h3>
              <p className="text-sm text-gray-600">
                {formatPlatform(account.platform)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${account.price}
            </div>
            {account.isVerified && (
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                Verified
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              account.status
            )}`}
          >
            {account.status.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {account.level && (
            <div>
              <span className="text-gray-500">Level:</span>
              <div className="font-medium text-gray-900">{account.level}</div>
            </div>
          )}
          {account.region && (
            <div>
              <span className="text-gray-500">Region:</span>
              <div className="font-medium text-gray-900">{account.region}</div>
            </div>
          )}
        </div>

        {/* Description */}
        {account.description && (
          <div>
            <span className="text-sm text-gray-500">Description:</span>
            <p className="text-sm text-gray-700 mt-1 line-clamp-3">
              {account.description}
            </p>
          </div>
        )}

        {/* Games Library */}
        {account.gamesLibrary && (
          <div>
            <span className="text-sm text-gray-500">Games:</span>
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
              {account.gamesLibrary}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div>
              <span>Created:</span>
              <span className="ml-1 font-medium">
                {formatDate(account.createdAt)}
              </span>
            </div>
            <div>
              <span>Updated:</span>
              <span className="ml-1 font-medium">
                {formatDate(account.updatedAt)}
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
            View Details
          </button>
          {account.status === AccountStatus.AVAILABLE && (
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium">
              Purchase
            </button>
          )}
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
            ♡
          </button>
        </div>
      </div>
    </div>
  );
};
