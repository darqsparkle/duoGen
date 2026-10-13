import type { Metadata } from "next";
import { FinanceScreen } from "@/components/portal/screens/FinanceScreen";

export const metadata: Metadata = { title: "Finance" };

export default function FinancePage() {
  return <FinanceScreen />;
}
