import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import PostEditor from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminLayout>
      <div className="p-8">
        <h1
          className="text-3xl text-white mb-8"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          ΝΕΑ ΑΝΑΡΤΗΣΗ
        </h1>
        <PostEditor />
      </div>
    </AdminLayout>
  );
}
