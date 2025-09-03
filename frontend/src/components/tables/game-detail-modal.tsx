import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Game } from "@/types";
import { formatDate } from "@/utils/format-date";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface GameDetailModalProps {
  isEditOpen: boolean;
  onEditClose: () => void;
  game: Game;
  setEditName?: (name: string) => void;
  handleSaveEdit?: () => void;
}

export const GameDetailModal = ({
  isEditOpen,
  onEditClose,
  game,
  setEditName,
  handleSaveEdit,
}: GameDetailModalProps) => {
  const tCommon = useTranslations("common");
  console.log(game);
  return (
    <div>
      {/* Game Detail Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Детали игры</h2>
          </ModalHeader>
          <ModalBody>
            {game && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Название игры
                  </label>
                  <p className="mt-1 text-gray-900">{game.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Создано
                  </label>
                  <p className="mt-1 text-gray-900">
                    {formatDate(game.created)}
                  </p>
                </div>
                {game.id && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      ID
                    </label>
                    <p className="mt-1 text-gray-900">#{game.id}</p>
                  </div>
                )}
                {game.photoUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {tCommon("photo")}
                    </label>
                    <Image
                      src={game.photoUrl}
                      alt="Game photo"
                      width={250}
                      height={250}
                    />
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onEditClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
