import type { LineId } from "@/config/business";

/**
 * Stock state for a product or size. Kept deliberately honest:
 * - in_stock     → available for immediate purchase (per last stock import)
 * - out_of_stock → currently unavailable
 * - to_confirm   → availability must be confirmed by the team
 * - special      → not in stock, but can be requested as a special order
 */
export type Availability = "in_stock" | "out_of_stock" | "to_confirm" | "special";

export type ArtPattern = "solid" | "stripes" | "hoops" | "sash" | "halves" | "pinstripe";

/** Parameters for the illustrated garment used while real photos are missing. */
export interface GarmentArt {
  pattern: ArtPattern;
  /** [body, accent] colors */
  colors: [string, string];
  trim?: string;
  numberColor?: string;
}

export interface ProductImage {
  /** Path under /public, e.g. "/products/slug/front.webp" */
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SizeStock {
  size: string;
  status: Availability;
}

export interface Product {
  slug: string;
  name: string;
  /** Club or national team, only when verified. */
  team?: string;
  /** Season or edition, only when verified. */
  edition?: string;
  line: LineId;
  sizes: SizeStock[];
  /** Whether a number can be printed on this item. */
  numbering: boolean;
  images: ProductImage[];
  art?: GarmentArt;
  description?: string;
  /** Can be sourced on request when out of stock. */
  specialOrderable?: boolean;
  featured?: boolean;
  /** Development sample — never real inventory. */
  sample?: boolean;
}
