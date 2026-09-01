import type { Metadata } from "next";
import { GuestAdmin } from "@/components/guest-admin";

export const metadata: Metadata = {
  title: "Gestão de convidados | Anastácia & Bina",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <GuestAdmin />;
}
