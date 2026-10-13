import type { Metadata } from "next";
import { UsersScreen } from "@/components/portal/screens/UsersScreen";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return <UsersScreen />;
}
