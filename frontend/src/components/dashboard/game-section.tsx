import React from "react";
import { GameTable } from "../tables/game-table";
import { MyButton } from "../ui-components/my-button";

interface GameSectionProps {
  handleAddGame: () => void;
}

export const GameSection = ({ handleAddGame }: GameSectionProps) => {
  return (
    <div>
      <div className="flex justify-end">
        <MyButton title="+ Добавить игру" onClick={handleAddGame} />
      </div>
      <GameTable />
    </div>
  );
};
