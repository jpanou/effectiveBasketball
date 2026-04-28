export const revalidate = 60;

import HeroSection from "@/components/home/HeroSection";
import ContentTypesSection from "@/components/home/ContentTypesSection";
import LatestPostsSection from "@/components/home/LatestPostsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getLatestPosts } from "@/lib/db";

export default async function HomePage() {
  const latest = await getLatestPosts(6);

  return (
    <>
      <HeroSection />
      <ContentTypesSection />
      <LatestPostsSection posts={latest} />
      <NewsletterSection />
    </>
  );
}
