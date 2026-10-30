import realProducts from "@/data/products.json";
import { SAMPLE_PRODUCTS } from "@/data/samples";
import type { Availability, Product } from "@/lib/types";

const REAL = realProducts as Product[];

/**
 * Samples are shown only while no real inventory has been imported,
 * and can be switched off entirely with NEXT_PUBLIC_SHOW_SAMPLES=false.
 */
export const USING_SAMPLES = REAL.length === 0 && process.env.NEXT_PUBLIC_SHOW_SAMPLES !== "false";

export const PRODUCTS: Product[] = REAL.length > 0 ? REAL : USING_SAMPLES ? SAMPLE_PRODUCTS : [];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const featuredProducts = (n = 4) => {
  const f = PRODUCTS.filter((p) => p.featured);
  return (f.length ? f : PRODUCTS).slice(0, n);
};

const RANK: Availability[] = ["in_stock", "to_confirm", "special", "out_of_stock"];

/** Overall product status = best status among its sizes. */
export function productStatus(p: Product): Availability {
  if (!p.sizes.length) return "to_confirm";
  const best = p.sizes.map((s) => RANK.indexOf(s.status)).sort((a, b) => a - b)[0];
  const status = RANK[best];
  return status === "out_of_stock" && p.specialOrderable ? "special" : status;
}

export const STATUS_LABEL: Record<Availability, string> = {
  in_stock: "En stock",
  to_confirm: "A confirmar",
  special: "Por encargo",
  out_of_stock: "Sin stock",
};

export const STATUS_HINT: Record<Availability, string> = {
  in_stock: "Disponible según el último relevamiento de stock. Lo confirmamos al recibir tu pedido.",
  to_confirm: "Tenemos que confirmar disponibilidad antes de cerrar la compra.",
  special: "Sin stock ahora. Podemos consultar si se consigue como pedido especial.",
  out_of_stock: "No disponible en este momento.",
};

/** Whether a size can go into the cart as a standard purchase. */
export const isBuyable = (s: Availability) => s === "in_stock" || s === "to_confirm";
