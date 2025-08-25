"use client";

import { useApp } from "@/contexts/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateAccountModal } from "../../components/modals/create-account-modal";
import { CreateGameModal } from "../../components/modals/create-game.modal";
import { MyButton } from "../../components/ui-components/my-button";
import { AccountCard } from "../../components/ui-components/account-card";
import { AccountSection } from "@/components/dashboard/account-section";
import { GameSection } from "@/components/dashboard/game-section";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";

export default function DashboardPage() {
  const {
    currentUser,
    logout,
    loading,
    accounts,
    accountsLoading,
    fetchCurrentUser,
    fetchAccounts,
    games,
    fetchGames,
  } = useApp();
  const router = useRouter();

  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);
  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, [currentUser, fetchCurrentUser]);

  useEffect(() => {
    if (!accounts) {
      fetchAccounts();
    }
  }, [fetchAccounts, accounts]);
  useEffect(() => {
    if (!games) {
      fetchGames();
    }
  }, [fetchGames, games]);
  console.log(accounts);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const handleAddGame = () => {
    setIsCreateGameModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-gray-50 px-[10%]">
      <CreateGameModal
        isOpen={isCreateGameModalOpen}
        onClose={() => setIsCreateGameModalOpen(false)}
      />
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
      <div className="mt-4">
        <Tabs aria-label="Options">
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
                <GameSection handleAddGame={handleAddGame} />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
