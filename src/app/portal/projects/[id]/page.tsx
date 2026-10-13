import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectDetailScreen } from "@/components/portal/screens/ProjectDetailScreen";

export const metadata: Metadata = { title: "Project" };

// The project id is only known in the browser, so read it inside Suspense.
export default function ProjectPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading project…</p>}>
      <ProjectDetailScreen />
    </Suspense>
  );
}
