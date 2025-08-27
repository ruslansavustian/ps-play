import React, { useState } from "react";
import { GameTable } from "../tables/game-table";
import { MyButton } from "../ui-components/my-button";
import { CreateGameModal } from "../modals/create-game.modal";
import AuditLogTable from "../tables/audit-log-table";

export const AuditLogSection = () => {
  return (
    <div>
      <AuditLogTable />
    </div>
  );
};
