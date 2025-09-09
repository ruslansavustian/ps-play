"use client";

import { useCallback } from "react";
import { AccountSection } from "@/components/dashboard/account-section";
import { GameSection } from "@/components/dashboard/game-section";
import { Card, CardBody, Link, Tab, Tabs } from "@heroui/react";
import { withAuthCheck } from "@/hoc/withAuthCheck";
import { Loader } from "@/components/ui-components/loader";
import { OrderSection } from "@/components/dashboard/order-section";
import { AuditLogSection } from "@/components/dashboard/audit-log-section";

import { paths } from "@/utils/paths";
import { useTranslations } from "next-intl";
import { UsersSection } from "@/components/dashboard/users-section";
import { useAppDispatch, useAppSelector } from "@/stores(REDUX)";
import { logout, selectCurrentUser } from "@/stores(REDUX)/slices/auth-slice";

function DashboardPage() {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const tUsers = useTranslations("users");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogout = useCallback(async () => {
    console.log("handleLogout");
    dispatch(logout());
  }, [dispatch]);

  if (!currentUser) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-[10%]">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">{t("panelTitle")}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {tCommon("welcome")} {currentUser.name}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {tAuth("logout")}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex my-4 ">
        <Link
          className="rounded-md px-4 py-2 bg-black text-white"
          href={paths.support}
        >
          {t("supportPanel")}
        </Link>
      </div>
      <div className="mt-4">
        <Tabs aria-label="Options">
          <Tab key="orders" title={t("tabs.orders")}>
            <Card>
              <CardBody>
                <OrderSection />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="accounts" title={t("tabs.accounts")}>
            <Card>
              <CardBody>
                <AccountSection />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="games" title={t("tabs.games")}>
            <Card>
              <CardBody>
                <GameSection />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="audit-logs" title={t("tabs.auditLogs")}>
            <Card>
              <CardBody>
                <AuditLogSection />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="users" title={tUsers("users")}>
            <Card>
              <CardBody>
                <UsersSection />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default withAuthCheck(DashboardPage);
