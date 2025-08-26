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
import { useCallback, useEffect, useState } from "react";

// Games List Component
export const GameTable = () => {
  const { games, fetchGames, updateGame, deleteGame } = useApp();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editName, setEditName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const handleRowClick = useCallback(
    (game: Game) => {
      setSelectedGame(game);
      onOpen();
    },
    [onOpen]
  );

  const handleEditClick = useCallback(
    (game: Game, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingGame(game);
      setEditName(game.name);
      onEditOpen();
    },
    [onEditOpen]
  );

  const handleSaveEdit = useCallback(async () => {
    if (editingGame && editName.trim()) {
      try {
        // Call the updateGame function from your context
        await updateGame(editingGame.id!, { name: editName.trim() });
        onEditClose();
        setEditingGame(null);
        setEditName("");
      } catch (error) {
        console.error("Failed to update game:", error);
      }
    }
  }, [editingGame, editName, onEditClose, updateGame]);

  const handleDeleteClick = useCallback(
    async (game: Game) => {
      await deleteGame(game.id!);
      onClose();
    },
    [deleteGame, onClose]
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!games) {
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
            Найдено {games.length} игр
          </div>
        </div>

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
            {games.map((game) => (
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

      {/* Game Detail Modal */}
      <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Детали игры</h2>
          </ModalHeader>
          <ModalBody>
            {selectedGame && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Название игры
                  </label>
                  <p className="mt-1 text-gray-900">{selectedGame.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Создано
                  </label>
                  <p className="mt-1 text-gray-900">
                    {formatDate(selectedGame.created)}
                  </p>
                </div>
                {selectedGame.id && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      ID
                    </label>
                    <p className="mt-1 text-gray-900">#{selectedGame.id}</p>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Game Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Редактировать игру</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Название игры"
                placeholder="Введите название игры"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                isRequired
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onEditClose}>
              Отмена
            </Button>
            <Button
              color="primary"
              onPress={handleSaveEdit}
              isDisabled={!editName.trim()}
            >
              Сохранить изменения
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
