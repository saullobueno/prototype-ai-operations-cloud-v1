import { redirect } from "next/navigation";

export default function AccountIndexRedirectPage() {
  redirect("/account/security");
}
