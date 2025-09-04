import { Game } from "@/types";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { paths } from "@/utils/paths";

interface HomeGameCardProps {
  game: Game;
}

export default function HomeGameCard({ game }: HomeGameCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`${paths.games}/${game.id}`);
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-gray-900 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
        {game.photoUrl ? (
          <Image
            src={game.photoUrl}
            alt={game.name}
            height={300}
            width={300}
            priority={true}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-500 font-medium">No Image</p>
            </div>
          </div>
        )}

        {/* Overlay для названия игры */}
        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl" />

        {/* Название игры внизу */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-2 rounded-b-2xl transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-medium text-gray-900 text-center truncate">
            {game.name}
          </p>
        </div>
      </div>
    </div>
  );
}
