import { PRODUCT_LINES, SPECIAL_ORDER, WHOLESALE, wholesaleTotal, type LineId } from "@/config/business";
import { formatARS, formatPrice } from "@/lib/pricing";

/**
 * Orders are not stored on a server: the site composes a clear message that the
 * customer sends to ATOK, and the team confirms stock, shipping and payment by hand.
 * Everything here is pure so it can be unit tested.
 */

export interface CartItem {
  /** slug + size + number, so the same shirt with two different numbers are two lines. */
  key: string;
  slug: string;
  name: string;
  line: LineId;
  size: string;
  number?: string;
  /** null = price must be consulted */
  unitPrice: number | null;
  qty: number;
  sample?: boolean;
}

export const cartKey = (slug: string, size: string, number?: string) => [slug, size, number ?? ""].join("|");

export function cartTotals(items: CartItem[]) {
  let subtotal = 0;
  let unpriced = 0;
  let count = 0;
  for (const i of items) {
    count += i.qty;
    if (i.unitPrice == null) unpriced += i.qty;
    else subtotal += i.unitPrice * i.qty;
  }
  return { subtotal, unpriced, count };
}

export function makeOrderCode(now = Date.now(), rand = Math.random()) {
  const t = now.toString(36).slice(-4).toUpperCase();
  const r = Math.floor(rand * 36 ** 2).toString(36).padStart(2, "0").toUpperCase();
  return `ATK-${t}${r}`;
}

export type Delivery =
  | { method: "envio"; postalCode: string; city: string; province: string }
  | { method: "encuentro"; zone: string };

export interface Customer {
  name: string;
  contact: string;
  notes?: string;
}

export function itemLine(i: CartItem) {
  const parts = [
    `${PRODUCT_LINES[i.line].label} ${i.name}${i.sample ? " [MUESTRA]" : ""}`,
    `Talle ${i.size}`,
    i.number ? `N° ${i.number}` : "Sin número",
    i.qty > 1 ? `x${i.qty}` : null,
    i.unitPrice == null ? "precio a consultar" : formatARS(i.unitPrice * i.qty),
  ].filter(Boolean);
  return `• ${parts.join(" — ")}`;
}

export function deliveryLine(d: Delivery) {
  return d.method === "envio"
    ? `Envío a CP ${d.postalCode}, ${d.city} (${d.province}) — costo a cotizar`
    : `Encuentro en ${d.zone} — a coordinar`;
}

export function buildOrderMessage(code: string, items: CartItem[], customer: Customer, delivery: Delivery) {
  const { subtotal, unpriced } = cartTotals(items);
  return [
    `Hola ATOK! Quiero hacer este pedido (código ${code}):`,
    "",
    ...items.map(itemLine),
    "",
    `Subtotal productos: ${formatARS(subtotal)}${unpriced ? ` + ${unpriced} ítem(s) a consultar` : ""}`,
    `Entrega: ${deliveryLine(delivery)}`,
    "",
    `Nombre: ${customer.name}`,
    `Contacto: ${customer.contact}`,
    customer.notes?.trim() ? `Notas: ${customer.notes.trim()}` : null,
    "",
    "Quedo atento/a a la confirmación de stock y del costo de envío para transferir el 100%.",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export interface SpecialRequest {
  product: string;
  team?: string;
  edition?: string;
  line: LineId;
  size: string;
  number?: string;
  reference?: string;
  name: string;
  contact: string;
  postalCode?: string;
  notes?: string;
}

export function buildSpecialMessage(code: string, r: SpecialRequest) {
  const { min, max } = SPECIAL_ORDER.leadTimeDays;
  return [
    `Hola ATOK! Quiero consultar un pedido especial (código ${code}):`,
    "",
    `Producto: ${r.product}`,
    r.team ? `Equipo / selección: ${r.team}` : null,
    r.edition ? `Temporada / versión: ${r.edition}` : null,
    `Tipo: ${PRODUCT_LINES[r.line].label}`,
    `Talle: ${r.size}`,
    r.number ? `Número: ${r.number}` : null,
    r.reference ? `Referencia: ${r.reference}` : null,
    r.postalCode ? `Código postal: ${r.postalCode}` : null,
    r.notes?.trim() ? `Notas: ${r.notes.trim()}` : null,
    "",
    `Nombre: ${r.name}`,
    `Contacto: ${r.contact}`,
    "",
    `Sé que primero tienen que confirmar si se consigue y el precio. Si se confirma, se reserva con el 50% y el resto se paga al llegar (hasta ${min}–${max} días).`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export interface WholesaleRequest {
  name: string;
  contact: string;
  quantity: number;
  city?: string;
  notes?: string;
}

export function buildWholesaleMessage(code: string, r: WholesaleRequest) {
  const bundle = WHOLESALE.bundle.map((b) => `${b.qty} ${b.label.toLowerCase()} a ${formatARS(b.unit)} c/u`).join(" + ");
  return [
    `Hola ATOK! Consulta mayorista (código ${code}):`,
    "",
    `Cantidad estimada: ${r.quantity} prendas`,
    r.quantity >= WHOLESALE.largerOrderThreshold
      ? `(Son ${WHOLESALE.largerOrderThreshold} o más: quisiera saber si hay mejor precio.)`
      : `Me interesa el combo: ${bundle} = ${formatPrice(wholesaleTotal())}.`,
    r.city ? `Localidad: ${r.city}` : null,
    r.notes?.trim() ? `Detalle: ${r.notes.trim()}` : null,
    "",
    `Nombre: ${r.name}`,
    `Contacto: ${r.contact}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
