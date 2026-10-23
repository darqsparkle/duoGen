import type { Metadata } from "next";
import { CareersScreen } from "@/components/portal/screens/CareersScreen";

export const metadata: Metadata = { title: "Careers" };

export default function CareersAdminPage() {
  return <CareersScreen />;
}
