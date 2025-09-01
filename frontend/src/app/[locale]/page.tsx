"use client";

import { useApp } from "@/contexts/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Account } from "@/types";
import { AccountTable } from "@/components/tables/account-table";
import { HomeAccountsTable } from "@/components/tables/home-accounts-table";

import { SupportChat } from "@/components/chat/support-chat";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/ui-components/locale-switcher";
import Header from "@/components/ui-components/header";
// import { TestChat } from "@/components/chat/test-chat";

export default function Home() {
  const { loading, publicAccounts, fetchPublicAccounts } = useApp();
  const t = useTranslations();
  useEffect(() => {
    if (!publicAccounts) {
      fetchPublicAccounts();
    }
  }, [fetchPublicAccounts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min -h-screen  container mx-auto">
      <Header />
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
