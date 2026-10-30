import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRAND, PRODUCT_LINES } from "@/config/business";
import { getProduct, PRODUCTS, productStatus } from "@/lib/catalog";
import { fromPrice } from "@/lib/pricing";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "./ProductDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  // Static export needs at least one path; "_" renders a 404.
  return PRODUCTS.length ? PRODUCTS.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const title = [p.team, p.name].filter(Boolean).join(" — ");
  return {
    title,
    description: `${PRODUCT_LINES[p.line].label} ${title}. Envíos a todo el país. Producto importado, no oficial.`,
    alternates: { canonical: `/producto/${p.slug}/` },
    robots: p.sample ? { index: false } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();

  const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.line === p.line)
    .concat(PRODUCTS.filter((x) => x.slug !== p.slug && x.line !== p.line))
    .slice(0, 4);

  const price = fromPrice(p.line, p.numbering);
  const status = productStatus(p);
  // Structured data only for real products with a known price — never for samples.
  const jsonLd =
    !p.sample && price != null
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: [p.team, p.name].filter(Boolean).join(" — "),
          image: p.images.map((i) => new URL(i.src, BRAND.siteUrl).toString()),
          brand: { "@type": "Brand", name: "ATOK" },
          offers: {
            "@type": "Offer",
            priceCurrency: "ARS",
            price,
            availability:
              status === "in_stock" ? "https://schema.org/InStock" : status === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/PreOrder",
            url: new URL(`/producto/${p.slug}/`, BRAND.siteUrl).toString(),
          },
        }
      : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <ProductDetail product={p} />
      {related.length > 0 && (
        <section className="section paper" aria-labelledby="related">
          <div className="wrap">
            <h2 id="related" className="display h-md" style={{ marginBottom: 40 }}>
              También en el{" "}
              <span className="serif gold" style={{ textTransform: "none" }}>
                vestuario
              </span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 42vw), 1fr))", gap: 20 }}>
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
