import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casamento de Bina & Anastácia",
  description:
    "Convite de casamento de Bina Miguel Hilário e Anastácia Hermínio Albrrto, com confirmação de presença e lista de presentes.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-MZ">
      <body>{children}</body>
    </html>
  );
}
