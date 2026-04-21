import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import AdminSettings from "@/components/admin/AdminSettings";

export default async function SettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminLayout>
      <div className="p-8">
        <h1
          className="text-3xl text-white mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΡΥΘΜΙΣΕΙΣ ΛΟΓΑΡΙΑΣΜΟΥ
        </h1>
        <p className="text-gray-500 text-sm mb-8">Αλλαγή username και κωδικού πρόσβασης</p>
        <AdminSettings />
      </div>
    </AdminLayout>
  );
}
