import { Garment } from "@/components/Garment";
import { asset } from "@/lib/paths";
import type { Product } from "@/lib/types";

/** Real photo when available, otherwise the labelled illustration. */
export function ProductVisual({
  product,
  view = "front",
  number,
  className,
  priority,
}: {
  product: Product;
  view?: "front" | "back";
  number?: string;
  className?: string;
  priority?: boolean;
}) {
  const img = view === "back" ? (product.images[1] ?? product.images[0]) : product.images[0];
  if (img) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(img.src)}
        alt={img.alt}
        width={img.width ?? 1000}
        height={img.height ?? 1250}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    );
  }
  // No photo yet: labelled illustration, or a neutral silhouette for imported products without art.
  const art = product.art ?? { pattern: "solid" as const, colors: ["#1c1c1c", "#2a2a2a"] as [string, string], trim: "#3a3a3a" };
  return (
    <Garment
      art={art}
      line={product.line}
      view={view}
      number={number}
      className={className}
      title={`${product.art ? "Ilustración" : "Silueta"} de ${product.name}${view === "back" ? ", espalda" : ""} (foto pendiente)`}
    />
  );
}
