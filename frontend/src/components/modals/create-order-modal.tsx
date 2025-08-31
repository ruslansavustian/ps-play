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

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CreateOrderModal = ({
  isOpen,
  onClose,
}: CreateOrderModalProps) => {
  const { createOrder, accounts } = useApp();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    gameName: "",
    platform: "",
    notes: "",
    email: "",
    telegram: "",
    accountId: 0,
  });
  const handleSubmit = async () => {
    createOrder({
      customerName: formData.customerName,
      phone: formData.phone,
      gameName: formData.gameName,
      platform: formData.platform,
      notes: formData.notes,
      email: formData.email,
      telegram: formData.telegram,
      accountId: formData.accountId,
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
    });
    onClose?.();
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const Platforms = [
    { key: "PS4", label: "PS4" },
    { key: "PS5", label: "PS5" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Создать Заказ</ModalHeader>
        <ModalBody>
          <Input
            label="Имя"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
          />
          <Input
            label="Телефон"
            type="tel"
            name="phone"
            isRequired
            value={formData.phone}
            onChange={handleInputChange}
          />
          <Input
            label="Телеграм"
            type="text"
            name="telegram"
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
          {accounts && (
            <Select
              label="Аккаунт"
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
            label="Платформа"
            name="platform"
            isRequired
            onChange={handleInputChange}
          >
            {Platforms.map((platform) => (
              <SelectItem key={platform.key}>{platform.label}</SelectItem>
            ))}
          </Select>
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
            Создать
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
