"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { FileUpload } from "../ui-components/file-uploader";
import { useApp } from "@/contexts/AppProvider";
import { TrashIcon, X } from "lucide-react";

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
  const tGames = useTranslations("games");
  const { updateGame } = useApp();
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [existedPhotoUrl, setExistedPhotoUrl] = useState("");

  useEffect(() => {
    if (game.photoUrl) {
      setExistedPhotoUrl(game.photoUrl);
    }
  }, [game.photoUrl]);

  const handleSaveEditGame = useCallback(async () => {
    const result = await updateGame(game.id!, { photoUrl: newPhotoUrl });
    if (result) {
      setExistedPhotoUrl("");
      setNewPhotoUrl("");
    }
    onEditClose();
  }, [game.id!, newPhotoUrl, updateGame, onEditClose]);

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
                    {tGames("gameName")}
                  </label>
                  <p className="mt-1 text-gray-900">{game.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {tCommon("created")}
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
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {tCommon("photo")}
                  </label>
                </div>
                {existedPhotoUrl && (
                  <div className="">
                    <div className="flex w-auto">
                      <Image
                        src={existedPhotoUrl}
                        alt="Game photo"
                        className="rounded-lg relative"
                        width={250}
                        height={250}
                      />
                      <Button
                        color="danger"
                        variant="light"
                        className=""
                        onPress={() => setExistedPhotoUrl("")}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {newPhotoUrl && (
                  <div className="flex flex-row gap-2">
                    <Image
                      src={newPhotoUrl}
                      alt="Game photo"
                      width={250}
                      className="h-auto"
                    />
                    <Button
                      color="danger"
                      variant="light"
                      className=""
                      onPress={() => setNewPhotoUrl("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {!existedPhotoUrl && !newPhotoUrl && (
                  <FileUpload
                    onFileUploaded={(fileUrl) => {
                      setNewPhotoUrl(fileUrl);
                    }}
                  />
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleSaveEditGame}>
              {tCommon("save")}
            </Button>
            <Button color="primary" onPress={onEditClose}>
              {tCommon("close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
