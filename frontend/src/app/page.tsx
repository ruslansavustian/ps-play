"use client";

import { useApp } from "@/contexts/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Account } from "@/types";
import { AccountTable } from "../components/tables/account-table";

// Header Component
const Header = () => {
  const { currentUser, logout, isAuthenticated } = useApp();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Игровые аккаунты
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <>
              <span className="text-sm text-gray-700">
                Добро пожаловать, {currentUser?.name}
              </span>
              <Link
                href="/dashboard"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Панель управления
              </Link>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Выйти
              </button>
            </>
          </div>
        </div>
      </div>
    </header>
  );
};

// // Account Card Component
// const AccountCard = ({ account }: { account: Account }) => {
//   const getPlatformIcon = (platform: GamePlatform) => {
//     const icons = {
//       [GamePlatform.PLAYSTATION]: "🎮",
//       [GamePlatform.XBOX]: "🎯",
//       [GamePlatform.STEAM]: "🚂",
//       [GamePlatform.EPIC_GAMES]: "🚀",
//       [GamePlatform.NINTENDO]: "🎌",
//       [GamePlatform.BATTLE_NET]: "⚔️",
//       [GamePlatform.ORIGIN]: "🌟",
//       [GamePlatform.UBISOFT]: "🎪",
//     };
//     return icons[platform] || "🎮";
//   };

//   const getStatusColor = (status: AccountStatus) => {
//     const colors = {
//       [AccountStatus.AVAILABLE]: "bg-green-100 text-green-800",
//       [AccountStatus.SOLD]: "bg-red-100 text-red-800",
//       [AccountStatus.RESERVED]: "bg-yellow-100 text-yellow-800",
//       [AccountStatus.PENDING]: "bg-blue-100 text-blue-800",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center space-x-3">
//           <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">
//               {account.username}
//             </h3>
//             <p className="text-sm text-gray-600 capitalize">
//               {account.platform.replace("_", " ")}
//             </p>
//           </div>
//         </div>
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//             account.status
//           )}`}
//         >
//           {account.status}
//         </span>
//       </div>

//       <div className="mt-4 space-y-2">
//         {account.level && (
//           <p className="text-sm text-gray-600">
//             <span className="font-medium">Level:</span> {account.level}
//           </p>
//         )}
//         {account.region && (
//           <p className="text-sm text-gray-600">
//             <span className="font-medium">Region:</span> {account.region}
//           </p>
//         )}
//         {account.description && (
//           <p className="text-sm text-gray-600 line-clamp-2">
//             {account.description}
//           </p>
//         )}
//       </div>

//       <div className="mt-4 flex items-center justify-between">
//         <span className="text-2xl font-bold text-green-600">
//           ${account.price}
//         </span>
//         {account.isVerified && (
//           <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//             ✓ Verified
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

export default function Home() {
  const { loading } = useApp();

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen  container mx-auto">
      {/* <Header /> */}
      <main>
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Игровые аккаунты
              </h2>
              <p className="mt-2 text-gray-600">
                Просмотр и покупка проверенных игровых аккаунтов
              </p>
            </div>
          </div>
        </div>
        <AccountTable />
      </main>
    </div>
  );
}
