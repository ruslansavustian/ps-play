import React, { useState } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { useApp } from "@/contexts(NOT USED ANYMORE)/AppProvider";
import { Account } from "@/types";
import { CustomersCreateModal } from "@/components/modals/customers-create-modal";
import { useAsyncList } from "@react-stately/data";
import { useTranslations } from "next-intl";

interface HomeAccountsTableProps {
  accounts: Account[];
}

export const HomeAccountsTable = ({ accounts }: HomeAccountsTableProps) => {
  const { loading } = useApp();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [customersCreateModal, setCustomersCreateModal] = useState(false);
  const handleRowClick = (account: Account) => {
    setSelectedAccount(account);

    setCustomersCreateModal(true);
  };

  const t = useTranslations();
  const list = useAsyncList({
    async load() {
      return {
        items: accounts || [],
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first: any;
          let second: any;

          switch (sortDescriptor.column) {
            case "id":
              first = a.id;
              second = b.id;
              break;
            case "gameName":
              first = a.games?.[0]?.name || "";
              second = b.games?.[0]?.name || "";
              break;
            case "priceP1":
              first = a.priceP1 || 0;
              second = b.priceP1 || 0;
              break;
            case "priceP2PS4":
              first = a.priceP2PS4 || 0;
              second = b.priceP2PS4 || 0;
              break;
            case "priceP2PS5":
              first = a.priceP2PS5 || 0;
              second = b.priceP2PS5 || 0;
              break;
            case "priceP3":
              first = a.priceP3 || 0;
              second = b.priceP3 || 0;
              break;
            case "priceP3A":
              first = a.priceP3A || 0;
              second = b.priceP3A || 0;
              break;
            default:
              first = a.id;
              second = b.id;
          }

          if (typeof first === "number" && typeof second === "number") {
            let cmp = first < second ? -1 : 1;
            if (sortDescriptor.direction === "descending") {
              cmp *= -1;
            }
            return cmp;
          }

          if (typeof first === "string" && typeof second === "string") {
            let cmp = first.localeCompare(second);
            if (sortDescriptor.direction === "descending") {
              cmp *= -1;
            }
            return cmp;
          }

          return 0;
        }),
      };
    },
  });
  if (!accounts) return null;
  return (
    <>
      {selectedAccount && selectedAccount.id && (
        <CustomersCreateModal
          isOpen={customersCreateModal}
          onClose={() => {
            setCustomersCreateModal(false);
            setSelectedAccount(null);
          }}
          accountId={selectedAccount?.id}
        />
      )}

      <Table
        aria-label="Example static collection table"
        isStriped
        isCompact
        isHeaderSticky
        classNames={{
          base: "rounded-none",
        }}
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader className="">
          <TableColumn key="id" allowsSorting>
            ID
          </TableColumn>
          <TableColumn key="gameName" allowsSorting>
            {t("accounts.games")}
          </TableColumn>
          <TableColumn key="priceP1" allowsSorting>
            {t("accounts.purchaseType1")}
          </TableColumn>
          <TableColumn key="priceP2PS4" allowsSorting>
            {t("accounts.purchaseType2")}
          </TableColumn>
          <TableColumn key="priceP2PS5" allowsSorting>
            {t("accounts.purchaseType3")}
          </TableColumn>
          <TableColumn key="priceP3" allowsSorting>
            {t("accounts.purchaseType4")}
          </TableColumn>
          <TableColumn key="priceP3A" allowsSorting>
            {t("accounts.purchaseType5")}
          </TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          items={list.items}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(account: Account) => (
            <TableRow
              key={account.id}
              className="cursor-pointer hover:bg-gray-400 transition-colors hover:rounded-lg"
              onClick={() => handleRowClick(account)}
            >
              <TableCell>{account.id}</TableCell>
              <TableCell>
                {account.games?.map((game) => game.name).join("/ ")}
              </TableCell>
              <TableCell>${account.priceP1}</TableCell>
              <TableCell>${account.priceP2PS4}</TableCell>
              <TableCell>${account.priceP2PS5}</TableCell>
              <TableCell>${account.priceP3}</TableCell>
              <TableCell>${account.priceP3A}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
