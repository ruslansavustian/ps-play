"use client";
import React, { useEffect } from "react";
import { useApp } from "@/contexts/AppProvider";
import HomeGameCard from "@/components/ui-components/home-game-card";
import { Loader } from "@/components/ui-components/loader";
import { useTranslations } from "next-intl";

export const HomeGamesTable = () => {
  const { games, gamesLoading, fetchGames } = useApp();
  const t = useTranslations("games");
  useEffect(() => {
    if (!games) {
      fetchGames();
    }
  }, [fetchGames, games]);

  if (gamesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full mt-10">
      <h1 className="font-bold text-gray-900 text-center text-3xl">
        {t("games")}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
        {games?.map((game) => (
          <HomeGameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};
