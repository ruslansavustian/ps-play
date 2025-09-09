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
  Card,
  CardBody,
  Divider,
  Chip,
} from "@heroui/react";
import { Game } from "@/types";
import { formatDate } from "@/utils/format-date";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FileUpload } from "../ui-components/file-uploader";
import { useAppDispatch } from "@/stores(REDUX)";
import { updateGame } from "@/stores(REDUX)/slices/games-slice";

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
}: GameDetailModalProps) => {
  const tCommon = useTranslations("common");
  const tGames = useTranslations("games");
  const dispatch = useAppDispatch();

  const [changes, setChanges] = useState<Partial<Game | undefined>>();
  const [existedPhotoUrl, setExistedPhotoUrl] = useState("");

  useEffect(() => {
    if (game.photoUrl) {
      setExistedPhotoUrl(game.photoUrl);
    }
  }, [game.photoUrl]);

  const handleSaveEditGame = useCallback(async () => {
    if (!changes) return;
    try {
      const result = await dispatch(
        updateGame({ id: game.id!, data: changes as Partial<Game> })
      ).unwrap();

      if (result) {
        setExistedPhotoUrl("");
        setChanges(undefined);
        onEditClose();
      }
    } catch (error) {
      console.error("Failed to update game:", error);
    }
  }, [changes, dispatch, game.id, onEditClose]);

  const handleChangeGameInfo = (key: keyof Game, value: string) => {
    setChanges({ ...changes, [key]: value });
  };

  return (
    <Modal
      isOpen={isEditOpen}
      onOpenChange={(open) => {
        if (!open) {
          setChanges(undefined);
          setExistedPhotoUrl("");
          onEditClose();
        }
      }}
      size="2xl"
      classNames={{
        base: "bg-background/95 backdrop-blur-md",
        backdrop: "bg-black/50",
        header: "border-b border-divider",
        body: "py-6",
        footer: "border-t border-divider",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between w-full mt-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {tGames("gameDetails")}
                </h2>
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="font-mono"
                >
                  ID: {game?.id}
                </Chip>
              </div>
            </ModalHeader>

            <Divider />

            <ModalBody>
              {game && (
                <div className="flex flex-col gap-6">
                  {/* Game Name Section */}
                  <Card className="bg-content1/50">
                    <CardBody className="gap-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground-600">
                          {tGames("gameName")}
                        </label>
                        <Input
                          name="name"
                          defaultValue={game?.name || ""}
                          onChange={(e) =>
                            handleChangeGameInfo("name", e.target.value)
                          }
                          variant="bordered"
                          classNames={{
                            input: "text-lg font-semibold",
                            inputWrapper: "bg-content2/50",
                          }}
                        />
                      </div>
                    </CardBody>
                  </Card>
                  {/* Game Abbreviation Section */}
                  <Card className="bg-content1/50">
                    <CardBody className="gap-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground-600">
                          {tGames("gameShortName")}
                        </label>
                        <Input
                          name="abbreviation"
                          defaultValue={game?.abbreviation || ""}
                          onChange={(e) =>
                            handleChangeGameInfo("abbreviation", e.target.value)
                          }
                          variant="bordered"
                          classNames={{
                            input: "text-lg font-semibold",
                            inputWrapper: "bg-content2/50",
                          }}
                        />
                      </div>
                    </CardBody>
                  </Card>

                  {/* Created Date Section */}
                  <Card className="bg-content1/50">
                    <CardBody className="gap-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground-600">
                          {tCommon("created")}
                        </label>
                        <Input
                          value={formatDate(game.created)}
                          isReadOnly
                          variant="bordered"
                          classNames={{
                            inputWrapper: "bg-content2/50",
                          }}
                        />
                      </div>
                    </CardBody>
                  </Card>

                  {/* Photo Section */}
                  <Card className="bg-content1/50">
                    <CardBody className="gap-4">
                      <label className="text-sm font-semibold text-foreground-600">
                        {tCommon("photo")}
                      </label>

                      {/* Existing Photo */}
                      {existedPhotoUrl && (
                        <div className="flex items-center gap-3 p-3 bg-content2/30 rounded-lg border border-divider">
                          <Image
                            src={existedPhotoUrl}
                            alt="Game photo"
                            width={80}
                            height={80}
                            className="object-cover rounded-lg shadow-sm"
                            style={{ width: "auto", height: "auto" }}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-foreground-600">
                              Current photo
                            </p>
                            <p className="text-xs text-foreground-400">
                              Click to remove
                            </p>
                          </div>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            isIconOnly
                            onPress={() => setExistedPhotoUrl("")}
                            className="min-w-8 w-8 h-8"
                          >
                            ✕
                          </Button>
                        </div>
                      )}

                      {/* New Photo Preview */}
                      {changes?.photoUrl && (
                        <div className="flex items-center gap-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                          <Image
                            src={changes.photoUrl}
                            alt="New game photo"
                            width={80}
                            height={80}
                            className="object-cover rounded-lg shadow-sm"
                            style={{ width: "auto", height: "auto" }}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-success-700 font-medium">
                              New photo selected
                            </p>
                            <p className="text-xs text-success-600">
                              Click to remove
                            </p>
                          </div>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            isIconOnly
                            onPress={() =>
                              setChanges({ ...changes, photoUrl: "" })
                            }
                            className="min-w-8 w-8 h-8"
                          >
                            ✕
                          </Button>
                        </div>
                      )}

                      {/* File Upload */}
                      {!existedPhotoUrl && !changes?.photoUrl && (
                        <div className="border-2 border-dashed border-divider rounded-lg p-6 bg-content2/20">
                          <FileUpload
                            onFileUploaded={(fileUrl) => {
                              handleChangeGameInfo("photoUrl", fileUrl);
                            }}
                          />
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              )}
            </ModalBody>

            <Divider />

            <ModalFooter className="gap-3">
              <Button
                color="primary"
                isDisabled={!changes}
                onPress={handleSaveEditGame}
                className="font-semibold"
              >
                {tCommon("save")}
              </Button>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                className="font-semibold"
              >
                {tCommon("cancel")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
