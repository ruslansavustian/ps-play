import React from "react";
import { HomeGamesTable } from "@/components/tables/home-tables/home-games-table";
import { SupportChat } from "@/components/chat/support-chat";

export default function GamesPage() {
  return (
    <div>
      <HomeGamesTable />
      <SupportChat />
    </div>
  );
}
