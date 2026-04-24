export const dynamic = "force-dynamic";

import { getPosts } from "@/lib/db";
import EggrafahPage from "@/components/EggrafahPage";

export default async function EggrafahListPage() {
  const posts = await getPosts("document", "newest");
  return <EggrafahPage initialPosts={posts} />;
}
