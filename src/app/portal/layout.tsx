import type { Metadata } from "next";
import { Suspense } from "react";
import { PortalProvider } from "@/components/portal/PortalProvider";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: { default: "Portal", template: "%s · DuoGen Portal" },
  robots: { index: false, follow: false },
};

/**
 * Signed-in workspace: its own sidebar, no public navbar or footer.
 * The shell reads the URL (for the active menu item), which for dynamic routes
 * like /portal/projects/[id] is only known at request time — hence Suspense.
 */
export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return (
    <PortalProvider>
      <Suspense fallback={<div className="flex min-h-dvh flex-1 items-center justify-center bg-lilac text-sm text-muted">Loading your workspace…</div>}>
        <PortalShell>{children}</PortalShell>
      </Suspense>
    </PortalProvider>
  );
}
