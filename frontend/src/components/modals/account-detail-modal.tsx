import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Switch,
  Input,
} from "@heroui/react";
import { Account, UpdateAccountDto } from "@/types";
import { useApp } from "@/contexts/AppProvider";

interface AccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccount: Account;
  setSelectedAccount?: (account: Account) => void;
}

export const AccountDetailModal = ({
  isOpen,
  onClose,
  selectedAccount,
  setSelectedAccount,
}: AccountDetailModalProps) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [formData, setFormData] = useState<Account | undefined>();
  const [changes, setChanges] = useState<UpdateAccountDto | undefined>();
  const { deleteAccount, updateAccount } = useApp();
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleChangeAccount = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
    },
    []
  );

  const handleDeleteAccount = useCallback(
    (accountId: number) => {
      deleteAccount(accountId);
    },
    [deleteAccount]
  );

  const handleUpdate = useCallback(async () => {
    await updateAccount(selectedAccount.id!, changes!);
    setChanges(undefined);
    onClose();
  }, [changes, updateAccount, onClose]);
  console.log("selectedAccount", selectedAccount);
  return (
    <>
      {/* Account Detail Modal */}
      <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Детали аккаунта</h2>
          </ModalHeader>
          <ModalBody>
            {selectedAccount && (
              <form className="flex flex-row grid-cols-2 gap-4 w-full">
                <div className="w-6/12 space-y-4">
                  <div className="flex flex-row gap-2">
                    <label className=" font-medium text-gray-700">Игры:</label>
                    <p className=" text-gray-900">
                      {selectedAccount?.games.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className=" font-medium text-gray-700">
                      Платформы:
                    </label>
                    <div className="flex flex-row gap-2">
                      <p className=" text-gray-900">
                        PS4:
                        <Checkbox
                          className="ml-2"
                          isSelected={selectedAccount?.platformPS4}
                        />
                      </p>
                      <p className=" text-gray-900">
                        PS5:
                        <Checkbox
                          className="ml-2"
                          isSelected={selectedAccount?.platformPS5}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className=" font-medium text-gray-700">
                        Цена PS4
                      </label>
                      <Input
                        className="mt-1 text-lg font-bold text-green-600"
                        type="number"
                        min="0"
                        step="1"
                        name="pricePS4"
                        defaultValue={selectedAccount?.pricePS4.toString()}
                        onChange={(e) => {
                          setChanges({
                            ...changes!,
                            pricePS4: Number(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className=" font-medium text-gray-700">
                        Цена PS5
                      </label>
                      <Input
                        className="mt-1 text-lg font-bold text-green-600"
                        type="number"
                        min="0"
                        step="1"
                        name="pricePS5"
                        defaultValue={selectedAccount?.pricePS5.toString()}
                        onChange={(e) => {
                          setChanges({
                            ...changes!,
                            pricePS5: Number(e.target.value),
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className=" font-medium text-gray-700">
                      Создано
                    </label>
                    <p className="mt-1 text-gray-900">
                      {formatDate(selectedAccount?.created)}
                    </p>
                  </div>
                </div>
                <div className="w-6/12 space-y-4">
                  <h1>Статусы</h1>
                  <div className="  flex flex-row gap-2">
                    <label className=" font-medium text-gray-700">P1</label>
                    <Switch
                      id="p1"
                      defaultSelected={selectedAccount?.P1}
                      onValueChange={(value) => {
                        setChanges({
                          ...changes!,
                          P1: value,
                        });
                      }}
                    />
                  </div>
                  <div className=" flex flex-row gap-2">
                    <label className=" font-medium text-gray-700">P2</label>
                    <Switch
                      id="p2"
                      defaultSelected={selectedAccount?.P2}
                      onValueChange={(value) => {
                        setChanges({
                          ...changes!,
                          P2: value,
                        });
                      }}
                    />
                  </div>
                  <div className=" flex flex-row gap-2">
                    <label className=" font-medium text-gray-700">P3</label>
                    <Switch
                      id="p3"
                      defaultSelected={selectedAccount?.P3}
                      onValueChange={(value) => {
                        setChanges({
                          ...changes!,
                          P3: value,
                        });
                      }}
                    />
                  </div>
                </div>
              </form>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleUpdate}>
              Сохранить
            </Button>
            <Button color="primary" onPress={onClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={deleteModal} onOpenChange={setDeleteModal}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Удалить аккаунт</h2>
          </ModalHeader>
          <ModalBody>
            <p>Вы уверены, что хотите удалить этот аккаунт?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => handleDeleteAccount(selectedAccount?.id!)}
            >
              Удалить
            </Button>
            <Button color="primary" onPress={() => setDeleteModal(false)}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
