import React, { useState } from "react";
import { GameTable } from "../tables/game-table";
import { MyButton } from "../ui-components/my-button";
import { CreateGameModal } from "../modals/create-game.modal";
import { useTranslations } from "next-intl";

export const GameSection = () => {
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  const t = useTranslations("games");
  return (
    <div>
      <CreateGameModal
        isOpen={isCreateGameModalOpen}
        onClose={() => setIsCreateGameModalOpen(false)}
      />
      <div className="flex justify-end">
        <MyButton
          title={t("addGame")}
          onClick={() => setIsCreateGameModalOpen(true)}
        />
      </div>
      <GameTable />
    </div>
  );
};
