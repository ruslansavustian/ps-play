import { useApp } from "@/contexts/AppProvider";
import { Account } from "@/types";
import React from "react";

export const AccountCard = ({ account }: { account: Account }) => {
  const { deleteAccount } = useApp();

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        `Удалить аккаунт ${account.platformPS4 ? "PS4" : "PS5"} "${
          account.games
        }"?`
      )
    ) {
      deleteAccount(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{account.platformPS4 ? "PS4" : "PS5"}</span>
          <h4 className="text-lg font-semibold text-gray-900">
            {account.games.name}
          </h4>
          {/* {account.isVerified && (
            <span className="text-green-500 text-sm">✓ Verified</span>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <p className="text-xs text-gray-400 mt-3">
          Создано: {new Date(account.created || "").toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
