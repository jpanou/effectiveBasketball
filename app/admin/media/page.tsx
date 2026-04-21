import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import AdminMediaLibrary from "@/components/admin/AdminMediaLibrary";
import { supabase } from "@/lib/supabase";

const BUCKET = "uploads";

async function getUploads(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl);
}

export default async function AdminMediaPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const files = await getUploads();

  return (
    <AdminLayout>
      <div className="p-8">
        <h1
          className="text-3xl text-white mb-8"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΑΡΧΕΙΑ ΜΕΣΩΝ
        </h1>
        <AdminMediaLibrary initialFiles={files} />
      </div>
    </AdminLayout>
  );
}
