import { test } from "node:test";
import assert from "node:assert/strict";
import { PRODUCT_LINES, wholesaleItems, wholesaleTotal } from "@/config/business";
import { linePrice, formatARS, fromPrice } from "@/lib/pricing";
import { buildOrderMessage, buildSpecialMessage, buildWholesaleMessage, cartKey, cartTotals, makeOrderCode, type CartItem } from "@/lib/orders";
import { productStatus } from "@/lib/catalog";
import { isPostalCode } from "@/lib/geo";

test("retail prices match the communicated price list", () => {
  assert.equal(linePrice("camiseta", false), 50000);
  assert.equal(linePrice("camiseta", true), 60000);
  assert.equal(linePrice("manga-larga", true), 65000);
  assert.equal(linePrice("manga-larga", false), null, "long sleeve without number was never priced");
  assert.equal(linePrice("short", false), 50000);
  assert.equal(linePrice("short", true), 55000);
  assert.equal(fromPrice("manga-larga", true), 65000);
});

test("wholesale bundle totals 10 items for $335.000", () => {
  assert.equal(wholesaleItems(), 10);
  assert.equal(wholesaleTotal(), 335000);
});

test("ARS formatting", () => {
  assert.match(formatARS(60000), /\$\s?60\.000/);
});

const items: CartItem[] = [
  { key: cartKey("a", "M", "10"), slug: "a", name: "Uno", line: "camiseta", size: "M", number: "10", unitPrice: 60000, qty: 2 },
  { key: cartKey("b", "L"), slug: "b", name: "Dos", line: "manga-larga", size: "L", unitPrice: null, qty: 1 },
];

test("cart totals separate priced and to-consult items", () => {
  assert.deepEqual(cartTotals(items), { subtotal: 120000, unpriced: 1, count: 3 });
  assert.notEqual(cartKey("a", "M", "10"), cartKey("a", "M", "9"));
});

test("order code format", () => {
  assert.match(makeOrderCode(1_700_000_000_000, 0.5), /^ATK-[0-9A-Z]{6}$/);
});

test("standard order message asks for 100% only after confirmation", () => {
  const msg = buildOrderMessage("ATK-TEST01", items, { name: "Ana", contact: "@ana" }, { method: "envio", postalCode: "1842", city: "Monte Grande", province: "Buenos Aires" });
  assert.match(msg, /ATK-TEST01/);
  assert.match(msg, /N° 10/);
  assert.match(msg, /\$\s?120\.000/);
  assert.match(msg, /precio a consultar/);
  assert.match(msg, /CP 1842/);
  assert.match(msg, /100%/);
  assert.doesNotMatch(msg, /50%/);
});

test("special order message never treats the inquiry as confirmed and uses 50/50", () => {
  const msg = buildSpecialMessage("ATK-X", { product: "Retro", line: "camiseta", size: "M", name: "Ana", contact: "@ana" });
  assert.match(msg, /consultar un pedido especial/);
  assert.match(msg, /50%/);
  assert.match(msg, /15–20 días/);
  assert.doesNotMatch(msg, /100%/);
});

test("wholesale message mentions the bundle or the 15+ threshold", () => {
  assert.match(buildWholesaleMessage("C", { name: "A", contact: "b", quantity: 10 }), /335\.000/);
  assert.match(buildWholesaleMessage("C", { name: "A", contact: "b", quantity: 20 }), /15 o más/);
});

test("product status picks the best size, special when sourceable", () => {
  const base = { slug: "x", name: "x", line: "camiseta" as const, numbering: true, images: [] };
  assert.equal(productStatus({ ...base, sizes: [{ size: "S", status: "out_of_stock" }, { size: "M", status: "in_stock" }] }), "in_stock");
  assert.equal(productStatus({ ...base, sizes: [{ size: "S", status: "out_of_stock" }], specialOrderable: true }), "special");
  assert.equal(productStatus({ ...base, sizes: [{ size: "S", status: "out_of_stock" }] }), "out_of_stock");
});

test("postal codes", () => {
  assert.ok(isPostalCode("1842"));
  assert.ok(isPostalCode("B1842ABC"));
  assert.ok(!isPostalCode("18"));
});

test("every line label exists", () => {
  for (const l of Object.values(PRODUCT_LINES)) assert.ok(l.label && l.plural);
});
