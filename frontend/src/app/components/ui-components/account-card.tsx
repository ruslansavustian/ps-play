import { useApp } from "@/contexts/AppProvider";
import { Account, GamePlatform, AccountStatus } from "@/types";
import React from "react";

export const AccountCard = ({ account }: { account: Account }) => {
  const { deleteAccount } = useApp();

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        `Delete ${account.platform.toUpperCase()} account "${
          account.username
        }"?`
      )
    ) {
      deleteAccount(id);
    }
  };

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.AVAILABLE:
        return "text-green-600 bg-green-100";
      case AccountStatus.SOLD:
        return "text-red-600 bg-red-100";
      case AccountStatus.RESERVED:
        return "text-yellow-600 bg-yellow-100";
      case AccountStatus.PENDING:
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPlatformIcon = (platform: GamePlatform) => {
    switch (platform) {
      case GamePlatform.PLAYSTATION:
        return "🎮";
      case GamePlatform.XBOX:
        return "🎮";
      case GamePlatform.STEAM:
        return "🚂";
      case GamePlatform.EPIC_GAMES:
        return "🎯";
      case GamePlatform.NINTENDO:
        return "🕹️";
      default:
        return "🎮";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getPlatformIcon(account.platform)}</span>
          <h4 className="text-lg font-semibold text-gray-900">
            {account.username}
          </h4>
          {account.isVerified && (
            <span className="text-green-500 text-sm">✓ Verified</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              account.status
            )}`}
          >
            {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
          </span>
          {account.id && (
            <div className="flex space-x-1">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm hover:cursor-pointer"
                onClick={() => console.log("Edit account:", account.id)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:text-red-800 text-sm hover:cursor-pointer"
                onClick={() => handleDelete(account.id!)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Platform:</span>{" "}
          {account.platform.replace("_", " ").toUpperCase()}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Price:</span>{" "}
          <span className="text-green-600 font-semibold">${account.price}</span>
        </p>
        {account.level && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Level/Rank:</span> {account.level}
          </p>
        )}
        {account.region && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Region:</span> {account.region}
          </p>
        )}
      </div>

      {account.gamesLibrary && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Games:</span> {account.gamesLibrary}
        </p>
      )}

      {account.description && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Description:</span>{" "}
          {account.description}
        </p>
      )}

      <p className="text-xs text-gray-400 mt-3">
        Created: {new Date(account.createdAt || "").toLocaleDateString()}
      </p>
    </div>
  );
};
