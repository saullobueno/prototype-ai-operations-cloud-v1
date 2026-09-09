import { redirect } from "next/navigation";

export default function SettingsTeamsRedirectPage() {
  redirect("/admin/teams");
}
