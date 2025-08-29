import React, { useState } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Listbox,
  ListboxItem,
  Checkbox,
} from "@heroui/react";
import { useApp } from "@/contexts/AppProvider";
import { Account } from "@/types";

interface HomeAccountsTableProps {
  accounts: Account[];
}

export const HomeAccountsTable = ({ accounts }: HomeAccountsTableProps) => {
  const [detailModal, setDetailModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleRowClick = (account: Account) => {
    setSelectedAccount(account);
    setDetailModal(true);
  };
  if (!accounts) return null;
  return (
    <>
      <Modal
        isOpen={detailModal}
        onOpenChange={setDetailModal}
        size="lg"
        className="max-w-2xl"
        onClose={() => setDetailModal(false)}
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedAccount?.games.name}
            </h2>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <div key="1">
                <p>Игры: {selectedAccount?.games.name}</p>
              </div>
              <div key="2">
                <div className="flex flex-row gap-2">
                  <p>Платаформа PS4:</p>{" "}
                  <Checkbox isSelected={selectedAccount?.platformPS4} />
                </div>
              </div>
              <div key="3">
                <div className="flex flex-row gap-2">
                  <p>Платаформа PS5:</p>{" "}
                  <Checkbox isSelected={selectedAccount?.platformPS5} />
                </div>
              </div>
              <div key="4">
                <p>Цена P1: ${selectedAccount?.priceP1}</p>
              </div>
              <div key="5">
                <p>Цена P2PS5: ${selectedAccount?.priceP2PS5}</p>
              </div>
              <div key="6">
                <p>Цена P2PS4: ${selectedAccount?.priceP2PS4}</p>
              </div>
              <div key="7">
                <p>Цена P3: ${selectedAccount?.priceP3}</p>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Table
        aria-label="Example static collection table"
        classNames={{
          base: "rounded-none",
        }}
      >
        <TableHeader>
          <TableColumn>Игры</TableColumn>
          <TableColumn>Платаформа PS4</TableColumn>
          <TableColumn>Платаформа PS5</TableColumn>
          <TableColumn>Цена P1</TableColumn>
          <TableColumn>Цена P2PS4</TableColumn>
          <TableColumn>Цена P2PS5</TableColumn>
          <TableColumn>Цена P3</TableColumn>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow
              key={account.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleRowClick(account)}
            >
              <TableCell>{account.games.name}</TableCell>
              <TableCell>{account.platformPS4 ? "Да" : "Нет"}</TableCell>
              <TableCell>{account.platformPS5 ? "Да" : "Нет"}</TableCell>
              <TableCell>${account.priceP1}</TableCell>
              <TableCell>${account.priceP2PS4}</TableCell>
              <TableCell>${account.priceP2PS5}</TableCell>
              <TableCell>${account.priceP3}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
