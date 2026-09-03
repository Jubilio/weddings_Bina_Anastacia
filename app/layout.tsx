import type { Metadata } from "next";
import { invitationSocialMetadata } from "@/lib/social-preview";
import "./globals.css";

export const metadata: Metadata = invitationSocialMetadata();

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
