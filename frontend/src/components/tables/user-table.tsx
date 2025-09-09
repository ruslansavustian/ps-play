"use client";

import React, { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import {
  fetchUsers,
  selectUsers,
  selectUsersLoading,
} from "@/stores(REDUX)/slices/users.slice";
import { Loader } from "../ui-components/loader";

export const UserTable = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("users");
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const usersLoading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    if (users.length === 0) {
      console.log("UserTable: Dispatching fetchUsers");
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  if (usersLoading && users.length === 0) {
    return <Loader />;
  }

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
