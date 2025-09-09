import React, { useState } from "react";
import { AccountTable } from "../tables/account-table";
import { MyButton } from "../ui-components/my-button";
import { CreateAccountModal } from "../modals/create-account-modal";
import { useTranslations } from "next-intl";

export const AccountSection = () => {
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const t = useTranslations("accounts");
  const handleAddAccount = () => {
    setIsCreateAccountModalOpen(true);
  };

  return (
    <div>
      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
      />

      <div className="flex justify-end">
        <MyButton title={t("createAccount")} onClick={handleAddAccount} />
      </div>
      <AccountTable />
    </div>
  );
};
