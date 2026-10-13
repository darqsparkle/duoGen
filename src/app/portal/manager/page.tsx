import type { Metadata } from "next";
import { ManagerPanelScreen } from "@/components/portal/screens/PanelScreens";

export const metadata: Metadata = { title: "Manager panel" };

export default function ManagerPage() {
  return <ManagerPanelScreen />;
}
