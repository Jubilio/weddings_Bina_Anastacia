import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casamento de Bina & Anastácia",
  description:
    "Temos a honra de convidar para a celebração do nosso casamento no dia 19 de Dezembro de 2026. Confirme a sua presença!",
  openGraph: {
    title: "Convite de Casamento | Bina & Anastácia",
    description:
      "Temos a honra de convidar para a celebração do nosso casamento no dia 19 de Dezembro de 2026, na Cidade de Nampula.",
    type: "website",
    locale: "pt_MZ",
    images: [
      {
        url: "/preview.jpg", // O utilizador deve colocar uma imagem com este nome na pasta public
        width: 1200,
        height: 630,
        alt: "Casamento de Bina & Anastácia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convite de Casamento | Bina & Anastácia",
    description:
      "Temos a honra de convidar para a celebração do nosso casamento no dia 19 de Dezembro de 2026.",
    images: ["/preview.jpg"],
  },
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
