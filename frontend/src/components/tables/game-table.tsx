import { useApp } from "@/contexts/AppProvider";
import { Game } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Input,
} from "@heroui/react";
import { EditIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { GameDetailModal } from "./game-detail-modal";
import { formatDate } from "@/utils/format-date";

export const GameTable = () => {
  const { games, fetchGames, updateGame, deleteGame, gamesLoading } = useApp();

  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRowClick = useCallback(
    (game: Game) => {
      setEditingGame(game);
      onOpen();
    },
    [onOpen]
  );

  // const handleSaveEdit = useCallback(async () => {
  //   if (editingGame && editName.trim()) {
  //     try {
  //       await updateGame(editingGame.id!, { name: editName.trim() });
  //       onEditClose();
  //       setEditingGame(null);
  //       setEditName("");
  //     } catch (error) {
  //       console.error("Failed to update game:", error);
  //     }
  //   }
  // }, [editingGame, editName, onEditClose, updateGame]);

  const handleDeleteClick = useCallback(
    async (game: Game) => {
      await deleteGame(game.id!);
      onClose();
    },
    [deleteGame, onClose]
  );

  if (gamesLoading) {
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
          </div>
        </div>
        {editingGame && (
          <GameDetailModal
            isEditOpen={isOpen}
            onEditClose={onClose}
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
        >
          <TableHeader>
            <TableColumn key="name">НАЗВАНИЕ ИГРЫ</TableColumn>
            <TableColumn key="created">СОЗДАНО</TableColumn>
            <TableColumn key="actions">ДЕЙСТВИЯ</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">
                  Игры не найдены
                </div>
                <div className="text-gray-400 text-sm">
                  Пока нет доступных игр.
                </div>
              </div>
            }
          >
            {(games || []).map((game) => (
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={(e) => handleEditClick(game, e as any)}
                    >
                      <EditIcon />
                      Редактировать
                    </Button> */}
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => handleDeleteClick(game)}
                    >
                      <TrashIcon />
                      Удалить
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
