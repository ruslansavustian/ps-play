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
import { Account, Game } from "@/types";
import { useApp } from "@/contexts/AppProvider";
import InputSelector from "../ui-components/input-selector";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CreateAccountModal = ({
  isOpen,
  onClose,
}: CreateAccountModalProps) => {
  const { createAccount, fetchAccounts, errorMessage, clearError } = useApp();
  const t = useTranslations("accounts");
  const tCommon = useTranslations("common");

  const [formData, setFormData] = useState<Account>({
    gamesIds: [],
    platformPS4: false,
    platformPS5: false,
    priceP1: 0,
    priceP2PS4: 0,
    priceP2PS5: 0,
    priceP3: 0,
    priceP3A: 0,
    P3A: false,
    P1: false,
    P2PS4: false,
    P2PS5: false,
    P3: false,
  });

  const { games } = useApp();
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Очищаем ошибки при закрытии модального окна
      clearError();
      if (onClose) {
        onClose();
      }
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      const accountData: Account = {
        gamesIds: formData.gamesIds,
        platformPS4: formData.platformPS4,
        platformPS5: formData.platformPS5,
        priceP1: Number(formData.priceP1),
        priceP2PS4: Number(formData.priceP2PS4),
        priceP2PS5: Number(formData.priceP2PS5),
        priceP3: Number(formData.priceP3),
        priceP3A: Number(formData.priceP3A),
        P3A: formData.P3A,
        P1: formData.P1,
        P2PS4: formData.P2PS4,
        P2PS5: formData.P2PS5,
        P3: formData.P3,
      };

      const result = await createAccount(accountData);
      if (result) {
        await fetchAccounts();
        onClose?.();
      }

      // Reset form
      setFormData({
        gamesIds: [],
        platformPS4: false,
        platformPS5: false,
        priceP1: 0,
        priceP2PS4: 0,
        priceP2PS5: 0,
        priceP3: 0,
        priceP3A: 0,
        P3A: false,
        P1: false,
        P2PS4: false,
        P2PS5: false,
        P3: false,
      });
    } catch (error) {
      // Ошибка уже обработана в провайдере и сохранена в errorMessage
      // Просто логируем для отладки
      console.error("Account creation failed:", error);
    }
  }, [formData, createAccount, fetchAccounts, onClose]);

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
    setFormData({
      ...formData,
      gamesIds: [parseInt(value)],
    });
  };

  const isFormValid = () => {
    return (
      formData.gamesIds &&
      (formData.platformPS4 || formData.platformPS5) &&
      (formData.priceP1 > 0 ||
        formData.priceP2PS4 > 0 ||
        formData.priceP2PS5 > 0 ||
        formData.priceP3 > 0)
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{t("createAccountTitle")}</h2>
          <p className="text-sm text-gray-600">
            {t("createAccountDescription")}
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* Game Name */}
            <InputSelector
              label={t("gameName")}
              placeholderName={t("selectGame")}
              name="games"
              value={formData.gamesIds.toString()}
              onChange={handleSelectorChange}
              options={
                games?.map((game) => ({
                  id: game.id?.toString() || "",
                  name: game.name,
                })) || []
              }
            />

            {/* Platform */}
            <div className="flex gap-4 flex-col">
              <h1>{t("platforms")}</h1>
              <div className="flex gap-2">
                <p>PS4</p>

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
            </div>
            <div className="flex gap-2 ">
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
            <div className="flex gap-4 flex-col">
              <Input
                label={t("priceP1")}
                placeholder="0.00"
                name="priceP1"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceP1.toString()}
                onChange={handleInputChange}
                startContent={<span className="text-gray-500">$</span>}
              />
              <Input
                label={t("priceP2PS4")}
                placeholder="0.00"
                name="priceP2PS4"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceP2PS4.toString()}
                onChange={handleInputChange}
                startContent={<span className="text-gray-500">$</span>}
              />
              <Input
                label={t("priceP2PS5")}
                placeholder="0.00"
                name="priceP2PS5"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceP2PS5.toString()}
                onChange={handleInputChange}
                startContent={<span className="text-gray-500">$</span>}
              />
              <Input
                label={t("priceP3")}
                placeholder="0.00"
                name="priceP3"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceP3.toString()}
                onChange={handleInputChange}
                startContent={<span className="text-gray-500">$</span>}
              />
              <Input
                label={t("priceP3A")}
                placeholder="0.00"
                name="priceP3A"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceP3A.toString()}
                onChange={handleInputChange}
                startContent={<span className="text-gray-500">$</span>}
              />
            </div>
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
            {t("createAccount")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
