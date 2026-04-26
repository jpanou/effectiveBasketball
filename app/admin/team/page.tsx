import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import AdminMyTeam from "@/components/admin/AdminMyTeam";

export default async function AdminTeamPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminLayout>
      <div className="p-8">
        <h1
          className="text-3xl text-white mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          MY TEAM
        </h1>
        <p className="text-gray-500 text-sm mb-8">Διαχείριση πληροφοριών και φωτογραφιών ομάδας</p>
        <AdminMyTeam />
      </div>
    </AdminLayout>
  );
}
