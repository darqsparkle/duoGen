"use client";

import { RoleGate } from "../PortalShell";
import { NoAccess, PageHeader } from "../ui";
import { EmployeePanel, ManagerPanel } from "./OverviewScreen";

export function ManagerPanelScreen() {
  return (
    <RoleGate roles={["admin", "manager"]} fallback={<NoAccess />}>
      <PageHeader title="Manager panel" description="The manager workspace. We'll design this dashboard together." />
      <ManagerPanel />
    </RoleGate>
  );
}

export function EmployeePanelScreen() {
  return (
    <RoleGate roles={["admin", "employee"]} fallback={<NoAccess />}>
      <PageHeader title="Employee panel" description="The employee workspace. We'll design this dashboard together." />
      <EmployeePanel />
    </RoleGate>
  );
}
