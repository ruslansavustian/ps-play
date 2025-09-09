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
  Card,
  CardBody,
  Divider,
  Chip,
} from "@heroui/react";
import { Account } from "@/types";
import { ErrorContainer } from "../ui-components/error-container";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/stores(REDUX)";
import {
  updateAccount,
  deleteAccount,
} from "@/stores(REDUX)/slices/accounts-slice";

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
}: AccountDetailModalProps) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [changes, setChanges] = useState<Partial<Account>>({});

  const t = useTranslations("accounts");
  const tCommon = useTranslations("common");
  const dispatch = useAppDispatch();
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteAccount = useCallback(
    (accountId: number) => {
      console.log("deleting account");
      dispatch(deleteAccount(accountId));
      setDeleteModal(false);
      onClose();
    },
    [dispatch, onClose]
  );

  const handleUpdate = useCallback(async () => {
    if (!selectedAccount.id || !changes) return;

    try {
      // Используем Redux updateAccount
      const result = await dispatch(
        updateAccount({
          id: selectedAccount.id,
          data: changes as Partial<Account>,
        })
      ).unwrap();

      if (result) {
        setChanges({});
        onClose();
        console.log("closing modal");
      }
    } catch (error) {
      console.error("Failed to update account:", error);
    }
  }, [changes, dispatch, onClose, selectedAccount]);

  const handleChangeAccountInfo = (
    key: keyof Account,
    value: string | boolean
  ) => {
    if (typeof value === "boolean") {
      setChanges((prev) => ({ ...prev, [key]: value }));
    } else {
      setChanges((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <>
      {/* Account Detail Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setChanges({});
            onClose();
          }
        }}
        size="2xl"
        classNames={{
          base: "bg-background/95 backdrop-blur-md",
          backdrop: "bg-black/50",
          header: "border-b border-divider",
          body: "py-6",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-2xl font-bold text-foreground">
                    {t("accountDetails")}
                  </h2>
                  <Chip
                    size="sm"
                    variant="flat"
                    color="secondary"
                    className="font-mono"
                  >
                    {formatDate(selectedAccount?.created)}
                  </Chip>
                </div>
              </ModalHeader>

              <Divider />
              <ModalBody>
                {selectedAccount && (
                  <div className="flex flex-col gap-6">
                    {/* Account Info Section */}
                    <Card className="bg-content1/50">
                      <CardBody className="gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-foreground-600">
                            {t("email")}
                          </label>
                          <Input
                            type="email"
                            name="email"
                            defaultValue={selectedAccount?.email}
                            variant="bordered"
                            classNames={{
                              input: "text-lg font-semibold text-success-600",
                              inputWrapper: "bg-content2/50",
                            }}
                            onChange={(e) =>
                              handleChangeAccountInfo("email", e.target.value)
                            }
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-foreground-600">
                            {t("games")}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {selectedAccount?.games?.map((game) => (
                              <Chip
                                key={game.id}
                                size="sm"
                                variant="flat"
                                color="primary"
                                className="font-medium"
                              >
                                {game.name}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Pricing Section */}
                    <Card className="bg-content1/50">
                      <CardBody className="gap-4">
                        <h3 className="text-lg font-semibold text-foreground-600 mb-2">
                          Pricing Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground-600">
                              {t("priceP1")}
                            </label>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              name="priceP1"
                              defaultValue={selectedAccount?.priceP1.toString()}
                              variant="bordered"
                              classNames={{
                                input: "text-lg font-semibold text-success-600",
                                inputWrapper: "bg-content2/50",
                              }}
                              onChange={(e) => {
                                handleChangeAccountInfo(
                                  "priceP1",
                                  e.target.value
                                );
                              }}
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground-600">
                              {t("priceP2PS4")}
                            </label>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              name="priceP2PS4"
                              defaultValue={selectedAccount?.priceP2PS4.toString()}
                              variant="bordered"
                              classNames={{
                                input: "text-lg font-semibold text-success-600",
                                inputWrapper: "bg-content2/50",
                              }}
                              onChange={(e) => {
                                handleChangeAccountInfo(
                                  "priceP2PS4",
                                  e.target.value
                                );
                              }}
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground-600">
                              {t("priceP2PS5")}
                            </label>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              name="priceP2PS5"
                              defaultValue={selectedAccount?.priceP2PS5.toString()}
                              variant="bordered"
                              classNames={{
                                input: "text-lg font-semibold text-success-600",
                                inputWrapper: "bg-content2/50",
                              }}
                              onChange={(e) => {
                                handleChangeAccountInfo(
                                  "priceP2PS5",
                                  e.target.value
                                );
                              }}
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground-600">
                              {t("priceP3")}
                            </label>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              name="priceP3"
                              defaultValue={selectedAccount?.priceP3.toString()}
                              variant="bordered"
                              classNames={{
                                input: "text-lg font-semibold text-success-600",
                                inputWrapper: "bg-content2/50",
                              }}
                              onChange={(e) => {
                                handleChangeAccountInfo(
                                  "priceP3",
                                  e.target.value
                                );
                              }}
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground-600">
                              {t("priceP3A")}
                            </label>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              name="priceP3A"
                              defaultValue={selectedAccount?.priceP3A.toString()}
                              variant="bordered"
                              classNames={{
                                input: "text-lg font-semibold text-success-600",
                                inputWrapper: "bg-content2/50",
                              }}
                              onChange={(e) => {
                                handleChangeAccountInfo(
                                  "priceP3A",
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Status Section */}
                    <Card className="bg-content1/50">
                      <CardBody className="gap-4">
                        <h3 className="text-lg font-semibold text-foreground-600 mb-2">
                          {t("statuses")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg border border-divider">
                            <label className="text-sm font-semibold text-foreground-600">
                              P1
                            </label>
                            <Switch
                              id="p1"
                              defaultSelected={selectedAccount?.P1}
                              color="success"
                              onValueChange={(value) => {
                                handleChangeAccountInfo("P1", value);
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg border border-divider">
                            <label className="text-sm font-semibold text-foreground-600">
                              P2PS4
                            </label>
                            <Switch
                              id="p2PS4"
                              defaultSelected={selectedAccount?.P2PS4}
                              color="success"
                              onValueChange={(value) => {
                                handleChangeAccountInfo("P2PS4", value);
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg border border-divider">
                            <label className="text-sm font-semibold text-foreground-600">
                              P2PS5
                            </label>
                            <Switch
                              id="p2PS5"
                              defaultSelected={selectedAccount?.P2PS5}
                              color="success"
                              onValueChange={(value) => {
                                handleChangeAccountInfo("P2PS5", value);
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg border border-divider">
                            <label className="text-sm font-semibold text-foreground-600">
                              P3
                            </label>
                            <Switch
                              id="p3"
                              defaultSelected={selectedAccount?.P3}
                              color="success"
                              onValueChange={(value) => {
                                handleChangeAccountInfo("P3", value);
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg border border-divider">
                            <label className="text-sm font-semibold text-foreground-600">
                              P3A
                            </label>
                            <Switch
                              id="p3A"
                              defaultSelected={selectedAccount?.P3A}
                              color="success"
                              onValueChange={(value) => {
                                handleChangeAccountInfo("P3A", value);
                              }}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Platforms Section */}
                    <Card className="bg-content1/50">
                      <CardBody className="gap-4">
                        <h3 className="text-lg font-semibold text-foreground-600 mb-2">
                          {t("platformsLabel")}
                        </h3>
                        <div className="flex flex-row gap-6">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              isSelected={selectedAccount?.platformPS4}
                              color="primary"
                              size="lg"
                            />
                            <label className="text-sm font-semibold text-foreground-600">
                              PS4
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              isSelected={selectedAccount?.platformPS5}
                              color="primary"
                              size="lg"
                            />
                            <label className="text-sm font-semibold text-foreground-600">
                              PS5
                            </label>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
                <ErrorContainer />
              </ModalBody>

              <Divider />

              <ModalFooter className="gap-3">
                <Button
                  color="primary"
                  onPress={handleUpdate}
                  className="font-semibold"
                >
                  {t("save")}
                </Button>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  className="font-semibold"
                >
                  {t("close")}
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => setDeleteModal(true)}
                  className="font-semibold"
                >
                  {t("deleteAccount")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={deleteModal}
        onOpenChange={setDeleteModal}
        classNames={{
          base: "bg-background/95 backdrop-blur-md",
          backdrop: "bg-black/50",
          header: "border-b border-divider",
          body: "py-6",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {t("deleteAccount")}
                </h2>
              </ModalHeader>

              <Divider />

              <ModalBody>
                <Card className="bg-danger-50 border border-danger-200">
                  <CardBody className="gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                        <span className="text-danger-600 text-xl">⚠️</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-danger-800">
                          Confirm Deletion
                        </h3>
                        <p className="text-sm text-danger-700">
                          {t("deleteConfirm")}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </ModalBody>

              <Divider />

              <ModalFooter className="gap-3">
                <Button
                  color="danger"
                  onPress={() => handleDeleteAccount(selectedAccount?.id!)}
                  className="font-semibold"
                >
                  {tCommon("delete")}
                </Button>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  className="font-semibold"
                >
                  {t("close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
