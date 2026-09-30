import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountClient from "./AccountClient";

export const metadata = {
  title: "My Account — Lumina Apparel",
  description: "Manage your Lumina Apparel account, profile, and preferences.",
};

/**
 * Server component that fetches user + profile data,
 * then passes it to the client component for interactivity.
 */
export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Double-check: proxy.ts should handle this, but be defensive
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <AccountClient
      user={JSON.parse(JSON.stringify(user))}
      profile={profile}
    />
  );
}
