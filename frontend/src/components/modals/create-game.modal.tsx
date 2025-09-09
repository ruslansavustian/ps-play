import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from "@heroui/react";
import { Game } from "@/types";
import { useAppDispatch } from "@/stores(REDUX)";
import { createGame } from "@/stores(REDUX)/slices/games-slice";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";
import { FileUpload } from "../ui-components/file-uploader";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose?: () => void;
}
export const CreateGameModal = ({ isOpen, onClose }: CreateGameModalProps) => {
  const t = useTranslations("games");
  const tCommon = useTranslations("common");
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Game>({
    name: "",
    abbreviation: "",
    photoUrl: "",
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  };

  const handleSubmit = useCallback(async () => {
    await dispatch(createGame(formData));
    setFormData({
      name: "",
      abbreviation: "",
      photoUrl: "",
    });
    onClose?.();
  }, [formData, dispatch, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isFormValid = () => {
    return formData.name && formData.name.trim().length > 0;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{t("createGameTitle")}</h2>
          <p className="text-sm text-gray-600">{t("createGameDescription")}</p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* Game Name */}
            <Input
              label={t("gameName")}
              placeholder={t("gameNamePlaceholder")}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              isRequired
            />
            <h1>{tCommon("selectPhoto")}</h1>
            {formData.photoUrl && (
              <div className="flex items-center space-x-2">
                <Image
                  src={formData.photoUrl}
                  alt="Game photo"
                  width={80}
                  height={80}
                  className="w-16 h-16 object-cover rounded"
                />
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, photoUrl: "" }))
                  }
                >
                  ✕
                </Button>
              </div>
            )}
            {!formData.photoUrl && (
              <FileUpload
                onFileUploaded={(fileUrl) => {
                  setFormData({ ...formData, photoUrl: fileUrl });
                }}
                accept="image/*"
                maxSize={5}
              />
            )}
          </div>
          <ErrorContainer />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid()}
          >
            {t("createGameTitle")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
