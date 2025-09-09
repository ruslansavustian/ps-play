"use client";
import React, { useState } from "react";
import { UserTable } from "../tables/user-table";
import { MyButton } from "../ui-components/my-button";
import { useTranslations } from "next-intl";

export const UsersSection = () => {
  const t = useTranslations("users");

  const [, setIsCreateAccountModalOpen] = useState(false);

  const handleAddUser = () => {
    setIsCreateAccountModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-end">
        <MyButton title={t("addUser")} onClick={handleAddUser} />
      </div>
      <UserTable />
    </div>
  );
};
