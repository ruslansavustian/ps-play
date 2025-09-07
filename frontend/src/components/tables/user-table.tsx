"use client";

import React, { useState } from "react";
import { User } from "@/types";
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { UserDetailModal } from "../modals/user-detail-modal";
import { useTranslations } from "next-intl";

interface UserTableProps {
  users: User[];
}

export const UserTable = ({ users }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [onClose, setOnClose] = useState(false);
  const t = useTranslations("users");

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  return (
    <div>
      <UserDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        selectedUser={selectedUser!}
      />
      <Table aria-label="Users table">
        <TableHeader>
          <TableColumn key="name">{t("userName")}</TableColumn>
          <TableColumn key="email">{t("userEmail")}</TableColumn>
          <TableColumn key="role">{t("userRole")}</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user: User) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleRowClick(user)}
            >
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role?.name ? user.role.name : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
