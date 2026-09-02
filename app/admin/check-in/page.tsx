import type { Metadata } from "next";
import { CheckInDashboard } from "@/components/check-in-dashboard";

export const metadata: Metadata = { title: "Check-in | Anastácia & Bina", robots: { index: false, follow: false } };
export default function CheckInPage() { return <CheckInDashboard />; }
