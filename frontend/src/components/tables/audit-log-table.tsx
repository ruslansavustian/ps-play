import React, { useMemo, useState } from "react";
import { AuditLog } from "../../types";
import { useEffect } from "react";
import { Pagination } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import AuditLogModal from "../modals/audit-log-modal";
import { Loader } from "../ui-components/loader";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import {
  fetchAuditLogs,
  selectAuditLogs,
  selectAuditLogsLoading,
} from "@/stores(REDUX)/slices/audit-log.slice";
import { useTranslations } from "next-intl";

const AuditLogTable = () => {
  const t = useTranslations();
  const auditLogs = useAppSelector(selectAuditLogs);
  const auditLogsLoading = useAppSelector(selectAuditLogsLoading);
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const [openLogModal, setOpenLogModal] = useState(false);
  const pages = Math.ceil(auditLogs.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return auditLogs.slice(start, end);
  }, [page, auditLogs, rowsPerPage]);
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
    setSelected(auditLog);
  };

  useEffect(() => {
    if (auditLogs.length === 0) {
      dispatch(fetchAuditLogs());
    }
  }, [auditLogs.length, dispatch]);

  if (auditLogsLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <AuditLogModal
        auditLog={selected}
        isOpen={openLogModal}
        onClose={() => setOpenLogModal(false)}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("auditLogs.logs")}
        </h1>
        <div className="text-sm text-gray-600">
          {t("common.found")} {auditLogs?.length} {t("auditLogs.logs")}
        </div>
      </div>

      <Table
        aria-label="Games table"
        selectionMode="none"
        isHeaderSticky
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="action">{t("auditLogs.action")}</TableColumn>
          <TableColumn key="description">{t("auditLogs.author")}</TableColumn>
          <TableColumn key="timestamp">{t("auditLogs.time")}</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-2">
                {t("auditLogs.noLogs")}
              </div>
              <div className="text-gray-400 text-sm">
                {t("auditLogs.noLogs")}
              </div>
            </div>
          }
        >
          {(items || []).map((audit: AuditLog) => (
            <TableRow
              key={audit.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                handleSelect(audit);
                setOpenLogModal(true);
              }}
            >
              <TableCell>{audit?.description}</TableCell>
              <TableCell>{audit?.user?.email}</TableCell>
              <TableCell>{formatDate(audit?.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;
