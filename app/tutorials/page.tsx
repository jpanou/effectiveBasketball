export const dynamic = "force-dynamic";

import PostListingPage from "@/components/PostListingPage";
import { getPosts } from "@/lib/db";

export default function TutorialsPage() {
  const posts = getPosts("tutorial", "newest");
  return (
    <PostListingPage
      title="TUTORIALS"
      subtitle="Βίντεο και οδηγοί για τεχνικές και τακτικές"
      initialPosts={posts}
      type="tutorial"
    />
  );
}
