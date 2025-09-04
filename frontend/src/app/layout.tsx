"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body cz-shortcut-listen="true">{children}</body>
    </html>
  );
}
