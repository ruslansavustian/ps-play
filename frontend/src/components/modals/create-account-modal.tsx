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
import { CreateAccountDto } from "@/types";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import { createAccount } from "@/stores(REDUX)/slices/accounts-slice";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CreateAccountModal = ({
  isOpen,
  onClose,
}: CreateAccountModalProps) => {
  const dispatch = useAppDispatch();
  const t = useTranslations("accounts");
  const tCommon = useTranslations("common");
  const games = useAppSelector((state) => state.games.games);
  const [selectedGames, setSelectedGames] = useState<(number | null)[]>([null]);

  const [formData, setFormData] = useState<Partial<CreateAccountDto>>();

  const handleGameSelectorChange = (index: number, value: string) => {
    const updatedSelectors = [...selectedGames];
    updatedSelectors[index] = parseInt(value);
    setSelectedGames(updatedSelectors);
  };

  const handleSubmit = useCallback(async () => {
    try {
      const accountData: CreateAccountDto = {
        gameIds: selectedGames.filter((id): id is number => id !== null),
        platformPS4: formData?.platformPS4 || false,
        platformPS5: formData?.platformPS5 || false,
        P1: formData?.P1 || false,
        P2PS4: formData?.P2PS4 || false,
        P2PS5: formData?.P2PS5 || false,
        P3: formData?.P3 || false,
        P3A: formData?.P3A || false,
        priceP1: Number(formData?.priceP1) || 0,
        priceP2PS4: Number(formData?.priceP2PS4) || 0,
        priceP2PS5: Number(formData?.priceP2PS5) || 0,
        priceP3: Number(formData?.priceP3) || 0,
        priceP3A: Number(formData?.priceP3A) || 0,
        email: formData?.email || "",
      };

      await dispatch(createAccount(accountData)).unwrap(); // unwrap() выбрасывает ошибку если rejected

      // Если дошли сюда - успех
      onClose?.();
      setSelectedGames([null]);
      setFormData({
        platformPS4: false,
        platformPS5: false,
        P1: false,
        P2PS4: false,
        P2PS5: false,
        P3: false,
        P3A: false,
        priceP1: 0,
        priceP2PS4: 0,
        priceP2PS5: 0,
        priceP3: 0,
        priceP3A: 0,
      });
    } catch (error) {
      // Ошибка уже в state.accounts.error, просто логируем
      console.error("Account creation failed:", error);
    }
  }, [formData, selectedGames, dispatch, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const isFormValid = () => {
    return (
      selectedGames.some((id) => id !== null) &&
      formData?.email &&
      (formData?.platformPS4 || formData?.platformPS5) &&
      ((formData?.priceP1 || 0) > 0 ||
        (formData?.priceP2PS4 || 0) > 0 ||
        (formData?.priceP2PS5 || 0) > 0 ||
        (formData?.priceP3 || 0) > 0)
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{t("createAccountTitle")}</h2>
          <p className="text-sm text-gray-600">
            {t("createAccountDescription")}
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4 ">
            <Input
              label={t("email")}
              type="email"
              isRequired
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
            />
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
                  ))}
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
                  isSelected={formData?.platformPS4}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, platformPS4: value }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <p>PS5</p>
                <Switch
                  name="platformPS5"
                  isSelected={formData?.platformPS5}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, platformPS5: value }))
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
                value={formData?.priceP1?.toString() || "0"}
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
                value={formData?.priceP2PS4?.toString() || "0"}
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
                value={formData?.priceP2PS5?.toString() || "0"}
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
                value={formData?.priceP3?.toString() || "0"}
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
                value={formData?.priceP3A?.toString() || "0"}
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
