import React, { useState } from "react";
import { Account, AuditLog, User } from "../../types";
import { useApp } from "../../contexts/AppProvider";
import { useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { MyButton } from "../ui-components/my-button";
import { TrashIcon } from "lucide-react";
import AuditLogModal from "../modals/audit-log-modal";
import { Loader } from "../ui-components/loader";

const AuditLogTable = () => {
  const { fetchAuditLogs, auditLogs, auditLogsLoading } = useApp();
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(
    null
  );
  const [openLogModal, setOpenLogModal] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSelect = (auditLog: AuditLog) => {
    setSelectedAuditLog(auditLog);
  };

  if (auditLogsLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <AuditLogModal
        auditLog={selectedAuditLog}
        isOpen={openLogModal}
        onClose={() => setOpenLogModal(false)}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Игры</h1>
        <div className="text-sm text-gray-600">
          Найдено {auditLogs?.length} игр
        </div>
      </div>

      <Table
        aria-label="Games table"
        selectionMode="none"
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="action">ДЕЙСТВИЕ</TableColumn>
          <TableColumn key="description">АВТОР</TableColumn>
          <TableColumn key="timestamp">ВРЕМЯ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-2">Игры не найдены</div>
              <div className="text-gray-400 text-sm">
                Пока нет доступных игр.
              </div>
            </div>
          }
          items={auditLogs ?? []}
        >
          {(auditLog: AuditLog) => (
            <TableRow
              key={auditLog.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                handleSelect(auditLog);
                setOpenLogModal(true);
              }}
            >
              <TableCell>{auditLog?.description}</TableCell>
              <TableCell>{auditLog?.user?.email}</TableCell>
              <TableCell>{formatDate(auditLog?.timestamp)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;
