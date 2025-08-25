import React, { useState } from "react";
import { AccountTable } from "../tables/account-table";
import { MyButton } from "../ui-components/my-button";
import { CreateAccountModal } from "../modals/create-account-modal";

interface AccountSectionProps {
  handleAddAccount: () => void;
}

export const AccountSection = () => {
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);

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
        <MyButton title="+ Добавить аккаунт" onClick={handleAddAccount} />
      </div>
      <AccountTable />
    </div>
  );
};
