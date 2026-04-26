export const dynamic = "force-dynamic";

import { getPostsPaginated } from "@/lib/db";
import EggrafahPage from "@/components/EggrafahPage";

export default async function EggrafahListPage() {
  const { posts, total } = await getPostsPaginated("document", "newest", 1, 9);
  return <EggrafahPage initialPosts={posts} initialTotal={total} />;
}
