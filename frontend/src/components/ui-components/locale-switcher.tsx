import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
export default function LocaleSwitcher() {
  const locale = useLocale();
  const otherLocale = locale === "en" ? "ua" : "en";
  const pathname = usePathname();

  return (
    <Link
      href={pathname}
      className="cursor-pointer flex-shrink-0"
      locale={otherLocale}
    >
      <Image
        src={`/flags/${locale}.svg`}
        className="cursor-pointer "
        alt={locale}
        width={30}
        height={30}
      />
    </Link>
  );
}
