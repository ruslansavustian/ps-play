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
        <ModalHeader>Создать Заказ</ModalHeader>
        <ModalBody>
          <Input
            label="Аккаунт"
            type="number"
            name="accountId"
            value={formData.accountId.toString()}
            id={formData.accountId.toString()}
            isDisabled
          />

          <Select
            label="Вариант покупки"
            name="purchaseType"
            isRequired
            onChange={handleInputChange}
          >
            <SelectItem key="1">Покупка аккаунта с активацией</SelectItem>
            <SelectItem key="2">Покупка аккаунта без активации</SelectItem>
            <SelectItem key="3">Арендовать</SelectItem>
          </Select>
          <Select
            label="Выбрите платформу"
            name="platform"
            isRequired
            onChange={handleInputChange}
          >
            <SelectItem key="PS4">PS4</SelectItem>
            <SelectItem key="PS5">PS5</SelectItem>
          </Select>

          <Input
            label="Имя"
            placeholder="укажите ваше имя"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
          />
          <Input
            label="Телефон"
            type="tel"
            name="phone"
            placeholder="укажите ваш телефон"
            isRequired
            value={formData.phone}
            onChange={handleInputChange}
          />
          <Input
            label="Телеграм"
            type="text"
            name="telegram"
            placeholder="укажите ваш telegram"
            value={formData.telegram}
            onChange={handleInputChange}
          />
          <Input
            label="Почта"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <Input
            label="Примечания"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
          <ErrorContainer />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={handleSubmit}>
            Отправить заказ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
