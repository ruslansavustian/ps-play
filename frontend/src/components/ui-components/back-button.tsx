import React from "react";
import { Link } from "@heroui/react";
import { paths } from "@/utils/paths";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const BackButton = () => {
  const t = useTranslations("common");
  return (
    <Link
      href={paths.games}
      className="flex flex-row items-center gap-2 cursor-pointer text-black"
    >
      <ArrowLeftIcon />
      <h1 className="text-2xl font-bold text-gray-900">{t("back")}</h1>
    </Link>
  );
};
