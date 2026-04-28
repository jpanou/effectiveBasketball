import type { Metadata } from "next";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Effective Basketball",
  description: "Άρθρα, Tutorials και Scouting για την καλαθοσφαίριση από τον coach Στρατάκο",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className="bg-[#0A0A0A] text-white antialiased" suppressHydrationWarning>
        <ConditionalShell>{children}</ConditionalShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
