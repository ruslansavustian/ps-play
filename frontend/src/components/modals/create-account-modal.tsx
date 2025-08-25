import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
} from "@heroui/react";
import { Account, Game, CreateAccountDto } from "@/types";
import { useApp } from "@/contexts/AppProvider";
import InputSelector from "../ui-components/input-selector";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CreateAccountModal = ({
  isOpen,
  onClose,
}: CreateAccountModalProps) => {
  const { createAccount } = useApp();

  const [formData, setFormData] = useState<Account>({
    games: {} as Game,
    platformPS4: false,
    platformPS5: false,
    pricePS5: 0,
    pricePS4: 0,
    P1: false,
    P2: false,
    P3: false,
  });

  const { games } = useApp();
  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  };

  const handleSubmit = useCallback(async () => {
    // Convert the full game object to just the ID for the API
    const accountData: CreateAccountDto = {
      games: formData.games.id || 0,
      platformPS4: formData.platformPS4,
      platformPS5: formData.platformPS5,
      pricePS5: Number(formData.pricePS5),
      pricePS4: Number(formData.pricePS4),
      P1: formData.P1,
      P2: formData.P2,
      P3: formData.P3,
    };
    await createAccount(accountData);
    // Reset form
    setFormData({
      games: {} as Game,
      platformPS4: false,
      platformPS5: false,
      pricePS5: 0,
      pricePS4: 0,
      P1: false,
      P2: false,
      P3: false,
    });
    onClose?.();
  }, [formData, createAccount, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
      [name]: type === "boolean" ? value === "true" : value,
    });
  };

  const handleSelectorChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { value } = e.target;
    // Find the selected game from the games array
    const selectedGame = games?.find((game) => game.id?.toString() === value);
    if (selectedGame) {
      setFormData({
        ...formData,
        games: selectedGame,
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.games &&
      formData.games.id &&
      formData.platformPS4 &&
      formData.platformPS5 &&
      (formData.pricePS5 > 0 || formData.pricePS4 > 0)
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Создать игровой аккаунт</h2>
          <p className="text-sm text-gray-600">
            Добавить новый игровой аккаунт на ваш маркетплейс
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* Game Name */}
            <InputSelector
              label="Название игры"
              placeholderName="Выберите игру"
              name="games"
              value={formData.games?.id?.toString() || ""}
              onChange={handleSelectorChange}
              options={
                games?.map((game) => ({
                  id: game.id?.toString() || "",
                  name: game.name,
                })) || []
              }
            />

            {/* Platform */}
            <div className="flex gap-4">
              <div>
                <p>PS4</p>
              </div>
              <Switch
                name="platformPS4"
                isSelected={formData.platformPS4}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    platformPS4: value,
                  })
                }
              />
            </div>
            <div className="flex gap-4">
              <div>
                <p>PS5</p>
              </div>
              <Switch
                name="platformPS5"
                isSelected={formData.platformPS5}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    platformPS5: value,
                  })
                }
              />
            </div>

            {/* Prices */}
            <div className="flex gap-4">
              <Input
                label="Цена PS (USD)"
                placeholder="0.00"
                name="pricePS5"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePS5.toString()}
                onChange={handleInputChange}
                startContent={<span className="text-gray-500">$</span>}
              />
              <Input
                label="Цена PS4 (USD)"
                placeholder="0.00"
                name="pricePS4"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePS4.toString()}
                onChange={handleInputChange}
                startContent={<span className="text-gray-500">$</span>}
              />
            </div>
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
            Создать аккаунт
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
