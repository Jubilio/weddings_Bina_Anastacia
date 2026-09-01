import type { Metadata } from "next";
import "./globals.css";

const publicInvitationUrl = "https://weddings-bina-anastacia.nexovibe.workers.dev";
const socialTitle = "Anastácia & Bina | Convite de Casamento";
const socialDescription =
  "Celebre connosco o casamento de Anastácia e Bina, no dia 19 de dezembro de 2026, na Cidade de Nampula.";

export const metadata: Metadata = {
  metadataBase: new URL(publicInvitationUrl),
  title: socialTitle,
  description: socialDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    type: "website",
    locale: "pt_MZ",
    url: "/",
    siteName: "Casamento de Anastácia & Bina",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Anastácia e Bina — 19 de dezembro de 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
    images: ["/og.png"],
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
