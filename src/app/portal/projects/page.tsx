import type { Metadata } from "next";
import { ProjectsScreen } from "@/components/portal/screens/ProjectsScreen";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <ProjectsScreen />;
}
