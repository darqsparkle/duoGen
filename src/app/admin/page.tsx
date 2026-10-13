import { redirect } from "next/navigation";

/** The old enquiries dashboard now lives in the portal. */
export default function AdminRedirect() {
  redirect("/portal/enquiries");
}
