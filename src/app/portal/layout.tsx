import type { Metadata } from "next";
import { PortalProvider } from "@/components/portal/PortalProvider";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: { default: "Portal", template: "%s · DuoGen Portal" },
  robots: { index: false, follow: false },
};

/** Signed-in workspace: its own sidebar, no public navbar or footer. */
export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return (
    <PortalProvider>
      <PortalShell>{children}</PortalShell>
    </PortalProvider>
  );
}
