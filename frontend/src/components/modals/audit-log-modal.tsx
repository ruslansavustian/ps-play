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

interface AuditLogModalProps {
  auditLog?: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const AuditLogModal = ({ auditLog, isOpen, onClose }: AuditLogModalProps) => {
  const { accounts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <h2>Информация о действии</h2>
          </ModalHeader>
          <ModalBody>
            <p>Автор: {auditLog?.user.email}</p>
            <p>Действие: {auditLog?.description}</p>
            <div className="flex flex-row gap-2 mt-2 items-center">
              <p>Объект: </p>
              <Button color="primary" onPress={() => setIsModalOpen(true)}>
                открыть
              </Button>
            </div>
            <div className="mt-2">
              <p className="font-semibold mb-2">Изменения:</p>
              {auditLog?.metadata?.changes && (
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(auditLog.metadata.changes).map(
                    ([field, value]) => (
                      <div
                        key={field}
                        className="bg-blue-50 border border-blue-200 p-2  flexrounded"
                      >
                        <div className="text-sm text-blue-700 font-medium flex flex-row gap-2">
                          <p>Свойство: </p>
                          <p className="text-green-600">{field}</p>
                        </div>
                        <div className="text-sm text-blue-700 font-medium flex flex-row gap-2">
                          <p>Новое значение: </p>
                          <p className="text-green-600">
                            {typeof value === "boolean"
                              ? value
                                ? "Да"
                                : "Нет"
                              : String(value)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <p>IP-адрес: {auditLog?.ipAddress}</p>
            <p>Устройство: {auditLog?.userAgent}</p>
            <p>
              Время: {moment(auditLog?.timestamp).format("DD.MM.YYYY HH:mm")}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Закрыть</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuditLogModal;
