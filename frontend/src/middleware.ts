import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // Локали проекта
  locales: ["en", "ua"],

  // Локаль по умолчанию
  defaultLocale: "ua",
});

export const config = {
  // Для App Router
  matcher: ["/((?!_next|.*\\..*).*)"],
};
