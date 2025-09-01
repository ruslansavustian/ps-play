import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const otherLocale = locale === "en" ? "ua" : "en";
  const pathname = usePathname();

  return (
    <Link href={pathname} locale={otherLocale}>
      <Image src={`/flags/${locale}.svg`} alt={locale} width={20} height={20} />
    </Link>
  );
}
