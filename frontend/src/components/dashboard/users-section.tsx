"use client";
import React, { useEffect, useState } from "react";
import { UserTable } from "../tables/user-table";
import { MyButton } from "../ui-components/my-button";
import { useTranslations } from "next-intl";
import { useApp } from "@/contexts/AppProvider";
import { Loader } from "../ui-components/loader";

interface UsersSectionProps {
  handleAddUser: () => void;
}

export const UsersSection = () => {
  const t = useTranslations("users");
  const { users, fetchUsers, loading } = useApp();
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);

  const handleAddUser = () => {
    setIsCreateAccountModalOpen(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
      /> */}

      <div className="flex justify-end">
        <MyButton title={t("addUser")} onClick={handleAddUser} />
      </div>
      {users && users.length > 0 && !loading && <UserTable users={users} />}
    </div>
  );
};
