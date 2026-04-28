export const revalidate = 60;

import PostListingPage from "@/components/PostListingPage";
import { getPostsPaginated } from "@/lib/db";

export default async function ScoutingPage() {
  const { posts, total } = await getPostsPaginated("scouting", "newest", 1, 9);
  return (
    <PostListingPage
      title="SCOUTING"
      subtitle="Ανάλυση παικτών, ομάδων και αγωνιστικής στρατηγικής"
      initialPosts={posts}
      initialTotal={total}
      type="scouting"
    />
  );
}
