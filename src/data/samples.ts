import type { Product } from "@/lib/types";

/**
 * DEVELOPMENT SAMPLES — NOT REAL INVENTORY.
 * They exist only so the layout can be reviewed before the real stock sheet is
 * imported. They are flagged `sample: true`, are labelled "Muestra" across the
 * UI and are hidden automatically once src/data/products.json has products
 * (or immediately if NEXT_PUBLIC_SHOW_SAMPLES=false).
 */
const S = ["S", "M", "L", "XL"];
const all = (status: Product["sizes"][number]["status"]) => S.map((size) => ({ size, status }));

export const SAMPLE_PRODUCTS: Product[] = [
  {
    slug: "muestra-franjas-negro-oro",
    name: "Franjas negro y oro",
    line: "camiseta",
    sizes: [
      { size: "S", status: "in_stock" },
      { size: "M", status: "in_stock" },
      { size: "L", status: "out_of_stock" },
      { size: "XL", status: "to_confirm" },
    ],
    numbering: true,
    images: [],
    art: { pattern: "stripes", colors: ["#0b0b0b", "#D4AF37"], trim: "#D4AF37", numberColor: "#ffffff" },
    featured: true,
    specialOrderable: true,
    sample: true,
  },
  {
    slug: "muestra-blanca-banda-roja",
    name: "Blanca con banda",
    line: "camiseta",
    sizes: all("in_stock"),
    numbering: true,
    images: [],
    art: { pattern: "sash", colors: ["#f4f1ea", "#b3202a"], trim: "#111", numberColor: "#111111" },
    featured: true,
    sample: true,
  },
  {
    slug: "muestra-mitades-azul",
    name: "Mitades azul y crema",
    line: "camiseta",
    sizes: all("to_confirm"),
    numbering: true,
    images: [],
    art: { pattern: "halves", colors: ["#13294b", "#ece4cf"], trim: "#ece4cf", numberColor: "#ffffff" },
    featured: true,
    specialOrderable: true,
    sample: true,
  },
  {
    slug: "muestra-manga-larga-verde",
    name: "Manga larga aros verdes",
    line: "manga-larga",
    sizes: all("in_stock"),
    numbering: true,
    images: [],
    art: { pattern: "hoops", colors: ["#0f3d2e", "#e8e2d0"], trim: "#e8e2d0", numberColor: "#ffffff" },
    featured: true,
    sample: true,
  },
  {
    slug: "muestra-short-negro",
    name: "Short negro",
    line: "short",
    sizes: all("in_stock"),
    numbering: true,
    images: [],
    art: { pattern: "solid", colors: ["#0b0b0b", "#D4AF37"], trim: "#D4AF37", numberColor: "#D4AF37" },
    sample: true,
  },
  {
    slug: "muestra-short-blanco",
    name: "Short blanco",
    line: "short",
    sizes: all("out_of_stock"),
    numbering: true,
    images: [],
    art: { pattern: "solid", colors: ["#f4f1ea", "#111111"], trim: "#111", numberColor: "#111111" },
    specialOrderable: true,
    sample: true,
  },
  {
    slug: "muestra-bastones-finos",
    name: "Bastones finos grafito",
    line: "camiseta",
    sizes: all("out_of_stock"),
    numbering: false,
    images: [],
    art: { pattern: "pinstripe", colors: ["#2a2a2a", "#8a8a8a"], trim: "#D4AF37", numberColor: "#ffffff" },
    specialOrderable: true,
    sample: true,
  },
];
