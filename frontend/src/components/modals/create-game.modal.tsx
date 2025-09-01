import React, { useCallback, useState } from "react";
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
import { useApp } from "@/contexts/AppProvider";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose?: () => void;
}
export const CreateGameModal = ({ isOpen, onClose }: CreateGameModalProps) => {
  const { createGame } = useApp();
  const t = useTranslations("games");
  const tCommon = useTranslations("common");

  const [formData, setFormData] = useState<Game>({
    name: "",
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  };

  const handleSubmit = useCallback(async () => {
    await createGame(formData);
    setFormData({
      name: "",
    });
    onClose?.();
  }, [formData, createGame, onClose]);

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
