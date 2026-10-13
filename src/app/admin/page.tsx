import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section data-nav="light" className="min-h-dvh bg-lilac px-4 pt-32 pb-24 sm:px-6 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <AdminDashboard />
      </div>
    </section>
  );
}
