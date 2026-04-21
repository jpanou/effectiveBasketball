import { notFound } from "next/navigation";
import { getPostBySlug, incrementViews } from "@/lib/db";
import PostDetailPage from "@/components/PostDetailPage";

export default async function TutorialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.type !== "tutorial" || !post.published) notFound();
  await incrementViews(post.id);
  return <PostDetailPage post={post} />;
}
