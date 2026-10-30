/**
 * ATOK business configuration — the single source of truth for prices,
 * payment rules, contact channels and policies. Components never hardcode
 * any of these values; update them here and the whole site follows.
 */

export const BRAND = {
  name: "ATOK",
  instagramHandle: "atok.arg",
  instagramUrl: "https://www.instagram.com/atok.arg/",
  /** Opens a direct-message thread with the account. Instagram does not allow prefilled text. */
  instagramDmUrl: "https://ig.me/m/atok.arg",
  /**
   * WhatsApp number in international format without "+" or spaces (e.g. "5491100000000").
   * Leave null until ATOK confirms a number: when set, orders open WhatsApp with the
   * message already written instead of the copy-and-paste Instagram flow.
   */
  whatsapp: null as string | null,
  siteUrl: "https://atok.com.ar", // TODO: replace with the real domain before deploying
} as const;

/* ------------------------------------------------------------------ */
/* Retail prices (ARS). Never invent discounts or previous prices.     */
/* ------------------------------------------------------------------ */

export type LineId = "camiseta" | "manga-larga" | "short";

export interface ProductLine {
  id: LineId;
  label: string;
  plural: string;
  /** Price without a number. null = not communicated yet, must be consulted. */
  base: number | null;
  /** Price with a number printed. null = numbering not offered / not priced. */
  numbered: number | null;
}

export const PRODUCT_LINES: Record<LineId, ProductLine> = {
  camiseta: { id: "camiseta", label: "Camiseta", plural: "Camisetas", base: 50_000, numbered: 60_000 },
  "manga-larga": {
    id: "manga-larga",
    label: "Camiseta manga larga",
    plural: "Manga larga",
    // Only the numbered long-sleeve price has been communicated.
    base: null,
    numbered: 65_000,
  },
  short: { id: "short", label: "Short", plural: "Shorts", base: 50_000, numbered: 55_000 },
};

/** Rows of the public price list, in display order. */
export const PRICE_LIST: { line: LineId; numbered: boolean; label: string }[] = [
  { line: "camiseta", numbered: false, label: "Camiseta" },
  { line: "camiseta", numbered: true, label: "Camiseta con número" },
  { line: "manga-larga", numbered: true, label: "Manga larga con número" },
  { line: "short", numbered: false, label: "Short" },
  { line: "short", numbered: true, label: "Short con número" },
];

/* ------------------------------------------------------------------ */
/* Wholesale — only the communicated offer. No automatic tiers.        */
/* ------------------------------------------------------------------ */

export const WHOLESALE = {
  bundle: [
    { line: "camiseta" as LineId, label: "Camisetas", qty: 5, unit: 35_000 },
    { line: "short" as LineId, label: "Shorts", qty: 5, unit: 32_000 },
  ],
  /** Orders from this many items may get better pricing — always confirmed by the team. */
  largerOrderThreshold: 15,
  note: "Las combinaciones dependen del stock disponible.",
};

export const wholesaleTotal = () => WHOLESALE.bundle.reduce((s, b) => s + b.qty * b.unit, 0);
export const wholesaleItems = () => WHOLESALE.bundle.reduce((s, b) => s + b.qty, 0);

/* ------------------------------------------------------------------ */
/* Payments                                                             */
/* ------------------------------------------------------------------ */

export interface BankAccount {
  alias: string;
  cbu: string;
  holder: string;
}

export const BANK_ACCOUNTS: BankAccount[] = [
  { alias: "atok.arg", cbu: "0140058803500161301352", holder: "Francisco Tokmayier" },
  { alias: "atok.arg2", cbu: "0140058803500160397077", holder: "Antonio Lucas Bouso" },
];

export const PAYMENT_RULES = {
  /** Standard purchase: 100% of the total, after ATOK confirms stock and shipping. */
  standardUpfrontPct: 100,
  /** Confirmed special order: deposit to reserve, balance on arrival. */
  specialDepositPct: 50,
  specialBalancePct: 50,
};

/* ------------------------------------------------------------------ */
/* Special orders                                                       */
/* ------------------------------------------------------------------ */

export const SPECIAL_ORDER = {
  leadTimeDays: { min: 15, max: 20 },
};

/* ------------------------------------------------------------------ */
/* Delivery                                                             */
/* ------------------------------------------------------------------ */

export const DELIVERY = {
  nationwide: true,
  meetupArea: "Monte Grande y zonas cercanas",
  meetupRegion: "Buenos Aires",
};

/* ------------------------------------------------------------------ */
/* Inventory source — be honest about how fresh stock data is.         */
/* ------------------------------------------------------------------ */

export const INVENTORY = {
  /** true only if a real, synchronized integration feeds the catalog. */
  live: false,
  /** ISO date of the last import from the stock sheet, or null. Written by `npm run import:stock`. */
  updatedAt: null as string | null,
};
