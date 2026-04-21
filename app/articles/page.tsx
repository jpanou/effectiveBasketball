export const dynamic = "force-dynamic";

import PostListingPage from "@/components/PostListingPage";
import { getPosts } from "@/lib/db";

export default async function ArticlesPage() {
  const posts = await getPosts("article", "newest");
  return (
    <PostListingPage
      title="ΑΡΘΡΑ"
      subtitle="Αναλύσεις, απόψεις και βαθιά κατανόηση του παιχνιδιού"
      initialPosts={posts}
      type="article"
    />
  );
}
