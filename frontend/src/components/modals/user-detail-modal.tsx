"use client";
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
} from "@heroui/react";
import { Role, UpdateUser, User } from "@/types";
import { useApp } from "@/contexts(NOT USED ANYMORE)/AppProvider";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User;
  setSelectedUser?: (user: User) => void;
}

export const UserDetailModal = ({
  isOpen,
  onClose,
  selectedUser,
}: UserDetailModalProps) => {
  const [changes, setChanges] = useState<UpdateUser | undefined>(undefined);
  const [newRoleId, setNewRoleId] = useState<number | undefined>(undefined);
  const { updateUser, roles, assignRole } = useApp();

  const t = useTranslations("users");

  const handleUpdate = useCallback(async () => {
    if (!selectedUser.id) return;
    if (selectedUser.id) {
      try {
        if (newRoleId) {
          console.log("change role");
          await assignRole(selectedUser.id, newRoleId);
        }
        if (changes) {
          console.log("change user info");
          await updateUser(selectedUser.id, changes as UpdateUser);
        }
        onClose();
        setChanges(undefined);
        setNewRoleId(undefined);
      } catch (error) {
        console.log(error);
      }
    }
  }, [changes, newRoleId, selectedUser, updateUser, assignRole, onClose]);
  const handleChangeUserInfo = (key: keyof UpdateUser, value: string) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
  };
  const handleChangeRole = (roleId: number) => {
    setNewRoleId(roleId);
  };

  console.log(changes);
  console.log(newRoleId);
  return (
    <>
      {/* User Detail Modal */}
      <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-row justify-between w-10/12 mx-auto">
              <h2 className="text-xl font-bold">{t("userDetails")}</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedUser && (
              <form className="flex flex-col gap-4 w-full">
                <div>
                  <Input
                    name="name"
                    defaultValue={selectedUser?.name}
                    onChange={(e) =>
                      handleChangeUserInfo("name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    defaultValue={selectedUser?.email}
                    onChange={(e) =>
                      handleChangeUserInfo("email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Select
                    label={t("userRole")}
                    name="role"
                    items={roles}
                    onChange={(e) => handleChangeRole(Number(e.target.value))}
                    defaultSelectedKeys={
                      selectedUser?.roleId
                        ? [selectedUser?.roleId.toString()]
                        : []
                    }
                  >
                    {(roles &&
                      roles?.map((role: Role) => (
                        <SelectItem key={role.id}>{role.name}</SelectItem>
                      ))) ||
                      []}
                  </Select>
                </div>
              </form>
            )}
            <ErrorContainer />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleUpdate}>
              {t("save")}
            </Button>
            <Button color="primary" onPress={onClose}>
              {t("close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
