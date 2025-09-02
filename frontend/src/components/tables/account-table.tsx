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
  Switch,
  Checkbox,
  checkbox,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { AccountDetailModal } from "../modals/account-detail-modal";

// Accounts List Component
export const AccountTable = () => {
  const { accounts, accountsLoading, deleteAccount } = useApp();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRowClick = useCallback(
    (account: Account) => {
      setSelectedAccount(account);
      onOpen();
    },
    [onOpen]
  );

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
          <div className=" text-gray-600">
            {accounts?.length || 0} аккаунтов найдено
          </div>
        </div>
        {selectedAccount?.id && (
          <AccountDetailModal
            isOpen={isOpen}
            onClose={onClose}
            setSelectedAccount={setSelectedAccount}
            selectedAccount={selectedAccount!}
          />
        )}
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

            <TableColumn key="p1">P1</TableColumn>
            <TableColumn key="p2PS4">P2PS4</TableColumn>
            <TableColumn key="p2PS5">P2PS5</TableColumn>
            <TableColumn key="p3">P3</TableColumn>
            <TableColumn key="p3A">P3A</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">
                  Аккаунты не найдены
                </div>
                <div className="text-gray-400 ">
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
                  {account.games?.map((game) => (
                    <p key={game.id}>{game.name}</p>
                  ))}
                </TableCell>

                <TableCell>
                  <Checkbox isSelected={account.P1} />
                </TableCell>
                <TableCell>
                  <Checkbox isSelected={account.P2PS4} />
                </TableCell>
                <TableCell>
                  <Checkbox isSelected={account.P2PS5} />
                </TableCell>
                <TableCell>
                  <Checkbox isSelected={account.P3} />
                </TableCell>
                <TableCell>
                  <Checkbox isSelected={account.P3A} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
