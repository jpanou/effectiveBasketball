export const revalidate = 60;

import PostListingPage from "@/components/PostListingPage";
import { getPostsPaginated } from "@/lib/db";

export default async function TutorialsPage() {
  const { posts, total } = await getPostsPaginated("tutorial", "newest", 1, 9);
  return (
    <PostListingPage
      title="TUTORIALS"
      subtitle="Βίντεο και οδηγοί για τεχνικές και τακτικές"
      initialPosts={posts}
      initialTotal={total}
      type="tutorial"
    />
  );
}
