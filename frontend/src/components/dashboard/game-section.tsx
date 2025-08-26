import React, { useState } from "react";
import { GameTable } from "../tables/game-table";
import { MyButton } from "../ui-components/my-button";
import { CreateGameModal } from "../modals/create-game.modal";

export const GameSection = () => {
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  return (
    <div>
      <CreateGameModal
        isOpen={isCreateGameModalOpen}
        onClose={() => setIsCreateGameModalOpen(false)}
      />
      <div className="flex justify-end">
        <MyButton
          title="+ Добавить игру"
          onClick={() => setIsCreateGameModalOpen(true)}
        />
      </div>
      <GameTable />
    </div>
  );
};
