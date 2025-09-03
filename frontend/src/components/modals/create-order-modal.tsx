import React, { useState } from "react";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useApp } from "@/contexts/AppProvider";
import { Account, CreateOrderDto, Game, Order } from "@/types";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CreateOrderModal = ({
  isOpen,
  onClose,
}: CreateOrderModalProps) => {
  const { createOrder, accounts, clearError, errorMessage } = useApp();
  const t = useTranslations("orders");

  const [formData, setFormData] = useState<CreateOrderDto>({
    customerName: "",
    phone: "",
    gameName: "",
    platform: "",
    notes: "",
    email: "",
    telegram: "",
    accountId: 0,
    purchaseType: "",
  });
  const handleSubmit = async () => {
    createOrder({
      customerName: formData?.customerName,
      phone: formData?.phone ?? "",
      gameName: formData?.gameName,
      platform: formData?.platform,
      notes: formData?.notes,
      email: formData?.email,
      telegram: formData?.telegram,
      accountId: Number(formData?.accountId),
      purchaseType: formData?.purchaseType,
    });
    setFormData({
      customerName: "",
      phone: "",
      gameName: "",
      platform: "",
      notes: "",
      email: "",
      telegram: "",
      accountId: 0,
      purchaseType: "",
    });
    onClose?.();
  };

  const handleInputChange = (e: any) => {
    if (errorMessage) {
      clearError();
    }
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = () => {
    return (
      formData?.phone &&
      formData?.platform &&
      formData?.purchaseType &&
      formData?.accountId
    );
  };

  const Platforms = [
    { key: "PS4", label: "PS4" },
    { key: "PS5", label: "PS5" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{t("createOrderTitle")}</ModalHeader>
        <ModalBody>
          <Input
            label={t("customerName")}
            name="customerName"
            value={formData?.customerName}
            onChange={handleInputChange}
          />
          <Input
            label={t("phone")}
            type="numeric"
            name="phone"
            isRequired
            value={formData?.phone}
            onChange={handleInputChange}
          />
          <Input
            label={t("telegram")}
            type="text"
            name="telegram"
            value={formData?.telegram}
            onChange={handleInputChange}
          />
          <Input
            label={t("email")}
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleInputChange}
          />
          {accounts && (
            <Select
              label={t("account")}
              isRequired
              name="accountId"
              onChange={handleInputChange}
            >
              {accounts?.map((account: Account) => (
                <SelectItem key={account.id}>
                  {account.id?.toString()}
                </SelectItem>
              ))}
            </Select>
          )}
          <Select
            label={t("selectPlatform")}
            name="platform"
            isRequired
            onChange={handleInputChange}
          >
            {Platforms.map((platform) => (
              <SelectItem key={platform.key}>{platform.label}</SelectItem>
            ))}
          </Select>
          <Select
            label={t("purchaseType")}
            name="purchaseType"
            isRequired
            onChange={handleInputChange}
          >
            <SelectItem key="1">{t("purchaseType1")}</SelectItem>
            <SelectItem key="2">{t("purchaseType2")}</SelectItem>
            <SelectItem key="3">{t("purchaseType3")}</SelectItem>
          </Select>
          <Input
            label={t("notes")}
            name="notes"
            value={formData?.notes}
            onChange={handleInputChange}
          />
          <ErrorContainer />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid()}
          >
            {t("create")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
