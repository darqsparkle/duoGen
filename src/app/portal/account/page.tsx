import type { Metadata } from "next";
import { AccountScreen } from "@/components/portal/screens/AccountScreen";

export const metadata: Metadata = { title: "My account" };

export default function AccountPage() {
  return <AccountScreen />;
}
