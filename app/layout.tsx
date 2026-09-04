import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
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
      <body>
        {children}
        <Toaster
          className="toaster group wedding-toaster"
          theme="light"
          position="top-center"
          closeButton
          visibleToasts={3}
          toastOptions={{ duration: 4200 }}
        />
      </body>
    </html>
  );
}
