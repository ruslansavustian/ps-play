import { useApp } from "@/contexts/AppProvider";
import { Account, AccountStatus, GamePlatform } from "@/types";
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
  User,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { AccountTableCard } from "./account-table-card";

// Accounts List Component
export const AccountTable = () => {
  const { accounts, accountsLoading, fetchAccounts } = useApp();
  const [filter, setFilter] = useState<AccountStatus | "all">("all");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!accounts) {
      fetchAccounts();
    }
  }, [fetchAccounts, accounts]);

  const filteredAccounts = accounts?.filter(
    (account) => filter === "all" || account.status === filter
  );

  const handleRowClick = useCallback(
    (account: Account) => {
      setSelectedAccount(account);
      onOpen();
    },
    [onOpen]
  );

  const getPlatformIcon = (platform: GamePlatform) => {
    const icons = {
      [GamePlatform.PLAYSTATION]: "🎮",
      [GamePlatform.XBOX]: "🎯",
      [GamePlatform.STEAM]: "🚂",
      [GamePlatform.EPIC_GAMES]: "🚀",
      [GamePlatform.NINTENDO]: "🎌",
      [GamePlatform.BATTLE_NET]: "⚔️",
      [GamePlatform.ORIGIN]: "🌟",
      [GamePlatform.UBISOFT]: "🎪",
    };
    return icons[platform] || "🎮";
  };

  const getStatusColor = (status: AccountStatus) => {
    const colors = {
      [AccountStatus.AVAILABLE]: "success",
      [AccountStatus.SOLD]: "danger",
      [AccountStatus.RESERVED]: "warning",
      [AccountStatus.PENDING]: "primary",
    } as const;
    return colors[status] || "default";
  };

  const formatPlatform = (platform: GamePlatform) => {
    return platform
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Gaming Accounts</h1>
          <div className="text-sm text-gray-600">
            {filteredAccounts?.length || 0} accounts found
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "solid" : "bordered"}
            color="primary"
            onClick={() => setFilter("all")}
          >
            All ({accounts?.length || 0})
          </Button>
          {Object.values(AccountStatus).map((status) => {
            const count =
              accounts?.filter((acc) => acc.status === status).length || 0;
            return (
              <Button
                key={status}
                size="sm"
                variant={filter === status ? "solid" : "bordered"}
                color={getStatusColor(status)}
                onClick={() => setFilter(status)}
              >
                {status.replace("_", " ")} ({count})
              </Button>
            );
          })}
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
            <TableColumn key="account">ACCOUNT</TableColumn>
            <TableColumn key="platform">PLATFORM</TableColumn>
            <TableColumn key="level">LEVEL</TableColumn>
            <TableColumn key="status">STATUS</TableColumn>
            <TableColumn key="price">PRICE</TableColumn>
            <TableColumn key="verified">VERIFIED</TableColumn>
            <TableColumn key="created">CREATED</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">
                  No accounts found
                </div>
                <div className="text-gray-400 text-sm">
                  {filter === "all"
                    ? "No gaming accounts are available yet."
                    : `No accounts with status "${filter}" found.`}
                </div>
              </div>
            }
          >
            {(filteredAccounts || []).map((account) => (
              <TableRow
                key={account.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(account)}
              >
                <TableCell>
                  <User
                    name={account.username}
                    description={account.region || "Unknown region"}
                    avatarProps={{
                      name: account.username,
                      classNames: {
                        base: "w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm",
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getPlatformIcon(account.platform)}
                    </span>
                    <span className="font-medium">
                      {formatPlatform(account.platform)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {account.level || "Not specified"}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getStatusColor(account.status)}
                  >
                    {account.status.replace("_", " ").toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-green-600">
                    ${account.price}
                  </span>
                </TableCell>
                <TableCell>
                  {account.isVerified ? (
                    <Chip size="sm" color="primary" variant="flat">
                      ✓ Verified
                    </Chip>
                  ) : (
                    <span className="text-gray-400 text-sm">Unverified</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatDate(account.createdAt)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detailed Account Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          body: "py-0",
          backdrop: "bg-black/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {selectedAccount &&
                      getPlatformIcon(selectedAccount.platform)}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">Account Details</h3>
                    <p className="text-sm text-gray-500">
                      {selectedAccount?.username} -{" "}
                      {selectedAccount &&
                        formatPlatform(selectedAccount.platform)}
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                {selectedAccount && (
                  <div className="bg-white rounded-lg overflow-hidden">
                    <AccountTableCard account={selectedAccount} />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedAccount?.status === AccountStatus.AVAILABLE && (
                  <Button color="primary" onPress={onClose}>
                    Purchase Account
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
