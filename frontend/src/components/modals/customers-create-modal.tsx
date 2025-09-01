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
import { Account, Game } from "@/types";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";

interface CustomersCreateModalProps {
  isOpen: boolean;
  onClose?: () => void;
  accountId: number;
}

export const CustomersCreateModal = ({
  isOpen,
  onClose,
  accountId,
}: CustomersCreateModalProps) => {
  const { createOrder } = useApp();
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    purchaseType: "",
    platform: "",
    notes: "",
    email: "",
    telegram: "",
    accountId: accountId,
  });
  const handleSubmit = async () => {
    try {
      const result = await createOrder({
        customerName: formData.customerName,
        phone: formData.phone,
        notes: formData.notes,
        email: formData.email,
        telegram: formData.telegram,
        accountId,
        purchaseType: formData.purchaseType,
        platform: formData.platform,
      });
      if (result) {
        setFormData({
          customerName: "",
          phone: "",
          notes: "",
          email: "",
          telegram: "",
          accountId: 0,
          purchaseType: "",
          platform: "",
        });
        onClose?.();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{t("createOrder")}</ModalHeader>
        <ModalBody>
          <Input
            label={t("account")}
            type="number"
            name="accountId"
            value={formData.accountId.toString()}
            id={formData.accountId.toString()}
            isDisabled
          />

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
          <Select
            label={t("selectPlatform")}
            name="platform"
            isRequired
            onChange={handleInputChange}
          >
            <SelectItem key="PS4">PS4</SelectItem>
            <SelectItem key="PS5">PS5</SelectItem>
          </Select>

          <Input
            label={t("customerName")}
            placeholder={t("customerNamePlaceholder")}
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
          />
          <Input
            label={t("phone")}
            type="tel"
            name="phone"
            placeholder={t("phonePlaceholder")}
            isRequired
            value={formData.phone}
            onChange={handleInputChange}
          />
          <Input
            label={t("telegram")}
            type="text"
            name="telegram"
            placeholder={t("telegramPlaceholder")}
            value={formData.telegram}
            onChange={handleInputChange}
          />
          <Input
            label={t("email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <Input
            label={t("notes")}
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
          <ErrorContainer />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={handleSubmit}>
            {t("submitOrder")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
