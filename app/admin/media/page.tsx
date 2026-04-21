import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import AdminMediaLibrary from "@/components/admin/AdminMediaLibrary";
import { readdir } from "fs/promises";
import path from "path";

async function getUploads(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    const files = await readdir(dir);
    return files.map((f) => `/uploads/${f}`);
  } catch {
    return [];
  }
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
