import { PRODUCT_LINES, type LineId } from "@/config/business";

/** Price for a line, with or without number. null means "consult". */
export function linePrice(line: LineId, numbered: boolean): number | null {
  const l = PRODUCT_LINES[line];
  return numbered ? l.numbered : l.base;
}

const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export const formatARS = (n: number) => ars.format(n).replace(/\s/g, " ");

export const formatPrice = (n: number | null) => (n == null ? "Consultar" : formatARS(n));

/** Lowest price a product can be bought at, for cards. */
export function fromPrice(line: LineId, numberingAvailable: boolean): number | null {
  const l = PRODUCT_LINES[line];
  if (l.base != null) return l.base;
  return numberingAvailable ? l.numbered : null;
}
