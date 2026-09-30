import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch initial data on the server
  const { data: items } = await supabase
    .from("cart_items") 
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">LA</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Lumina Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 hidden md:block">
            {user.email}
          </span>
          <form action={async () => {
            "use server";
            const supabaseServer = await createClient();
            await supabaseServer.auth.signOut();
            redirect("/login");
          }}>
            <button
              type="submit"
              className="text-sm px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition shadow-sm font-medium"
            >
              Log Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <DashboardClient initialItems={items || []} user={user} />
      </main>
    </div>
  );
}
