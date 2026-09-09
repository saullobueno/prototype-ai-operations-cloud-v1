import { redirect } from "next/navigation";

export default function SettingsPermissionsRedirectPage() {
  redirect("/admin/permissions");
}
