export const dynamic = "force-dynamic";

import HeroSection from "@/components/home/HeroSection";
import ContentTypesSection from "@/components/home/ContentTypesSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getFeaturedPosts } from "@/lib/db";

export default function HomePage() {
  const featured = getFeaturedPosts();

  return (
    <>
      <HeroSection />
      <ContentTypesSection />
      <FeaturedSection posts={featured} />
      <NewsletterSection />
    </>
  );
}
