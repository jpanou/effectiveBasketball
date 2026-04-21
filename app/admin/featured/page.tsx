import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/db";
import AdminLayout from "@/components/AdminLayout";
import AdminFeaturedManager from "@/components/admin/AdminFeaturedManager";

export default async function AdminFeaturedPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const posts = await getAllPostsAdmin();

  return (
    <AdminLayout>
      <div className="p-8">
        <h1
          className="text-3xl text-white mb-3"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΕΠΙΛΕΓΜΕΝΟ ΠΕΡΙΕΧΟΜΕΝΟ
        </h1>
        <p className="text-gray-500 text-sm mb-8">Επίλεξε ποιες αναρτήσεις θα εμφανίζονται στην αρχική σελίδα</p>
        <AdminFeaturedManager initialPosts={posts} />
      </div>
    </AdminLayout>
  );
}
