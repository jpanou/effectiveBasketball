import type { Metadata } from "next";
import "./globals.css";
import { Bebas_Neue, Inter, Roboto_Condensed } from "next/font/google";
import ConditionalShell from "@/components/ConditionalShell";
import ConsentAwareAnalytics from "@/components/ConsentAwareAnalytics";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  adjustFontFallback: true,
});

const robotCondensed = Roboto_Condensed({
  subsets: ["latin", "greek"],
  display: "swap",
  variable: "--font-roboto-condensed",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Effective Basketball",
  description: "Άρθρα, Tutorials και Scouting για την καλαθοσφαίριση από τον coach Στρατάκο",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={`${bebasNeue.variable} ${inter.variable} ${robotCondensed.variable}`}>
      <body className="bg-[#0A0A0A] text-white antialiased" suppressHydrationWarning>
        <ConditionalShell>{children}</ConditionalShell>
        <ConsentAwareAnalytics />
      </body>
    </html>
  );
}
