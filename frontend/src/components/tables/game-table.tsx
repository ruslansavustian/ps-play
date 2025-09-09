import { Game } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Pagination,
} from "@heroui/react";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useMemo } from "react";
import { GameDetailModal } from "../modals/game-detail-modal";
import { formatDate } from "@/utils/format-date";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import {
  fetchGames,
  selectGames,
  selectGamesLoading,
} from "@/stores(REDUX)/slices/games-slice";

export const GameTable = () => {
  const games = useAppSelector(selectGames);
  const loading = useAppSelector(selectGamesLoading);
  const dispatch = useAppDispatch();
  const [editingGame, setEditingGame] = useState<Game | undefined>(undefined);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const t = useTranslations("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRowClick = useCallback(
    (game: Game) => {
      setEditingGame(game);
      onOpen();
    },
    [onOpen]
  );

  useEffect(() => {
    if (games.length === 0) {
      dispatch(fetchGames());
    }
  }, [dispatch, games.length]);

  const handleCloseModal = useCallback(() => {
    setEditingGame(undefined);
    onClose();
  }, [onClose]);

  const pages = Math.ceil(games.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return games.slice(start, end);
  }, [page, games, rowsPerPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Игры</h1>
          <div className="text-sm text-gray-600">
            Найдено {games?.length} игр
            {pages > 1 && ` (страница ${page} из ${pages})`}
          </div>
        </div>
        {editingGame && (
          <GameDetailModal
            isEditOpen={isOpen}
            onEditClose={handleCloseModal}
            game={editingGame}
            // setEditName={setEditName}
            // handleSaveEdit={handleSaveEdit}
          />
        )}
        {/* Table */}
        <Table
          aria-label="Games table"
          selectionMode="none"
          classNames={{
            wrapper: "min-h-[222px]",
          }}
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn key="name">{t("games.gameName")}</TableColumn>
            <TableColumn key="created">{t("common.created")}</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">
                  {t("games.noGames")}
                </div>
              </div>
            }
          >
            {(items || []).map((game) => (
              <TableRow
                key={game.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(game)}
              >
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                      {game.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDate(game.created)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
