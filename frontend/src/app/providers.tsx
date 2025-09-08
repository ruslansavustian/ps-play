"use client";

import { HeroUIProvider } from "@heroui/react";
import { AppProvider } from "@/contexts/AppProvider";
import Header from "@/components/ui-components/header";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const isOnDashBoard = usePathname().includes("/dashboard");

  return (
    <HeroUIProvider>
      <AppProvider>
        <div className="relative w-full h-full">
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-75 ease-out"
            style={{
              backgroundImage: "url('/background-image.jpg')",
            }}
          />

          <div className="relative z-10 w-full lg:max-w-[70%] mx-auto">
            <Header />

            <div className="relative">
              <div className="flex flex-col gap-10">{children}</div>
            </div>
          </div>

          {/* Widgets wrapper - constrains fixed positioned widgets to content area */}
          <div className="fixed inset-0 pointer-events-none lg:left-[15%] lg:right-[15%]">
            <div className="relative w-full h-full pointer-events-auto"></div>
          </div>
        </div>
      </AppProvider>
    </HeroUIProvider>
  );
}
