import { redirect } from "next/navigation";

export default function SettingsRolesRedirectPage() {
  redirect("/admin/roles");
}
