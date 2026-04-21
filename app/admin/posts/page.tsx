import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/db";
import AdminLayout from "@/components/AdminLayout";
import AdminPostsTable from "@/components/admin/AdminPostsTable";

export default async function AdminPostsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const posts = getAllPostsAdmin();

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            ΑΝΑΡΤΗΣΕΙΣ
          </h1>
          <Link
            href="/admin/posts/new"
            className="bg-[#F97316] hover:bg-[#EA6D0E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            + Νέα Ανάρτηση
          </Link>
        </div>
        <AdminPostsTable initialPosts={posts} />
      </div>
    </AdminLayout>
  );
}
