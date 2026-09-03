import { redirect } from "next/navigation";

export default function AdminSecurityRedirectPage() {
  redirect("/settings/security");
}
