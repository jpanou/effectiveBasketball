export const revalidate = 60;

import PostListingPage from "@/components/PostListingPage";
import { getPostsPaginated } from "@/lib/db";

export default async function ArticlesPage() {
  const { posts, total } = await getPostsPaginated("article", "newest", 1, 9);
  return (
    <PostListingPage
      title="ΑΡΘΡΑ"
      subtitle="Αναλύσεις, απόψεις και βαθιά κατανόηση του παιχνιδιού"
      initialPosts={posts}
      initialTotal={total}
      type="article"
    />
  );
}
