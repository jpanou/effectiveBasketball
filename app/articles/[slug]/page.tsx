import { notFound } from "next/navigation";
import { getPostBySlug, incrementViews } from "@/lib/db";
import PostDetailPage from "@/components/PostDetailPage";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.type !== "article" || !post.published) notFound();
  incrementViews(post.id);
  return <PostDetailPage post={post} />;
}
