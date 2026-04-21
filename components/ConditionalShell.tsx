"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RadialGradientBackground } from "@/components/ui/radial-gradient-background";

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {!isHome && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <RadialGradientBackground />
        </div>
      )}
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
