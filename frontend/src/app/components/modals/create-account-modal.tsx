import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
} from "@heroui/react";
import { Account, GamePlatform, AccountStatus } from "@/types";
import { useApp } from "@/contexts/AppProvider";

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
    platform: GamePlatform.PLAYSTATION,
    username: "",
    level: "",
    gamesLibrary: "",
    price: 0,
    status: AccountStatus.AVAILABLE,
    description: "",
    isVerified: false,
    region: "",
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  };

  const handleSubmit = useCallback(async () => {
    await createAccount(formData);
    // Reset form
    setFormData({
      platform: GamePlatform.PLAYSTATION,
      username: "",
      level: "",
      gamesLibrary: "",
      price: 0,
      status: AccountStatus.AVAILABLE,
      description: "",
      isVerified: false,
      region: "",
    });
    onClose?.();
  }, [formData, createAccount, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSelectChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const platformOptions = Object.values(GamePlatform).map((platform) => ({
    key: platform,
    label: platform.replace("_", " ").toUpperCase(),
  }));

  const statusOptions = Object.values(AccountStatus).map((status) => ({
    key: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Create Gaming Account</h2>
          <p className="text-sm text-gray-600">
            Add a new gaming account to your marketplace
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            {/* Platform Selection */}
            <Select
              label="Gaming Platform"
              placeholder="Select a platform"
              selectedKeys={[formData.platform]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleSelectChange("platform", selectedKey);
              }}
              isRequired
            >
              {platformOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            {/* Username */}
            <Input
              label="Username/Email"
              placeholder="Enter account username or email"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              isRequired
            />

            {/* Level and Region */}
            <div className="flex gap-4">
              <Input
                label="Level/Rank"
                placeholder="e.g., Level 50, Gold III"
                name="level"
                value={formData.level || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Region/Server"
                placeholder="e.g., NA, EU, Asia"
                name="region"
                value={formData.region || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Price and Status */}
            <div className="flex gap-4">
              <Input
                label="Price (USD)"
                placeholder="0.00"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price.toString()}
                onChange={handleInputChange}
                startContent={<span className="text-gray-500">$</span>}
                isRequired
              />
              <Select
                label="Status"
                selectedKeys={[formData.status]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleSelectChange("status", selectedKey);
                }}
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Games Library */}
            <Textarea
              label="Games Library"
              placeholder="List games included with this account..."
              name="gamesLibrary"
              value={formData.gamesLibrary || ""}
              onChange={(e) => handleInputChange(e as any)}
              minRows={2}
            />

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Additional details about the account..."
              name="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange(e as any)}
              minRows={3}
            />

            {/* Verified Switch */}
            <Switch
              isSelected={formData.isVerified}
              onValueChange={(value) =>
                setFormData({ ...formData, isVerified: value })
              }
            >
              Verified Account
            </Switch>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={
              !formData.username || !formData.platform || formData.price <= 0
            }
          >
            Create Account
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
