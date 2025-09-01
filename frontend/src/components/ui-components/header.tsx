"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./locale-switcher";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("navigation");
  const pathname = usePathname();

  const menuItems = [
    { name: t("accounts"), href: "/" },
    { name: t("games"), href: "/games" },
    { name: t("terms"), href: "/terms" },
    { name: t("about"), href: "/about" },
    { name: t("contacts"), href: "/contacts" },
  ];

  const isActive = (href: string) => pathname.includes(href);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white shadow-sm border-b border-gray-200 rounded-xl mt-4"
      maxWidth="xl"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PS</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Play</span>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) =>
          item.name === t("contacts") ? (
            <Dropdown key={item.href}>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="bg-white text-black border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md px-4 py-2 rounded-lg"
                    radius="lg"
                    variant="flat"
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="Contact information"
                itemClasses={{
                  base: "gap-4",
                }}
                className="bg-white border border-gray-200 shadow-lg rounded-lg"
              >
                <DropdownItem
                  key="telegram"
                  description="Напишіть нам в Telegram "
                  className="hover:bg-gray-50"
                >
                  <Link
                    as={Link}
                    href="https://t.me/PSPLAY_NOTIFICATION_BOT"
                    className="w-full bg-transparent text-black transition-colors"
                  >
                    Telegram
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key="email"
                  description="Надішліть email info@psplay.io"
                  className="hover:bg-gray-50"
                >
                  <Link
                    as={Link}
                    href="mailto:info@psplay.io"
                    className="w-full bg-transparent text-black transition-colors"
                  >
                    Email
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key="phone"
                  description="Зателефонуйте нам +38066666665"
                  className="hover:bg-gray-50"
                >
                  <Link
                    as={Link}
                    href="tel:+38066666665"
                    className="w-full bg-transparent text-black transition-colors"
                  >
                    Телефон
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <NavbarItem key={item.href} isActive={isActive(item.href)}>
              <Button
                as={Link}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? "bg-black text-white shadow-lg border-2 border-gray-800"
                    : "bg-white text-black border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                } transition-all duration-200 shadow-sm hover:shadow-md px-4 py-2 rounded-lg`}
                variant="flat"
              >
                {item.name}
              </Button>
            </NavbarItem>
          )
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <LocaleSwitcher />
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/login"
            variant="flat"
            className="bg-black text-white hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-lg px-6 py-2 rounded-lg border border-gray-700"
          >
            {t("login")}
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-white">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              href={item.href}
              className={`w-full ${
                isActive(item.href)
                  ? "text-primary font-semibold"
                  : "text-gray-600"
              }`}
              size="lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button
            as={Link}
            color="primary"
            href="/login"
            variant="flat"
            className="w-full"
            onPress={() => setIsMenuOpen(false)}
          >
            {t("login")}
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
