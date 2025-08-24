import { useApp } from "@/contexts/AppProvider";
import { Account } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { AccountTableCard } from "./account-table-card";

// Accounts List Component
export const AccountTable = () => {
  const { accounts, accountsLoading, fetchAccounts, deleteAccount } = useApp();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!accounts) {
      fetchAccounts();
    }
  }, [fetchAccounts, accounts]);

  const handleRowClick = useCallback(
    (account: Account) => {
      setSelectedAccount(account);
      onOpen();
    },
    [onOpen]
  );

  const handleDeleteAccount = useCallback(
    (accountId: number) => {
      deleteAccount(accountId);
    },
    [deleteAccount]
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (accountsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Игровые аккаунты</h1>
          <div className="text-sm text-gray-600">
            {accounts?.length || 0} аккаунтов найдено
          </div>
        </div>

        {/* Table */}
        <Table
          aria-label="Gaming accounts table"
          selectionMode="none"
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="id">ID</TableColumn>
            <TableColumn key="platform">ИГРЫ</TableColumn>
            <TableColumn key="games">ПЛАТФОРМА</TableColumn>
            <TableColumn key="pricePS">ЦЕНА PS</TableColumn>
            <TableColumn key="pricePS4">ЦЕНА PS4</TableColumn>
            <TableColumn key="created">СОЗДАНО</TableColumn>
            <TableColumn key="actions">ДЕЙСТВИЯ</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">
                  Аккаунты не найдены
                </div>
                <div className="text-gray-400 text-sm">
                  Пока нет доступных игровых аккаунтов.
                </div>
              </div>
            }
          >
            {(accounts || []).map((account) => (
              <TableRow
                key={account.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(account)}
              >
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                      {account.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="primary">
                    {account.games.name}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="primary">
                    {account.platform}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-green-600">
                    ${account.pricePS}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-green-600">
                    ${account.pricePS4}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDate(account.created)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => handleDeleteAccount(account.id!)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Account Detail Modal */}
      <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Детали аккаунта</h2>
          </ModalHeader>
          <ModalBody>
            {selectedAccount && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Игры
                  </label>
                  <p className="mt-1 text-gray-900">
                    {selectedAccount.games.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Платформа
                  </label>
                  <p className="mt-1 text-gray-900">
                    {selectedAccount.platform}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Цена PS
                    </label>
                    <p className="mt-1 text-lg font-bold text-green-600">
                      ${selectedAccount.pricePS}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Цена PS4
                    </label>
                    <p className="mt-1 text-lg font-bold text-green-600">
                      ${selectedAccount.pricePS4}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Создано
                  </label>
                  <p className="mt-1 text-gray-900">
                    {formatDate(selectedAccount.created)}
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
