"use client";

import { HomeAccountsTable } from "@/components/tables/home-tables/home-accounts-table";
import React, { useEffect } from "react";

import { useApp } from "@/contexts/AppProvider";
import { useTranslations } from "next-intl";
import { SupportChat } from "@/components/chat/support-chat";

export default function AccountsPage() {
  const { publicAccounts, fetchPublicAccounts } = useApp();
  const t = useTranslations();

  useEffect(() => {
    if (!publicAccounts) {
      fetchPublicAccounts();
    }
  }, [fetchPublicAccounts]);

  return (
    <div className="min -h-screen ">
      <main>
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {t("home.title")}
              </h2>
              <p className="mt-2 text-gray-600">{t("home.description")}</p>
            </div>
          </div>
        </div>
        {publicAccounts && <HomeAccountsTable accounts={publicAccounts} />}
        <SupportChat />
      </main>
    </div>
  );
}
