import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Select,
  SelectItem,
} from "@heroui/react";
import { Account } from "@/types";
import { useApp } from "@/contexts/AppProvider";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CreateAccountModal = ({
  isOpen,
  onClose,
}: CreateAccountModalProps) => {
  const { createAccount, fetchAccounts, clearError, games } = useApp();
  const t = useTranslations("accounts");
  const tCommon = useTranslations("common");

  const [selectedGames, setSelectedGames] = useState<(number | null)[]>([null]);

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
  const disabledGames = games?.map((game) => game.id);
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      clearError();
      onClose?.();
    }
  };

  const handleGameSelectorChange = (index: number, value: string) => {
    const updatedSelectors = [...selectedGames];
    updatedSelectors[index] = parseInt(value);
    setSelectedGames(updatedSelectors);
  };

  const handleSubmit = useCallback(async () => {
    try {
      const accountData: Account = {
        ...formData,
        gamesIds: selectedGames.filter((id): id is number => id !== null),
        priceP1: Number(formData.priceP1),
        priceP2PS4: Number(formData.priceP2PS4),
        priceP2PS5: Number(formData.priceP2PS5),
        priceP3: Number(formData.priceP3),
        priceP3A: Number(formData.priceP3A),
      };

      const result = await createAccount(accountData);
      if (result) {
        await fetchAccounts();
        onClose?.();
        setSelectedGames([null]);
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
      console.error("Account creation failed:", error);
    }
  }, [formData, selectedGames, createAccount, fetchAccounts, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    });
  };

  const isFormValid = () => {
    return (
      selectedGames.some((id) => id !== null) &&
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
          <div className="flex flex-col gap-4 ">
            {/* Game selectors */}
            {selectedGames.map((selectedGameId, index) => (
              <div className="flex gap-2 flex-row w-full" key={index}>
                <Select
                  className="w-10/12"
                  label={`${t("game")} ${index + 1}`}
                  selectedKeys={
                    selectedGameId ? [selectedGameId.toString()] : []
                  }
                  onChange={(e) =>
                    handleGameSelectorChange(index, e.target.value)
                  }
                  disabledKeys={selectedGames
                    .filter((id, i) => i !== index && id !== null)
                    .map((id) => id!.toString())}
                >
                  {games?.map((game) => (
                    <SelectItem key={game.id}>{game.name}</SelectItem>
                  )) || []}
                </Select>

                {index !== 0 && (
                  <div className="flex items-center justify-center">
                    <Button
                      className="bg-white"
                      onPress={() =>
                        setSelectedGames(
                          selectedGames.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <Trash2 height={30} width={30} color="red" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button
              className="text-white bg-black"
              onPress={() => setSelectedGames([...selectedGames, null])}
            >
              {t("addGame")}
            </Button>

            {/* Platforms */}
            <div className="flex gap-4 flex-col">
              <h1>{t("platforms")}</h1>
              <div className="flex gap-2">
                <p>PS4</p>
                <Switch
                  name="platformPS4"
                  isSelected={formData.platformPS4}
                  onValueChange={(value) =>
                    setFormData({ ...formData, platformPS4: value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <p>PS5</p>
                <Switch
                  name="platformPS5"
                  isSelected={formData.platformPS5}
                  onValueChange={(value) =>
                    setFormData({ ...formData, platformPS5: value })
                  }
                />
              </div>
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
