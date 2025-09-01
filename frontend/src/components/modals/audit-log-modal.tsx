import { Account, AuditLog } from "../../types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { GameTable } from "../tables/game-table";
import { AccountDetailModal } from "./account-detail-modal";
import { useMemo, useState } from "react";
import { useApp } from "@/contexts/AppProvider";
import moment from "moment";
import { useTranslations } from "next-intl";

interface AuditLogModalProps {
  auditLog?: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const AuditLogModal = ({ auditLog, isOpen, onClose }: AuditLogModalProps) => {
  const { accounts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("auditLogs");

  const entity = useMemo(() => {
    switch (auditLog?.entityType) {
      case "ACCOUNT":
        return accounts?.find(
          (account: Account) => account.id === auditLog?.entityId
        );
    }
  }, [auditLog, accounts]);
  return (
    <>
      {entity && (
        <AccountDetailModal
          selectedAccount={entity}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <h2>{t("actionInfo")}</h2>
          </ModalHeader>
          <ModalBody>
            <p>
              {t("author")}: {auditLog?.user.email}
            </p>
            <p>
              {t("action")}: {auditLog?.description}
            </p>
            <div className="flex flex-row gap-2 mt-2 items-center">
              <p>{t("object")}: </p>
              <Button color="primary" onPress={() => setIsModalOpen(true)}>
                {t("open")}
              </Button>
            </div>
            <div className="mt-2">
              <p className="font-semibold mb-2">{t("changes")}</p>
              {auditLog?.metadata?.changes && (
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(auditLog.metadata.changes).map(
                    ([field, value]) => (
                      <div
                        key={field}
                        className="bg-blue-50 border border-blue-200 p-2  flexrounded"
                      >
                        <div className="text-sm text-blue-700 font-medium flex flex-row gap-2">
                          <p>{t("property")} </p>
                          <p className="text-green-600">{field}</p>
                        </div>
                        <div className="text-sm text-blue-700 font-medium flex flex-row gap-2">
                          <p>{t("newValue")} </p>
                          <p className="text-green-600">
                            {typeof value === "boolean"
                              ? value
                                ? t("yes")
                                : t("no")
                              : String(value)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <p>
              {t("ipAddress")}: {auditLog?.ipAddress}
            </p>
            <p>
              {t("device")}: {auditLog?.userAgent}
            </p>
            <p>
              {t("time")}:{" "}
              {moment(auditLog?.timestamp).format("DD.MM.YYYY HH:mm")}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>{t("close")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuditLogModal;
