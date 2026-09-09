import { redirect } from "next/navigation";

export default function SettingsBillingRedirectPage() {
  redirect("/admin/billing");
}
