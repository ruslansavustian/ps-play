"use client";
import React, { useEffect } from "react";

import HomeGameCard from "@/components/ui-components/home-game-card";

import { useTranslations } from "next-intl";
import { PSLoader } from "@/components/ui-components/ps-loader";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import {
  fetchGames,
  selectGames,
  selectGamesLoading,
} from "@/stores(REDUX)/slices/games-slice";

export const HomeGamesTable = () => {
  const games = useAppSelector(selectGames);
  const gamesLoading = useAppSelector(selectGamesLoading);
  const dispatch = useAppDispatch();
  const t = useTranslations("games");
  useEffect(() => {
    if (games.length === 0) {
      dispatch(fetchGames());
    }
  }, [dispatch, games]);

  if (gamesLoading) {
    return <PSLoader />;
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
