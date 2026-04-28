"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const STORAGE_KEY = "eb-cookie-consent";

export default function ConsentAwareAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    try {
      setConsented(localStorage.getItem(STORAGE_KEY) === "accepted");
    } catch {
      // localStorage unavailable
    }

    // Re-check if user makes a decision after page load
    const handler = () => {
      try {
        setConsented(localStorage.getItem(STORAGE_KEY) === "accepted");
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!consented) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
