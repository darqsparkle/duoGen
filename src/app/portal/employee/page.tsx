import type { Metadata } from "next";
import { EmployeePanelScreen } from "@/components/portal/screens/PanelScreens";

export const metadata: Metadata = { title: "Employee panel" };

export default function EmployeePage() {
  return <EmployeePanelScreen />;
}
