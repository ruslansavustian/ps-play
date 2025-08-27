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
import { Game } from "@/types";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CreateOrderModal = ({
  isOpen,
  onClose,
}: CreateOrderModalProps) => {
  const { createOrder, games } = useApp();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    gameName: "",
    platform: "",
    notes: "",
    email: "",
    telegram: "",
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
    });
    setFormData({
      customerName: "",
      phone: "",
      gameName: "",
      platform: "",
      notes: "",
      email: "",
      telegram: "",
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
          {games && (
            <Select
              label="Игра"
              isRequired
              name="gameName"
              onChange={handleInputChange}
            >
              {games?.map((game: Game) => (
                <SelectItem key={game.name}>{game.name}</SelectItem>
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
