import type { MetadataRoute } from "next";
import { BRAND } from "@/config/business";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/pedido/"] },
    sitemap: new URL("/sitemap.xml", BRAND.siteUrl).toString(),
  };
}
