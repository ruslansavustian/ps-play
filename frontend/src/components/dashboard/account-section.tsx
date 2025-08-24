import React from "react";
import { AccountTable } from "../tables/account-table";
import { MyButton } from "../ui-components/my-button";

interface AccountSectionProps {
  handleAddAccount: () => void;
}

export const AccountSection = ({ handleAddAccount }: AccountSectionProps) => {
  return (
    <div>
      <div className="flex justify-end">
        <MyButton title="+ Добавить аккаунт" onClick={handleAddAccount} />
      </div>
      <AccountTable />
    </div>
  );
};
