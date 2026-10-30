import Link from "next/link";
import { PRODUCT_LINES } from "@/config/business";
import { productStatus, STATUS_LABEL } from "@/lib/catalog";
import { formatPrice, fromPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { ProductVisual } from "@/components/ProductVisual";
import s from "./ProductCard.module.css";

export function ProductCard({ product, index }: { product: Product; index?: number }) {
  const status = productStatus(product);
  const price = fromPrice(product.line, product.numbering);
  const hasBack = product.line !== "short" && (product.images.length > 1 || !!product.art);
  return (
    <article className={`${s.card} reveal`} data-status={status}>
      <Link href={`/producto/${product.slug}/`} className={s.link}>
        <div className={s.stage}>
          {index != null && <span className={s.index}>{String(index + 1).padStart(2, "0")}</span>}
          {product.sample && <span className={`badge-sample ${s.sample}`}>Muestra</span>}
          <div className={s.front}>
            <ProductVisual product={product} />
          </div>
          {hasBack && (
            <div className={s.back} aria-hidden="true">
              <ProductVisual product={product} view="back" number={product.numbering ? "10" : undefined} />
            </div>
          )}
        </div>
        <div className={s.body}>
          <p className={`tag ${s.line}`}>
            {PRODUCT_LINES[product.line].label}
            {product.edition ? ` · ${product.edition}` : ""}
          </p>
          <h3 className={s.name}>
            {product.team ? `${product.team} — ` : ""}
            {product.name}
          </h3>
          <div className={s.meta}>
            <span className={`status status-${status}`}>{STATUS_LABEL[status]}</span>
            <span className={`${s.price} num`}>
              {price != null && PRODUCT_LINES[product.line].base == null ? "Desde " : ""}
              {formatPrice(price)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
