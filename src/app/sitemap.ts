import type { MetadataRoute } from "next";
import { BRAND } from "@/config/business";
import { PRODUCTS } from "@/lib/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/tienda/", "/encargos/", "/mayorista/", "/info/"];
  const products = PRODUCTS.filter((p) => !p.sample).map((p) => `/producto/${p.slug}/`);
  return [...pages, ...products].map((path) => ({ url: new URL(path, BRAND.siteUrl).toString() }));
}
