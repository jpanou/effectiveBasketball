import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/db";
import AdminLayout from "@/components/AdminLayout";
import PostEditor from "@/components/admin/PostEditor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const posts = getAllPostsAdmin();
  const post = posts.find((p) => p.id === Number(id));
  if (!post) notFound();

  return (
    <AdminLayout>
      <div className="p-8">
        <h1
          className="text-3xl text-white mb-8"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΕΠΕΞΕΡΓΑΣΙΑ ΑΝΑΡΤΗΣΗΣ
        </h1>
        <PostEditor post={post} />
      </div>
    </AdminLayout>
  );
}
