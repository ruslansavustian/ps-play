"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/contexts/AppProvider";
import { Loader } from "@/components/ui-components/loader";
import { HomeAccountsTable } from "@/components/tables/home-tables/home-accounts-table";
import { Account } from "@/types";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";

import { paths } from "@/utils/paths";
import { Link } from "@heroui/react";

const GamePage = () => {
  const {
    fetchGame,
    currentGame,
    gamesLoading,
    publicAccounts,
    fetchPublicAccounts,
  } = useApp();

  const [filteredAccounts, setFilteredAccounts] = useState<
    Account[] | undefined
  >(undefined);
  const params = useParams();
  const t = useTranslations();
  useEffect(() => {
    fetchGame(parseInt(params.gameId as string));
  }, [fetchGame, params.gameId]);

  useEffect(() => {
    if (!publicAccounts) {
      fetchPublicAccounts();
    }
  }, [fetchPublicAccounts, publicAccounts]);

  const handleFilterAccounts = useCallback(
    (currentGameId: number) => {
      const filteredAccounts = publicAccounts?.filter((account) => {
        const hasGameId =
          account.gameIds && account.gameIds.includes(currentGameId);

        return hasGameId;
      });
      setFilteredAccounts(filteredAccounts);
    },
    [publicAccounts]
  );

  useEffect(() => {
    if (currentGame && currentGame.id && publicAccounts) {
      handleFilterAccounts(currentGame.id);
    }
  }, [currentGame, publicAccounts, handleFilterAccounts]);

  if (gamesLoading)
    return (
      <div className="h-full min-h-screen flex">
        <Loader />
      </div>
    );

  if (filteredAccounts && filteredAccounts.length === 0) {
    return (
      <div className="text-2xl font-bold text-gray-900 mt-[50px]   flex flex-col text-center gap-2">
        {t("gamePage.noAccounts")}
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen flex flex-col gap-4">
      <div className="text-2xl font-bold text-gray-900 mt-[50px]   flex flex-col  gap-2">
        <Link
          href={paths.games}
          className="flex flex-row items-center gap-2 cursor-pointer text-black"
        >
          <ArrowLeftIcon />
          <h1 className="text-2xl font-bold text-gray-900">назад</h1>
        </Link>

        <div className="text-2xl font-bold text-gray-900 text-center">
          {t("gamePage.title")} {currentGame?.name}:
        </div>
      </div>

      <div>
        {filteredAccounts && filteredAccounts.length > 0 && (
          <HomeAccountsTable accounts={filteredAccounts} />
        )}
      </div>
    </div>
  );

  //   return <div>GamePage {currentGame?.name}</div>;
};

export default GamePage;
