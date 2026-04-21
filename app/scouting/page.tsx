export const dynamic = "force-dynamic";

import PostListingPage from "@/components/PostListingPage";
import { getPosts } from "@/lib/db";

export default async function ScoutingPage() {
  const posts = await getPosts("scouting", "newest");
  return (
    <PostListingPage
      title="SCOUTING"
      subtitle="Ανάλυση παικτών, ομάδων και αγωνιστικής στρατηγικής"
      initialPosts={posts}
      type="scouting"
    />
  );
}
