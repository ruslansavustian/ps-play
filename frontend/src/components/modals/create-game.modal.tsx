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

interface CreateGameModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CreateGameModal = ({ isOpen, onClose }: CreateGameModalProps) => {
  const { createGame } = useApp();

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
          <h2 className="text-xl font-bold">Создать новую игру</h2>
          <p className="text-sm text-gray-600">
            Добавить новую игру в вашу коллекцию
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* Game Name */}
            <Input
              label="Название игры"
              placeholder="Введите название игры (например, FIFA 24, Call of Duty)"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              isRequired
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Отмена
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid()}
          >
            Создать игру
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
