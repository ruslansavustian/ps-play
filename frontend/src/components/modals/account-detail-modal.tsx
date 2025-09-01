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
import { Account } from "@/types";
import { useApp } from "@/contexts/AppProvider";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";

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
  const [changes, setChanges] = useState<Account | undefined>();
  const { deleteAccount, updateAccount } = useApp();
  const t = useTranslations("accounts");
  const tCommon = useTranslations("common");

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

  return (
    <>
      {/* Account Detail Modal */}
      <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-row justify-between w-10/12 mx-auto">
              <h2 className="text-xl font-bold">{t("accountDetails")}</h2>
              <div className="flex flex-row gap-2">
                <label className=" font-medium text-gray-700">
                  {t("created")}:
                </label>
                <p className=" text-gray-900">
                  {formatDate(selectedAccount?.created)}
                </p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedAccount && (
              <form className="flex flex-row grid-cols-2 gap-4 w-full">
                <div className="w-6/12 space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className=" font-medium text-gray-700">
                      {t("games")}:
                    </label>
                    <p className=" text-gray-900">
                      -{" "}
                      {selectedAccount?.games
                        ?.map((game) => game.name)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className=" font-medium text-gray-700">
                      {t("platformsLabel")}
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
                        {t("priceP1")}
                      </label>
                      <Input
                        className="mt-1 text-lg font-bold text-green-600"
                        type="number"
                        min="0"
                        step="1"
                        name="priceP1"
                        defaultValue={selectedAccount?.priceP1.toString()}
                        onChange={(e) => {
                          setChanges({
                            ...changes!,
                            priceP1: Number(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className=" font-medium text-gray-700">
                        {t("priceP2PS4")}
                      </label>
                      <Input
                        className="mt-1 text-lg font-bold text-green-600"
                        type="number"
                        min="0"
                        step="1"
                        name="priceP2PS4"
                        defaultValue={selectedAccount?.priceP2PS4.toString()}
                        onChange={(e) => {
                          setChanges({
                            ...changes!,
                            priceP2PS4: Number(e.target.value),
                          });
                        }}
                      />
                    </div>

                    <div>
                      <label className=" font-medium text-gray-700">
                        {t("priceP2PS5")}
                      </label>
                      <Input
                        className="mt-1 text-lg font-bold text-green-600"
                        type="number"
                        min="0"
                        step="1"
                        name="priceP2PS5"
                        defaultValue={selectedAccount?.priceP2PS5.toString()}
                        onChange={(e) => {
                          setChanges({
                            ...changes!,
                            priceP2PS5: Number(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className=" font-medium text-gray-700">
                        {t("priceP3")}
                      </label>
                      <Input
                        className="mt-1 text-lg font-bold text-green-600"
                        type="number"
                        min="0"
                        step="1"
                        name="priceP3"
                        defaultValue={selectedAccount?.priceP3.toString()}
                        onChange={(e) => {
                          setChanges({
                            ...changes!,
                            priceP3: Number(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className=" font-medium text-gray-700">
                        {t("priceP3A")}
                      </label>
                      <Input
                        className="mt-1 text-lg font-bold text-green-600"
                        type="number"
                        min="0"
                        step="1"
                        name="priceP3A"
                        defaultValue={selectedAccount?.priceP3A.toString()}
                        onChange={(e) => {
                          setChanges({
                            ...changes!,
                            priceP3A: Number(e.target.value),
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-6/12 space-y-4">
                  <h1>{t("statuses")}</h1>
                  <div className="  flex flex-row gap-2 justify-between max-w-[150px]">
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

                  <div className=" flex flex-row gap-2 justify-between max-w-[150px]">
                    <label className=" font-medium text-gray-700">P2PS4</label>
                    <Switch
                      id="p2PS4"
                      defaultSelected={selectedAccount?.P2PS4}
                      onValueChange={(value) => {
                        setChanges({
                          ...changes!,
                          P2PS4: value,
                        });
                      }}
                    />
                  </div>
                  <div className=" flex flex-row gap-2 justify-between max-w-[150px]">
                    <label className=" font-medium text-gray-700">P2PS5</label>
                    <Switch
                      id="p2PS5"
                      defaultSelected={selectedAccount?.P2PS5}
                      onValueChange={(value) => {
                        setChanges({
                          ...changes!,
                          P2PS5: value,
                        });
                      }}
                    />
                  </div>
                  <div className=" flex flex-row gap-2 justify-between max-w-[150px]">
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
                  <div className=" flex flex-row gap-2 justify-between max-w-[150px]">
                    <label className=" font-medium text-gray-700">P3A</label>
                    <Switch
                      id="p3"
                      defaultSelected={selectedAccount?.P3A}
                      onValueChange={(value) => {
                        setChanges({
                          ...changes!,
                          P3A: value,
                        });
                      }}
                    />
                  </div>
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
      <Modal isOpen={deleteModal} onOpenChange={setDeleteModal}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">{t("deleteAccount")}</h2>
          </ModalHeader>
          <ModalBody>
            <p>{t("deleteConfirm")}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => handleDeleteAccount(selectedAccount?.id!)}
            >
              {tCommon("delete")}
            </Button>
            <Button color="primary" onPress={() => setDeleteModal(false)}>
              {t("close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
