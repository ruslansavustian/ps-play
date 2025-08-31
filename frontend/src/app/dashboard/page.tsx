"use client";

import { useApp } from "@/contexts/AppProvider";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { CreateGameModal } from "../../components/modals/create-game.modal";
import { AccountSection } from "@/components/dashboard/account-section";
import { GameSection } from "@/components/dashboard/game-section";
import { Card, CardBody, Link, Tab, Tabs } from "@heroui/react";
import { withAuthCheck } from "@/hoc/withAuthCheck";
import { Loader } from "@/components/ui-components/loader";
import { OrderSection } from "@/components/dashboard/order-section";
import { AuditLogSection } from "@/components/dashboard/audit-log-section";

import { paths } from "@/utils/paths";

function DashboardPage() {
  const {
    currentUser,
    logout,
    accounts,
    fetchAccounts,
    games,
    fetchGames,
    orders,
    auditLogs,
    fetchAuditLogs,
    fetchOrders,
  } = useApp();
  const router = useRouter();

  // Загружаем данные только если их нет
  useEffect(() => {
    if (!accounts) {
      fetchAccounts();
    }
  }, [fetchAccounts, accounts]);

  useEffect(() => {
    if (!auditLogs) {
      fetchAuditLogs();
    }
  }, [fetchAuditLogs, auditLogs]);

  useEffect(() => {
    if (!orders) {
      fetchOrders();
    }
  }, [fetchOrders, orders]);

  useEffect(() => {
    if (!games) {
      fetchGames();
    }
  }, [fetchGames, games]);

  if (!currentUser) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-[10%]">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Панель управления</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Добро пожаловать, {currentUser.name}!
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex my-4">
        <Link
          className="rounded-md px-4 py-2 bg-black text-white"
          href={paths.support}
        >
          Панель поддержки
        </Link>
      </div>
      <div className="mt-4">
        <Tabs aria-label="Options">
          <Tab key="orders" title="Заказы">
            <Card>
              <CardBody>
                <OrderSection />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="accounts" title="Аккаунты">
            <Card>
              <CardBody>
                <AccountSection />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="games" title="Игры">
            <Card>
              <CardBody>
                <GameSection />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="audit-logs" title="Логи">
            <Card>
              <CardBody>
                <AuditLogSection />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default withAuthCheck(DashboardPage);
