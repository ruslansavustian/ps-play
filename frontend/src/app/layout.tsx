"use client";

import { HeroUIProvider } from "@heroui/react";
import "./globals.css";

import { AppProvider } from "@/contexts/AppProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <HeroUIProvider>
          <AppProvider>{children}</AppProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
