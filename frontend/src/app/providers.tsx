"use client";

import { HeroUIProvider } from "@heroui/react";
import { AppProvider } from "@/contexts/AppProvider";
import Header from "@/components/ui-components/header";
import AiAssistantWidget from "@/components/ai-assistant/ai-widget";
import { SupportChat } from "@/components/chat/support-chat";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const isOnDashBoard = usePathname().includes("/dashboard");
  return (
    <HeroUIProvider>
      <AppProvider>
        {!isOnDashBoard && <AiAssistantWidget />}
        {!isOnDashBoard && <SupportChat />}
        <Header />
        <div className="container mx-auto">{children}</div>
      </AppProvider>
    </HeroUIProvider>
  );
}
