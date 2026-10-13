import type { Metadata } from "next";
import { EnquiriesScreen } from "@/components/portal/screens/EnquiriesScreen";

export const metadata: Metadata = { title: "Enquiries" };

export default function EnquiriesPage() {
  return <EnquiriesScreen />;
}
