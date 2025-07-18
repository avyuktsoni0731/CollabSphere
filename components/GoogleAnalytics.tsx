"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const GoogleAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.gtag) {
      // @ts-ignore
      window.gtag("config", process.env.NEXT_PUBLIC_G_ANALYTICS_ID as string, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
};
