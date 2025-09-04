"use client";

import { HeroUIProvider } from "@heroui/react";
import { AppProvider } from "@/contexts/AppProvider";
import Header from "@/components/ui-components/header";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <AppProvider>
        <Header />
        <div className="container mx-auto">{children}</div>
      </AppProvider>
    </HeroUIProvider>
  );
}
