// End-to-end smoke test of the main customer journeys + axe accessibility scan.
// Usage: npm run build && npm start (in another shell) && npm run test:e2e
// BASE_URL defaults to http://localhost:3000
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { default: AxeBuilder } = await import("@axe-core/playwright");

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const results = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push(["PASS", name]);
  } catch (e) {
    results.push(["FAIL", name, e.message.split("\n")[0]]);
  }
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
// Never actually leave the site for Instagram/WhatsApp during tests.
await ctx.route(/instagram\.com|ig\.me|wa\.me/, (r) => r.fulfill({ status: 200, body: "stub" }));

await step("home renders price list with real prices", async () => {
  await page.goto(BASE + "/");
  const text = await page.locator("main").innerText();
  for (const p of ["50.000", "60.000", "65.000", "55.000", "335.000"]) assert.ok(text.includes(p), `missing ${p}`);
  assert.match(text, /no son oficiales/i);
});

await step("dorsal builder updates number", async () => {
  await page.fill("#dorsal", "7");
  assert.equal(await page.locator("section svg text").filter({ hasText: /^7$/ }).count() > 0, true);
});

await step("shop filters by type and numbering", async () => {
  await page.goto(BASE + "/tienda/");
  const all = await page.locator("article").count();
  await page.getByRole("button", { name: "Shorts" }).click();
  await page.waitForURL(/tipo=short/);
  const shorts = await page.locator("article").count();
  assert.ok(shorts > 0 && shorts < all, `shorts ${shorts} / all ${all}`);
  await page.getByRole("link", { name: "Limpiar filtros" }).click();
  await page.waitForURL((u) => !u.search);
});

await step("product: numbered shirt adds to cart at $60.000", async () => {
  await page.goto(BASE + "/producto/muestra-franjas-negro-oro/");
  assert.ok(await page.locator('input[name="size"][value="L"]').isDisabled(), "out-of-stock size must be disabled");
  await page.locator("label", { hasText: "Con número" }).click();
  await page.fill('input[inputmode="numeric"]', "9");
  await page.getByRole("button", { name: /Agregar al carrito/ }).click();
  const drawer = page.getByRole("dialog", { name: /Carrito/ });
  await drawer.waitFor();
  const t = await drawer.innerText();
  assert.match(t, /N° 9/);
  assert.match(t, /60\.000/);
});

await step("unavailable product routes to special order, not cart", async () => {
  await page.keyboard.press("Escape");
  await page.goto(BASE + "/producto/muestra-short-blanco/");
  assert.equal(await page.getByRole("button", { name: /Agregar al carrito/ }).count(), 0);
  await page.getByRole("link", { name: /Consultar como encargo/ }).click();
  await page.waitForURL(/encargos\/\?producto=/);
  assert.equal(await page.inputValue('input[name="product"]'), "Short blanco");
});

await step("checkout validates, then composes a 100% order message", async () => {
  await page.goto(BASE + "/pedido/");
  await page.getByRole("button", { name: /Preparar mensaje/ }).click();
  assert.ok((await page.locator(".error-text").count()) >= 3, "should show validation errors");
  await page.fill("#name", "Ana Test");
  await page.fill("#contact", "@anatest");
  await page.fill("#postalCode", "1842");
  await page.fill("#city", "Monte Grande");
  await page.getByRole("button", { name: /Preparar mensaje/ }).click();
  const msg = await page.locator("pre").innerText();
  assert.match(msg, /código ATK-[0-9A-Z]{6}/);
  assert.match(msg, /N° 9/);
  assert.match(msg, /CP 1842/);
  assert.match(msg, /100%/);
  const body = await page.locator("main").innerText();
  assert.match(body, /0140058803500161301352/);
  assert.match(body, /No transfieras antes de que confirmemos/);
});

await step("send button copies the message and opens Instagram DM", async () => {
  const [popup] = await Promise.all([ctx.waitForEvent("page"), page.getByRole("button", { name: /Copiar y abrir Instagram/ }).click()]);
  assert.match(popup.url(), /ig\.me\/m\/atok\.arg/);
  await popup.close();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(clip, /Hola ATOK/);
});

await step("special order: inquiry with 50/50 terms and no bank data", async () => {
  await page.goto(BASE + "/encargos/");
  await page.fill('input[name="product"]', "Camiseta retro");
  await page.selectOption("#size", "M");
  await page.fill('input[name="name"]', "Ana");
  await page.fill('input[name="contact"]', "@ana");
  await page.getByRole("button", { name: /Preparar consulta/ }).click();
  const body = await page.locator("main").innerText();
  assert.match(body, /consulta, no un pedido confirmado/i);
  assert.match(await page.locator("pre").innerText(), /50%/);
  assert.doesNotMatch(body, /0140058803500161301352/);
});

await step("wholesale: 20 items mentions better-price threshold", async () => {
  await page.goto(BASE + "/mayorista/");
  await page.fill('input[name="quantity"]', "20");
  await page.fill('input[name="name"]', "Club");
  await page.fill('input[name="contact"]', "@club");
  await page.getByRole("button", { name: /Preparar consulta/ }).click();
  assert.match(await page.locator("pre").innerText(), /15 o más/);
});

await step("mobile menu opens and navigates", async () => {
  await page.goto(BASE + "/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.getByRole("dialog", { name: "Menú" }).getByRole("link", { name: /Info/ }).click();
  await page.waitForURL(/\/info\/$/);
});

for (const path of ["/", "/tienda/", "/producto/muestra-franjas-negro-oro/", "/encargos/", "/mayorista/", "/info/", "/pedido/"]) {
  await step(`axe (wcag2a/aa) ${path}`, async () => {
    await page.goto(BASE + path);
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")));
    await page.waitForTimeout(1100); // let reveal transitions finish before measuring contrast
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const v = r.violations.filter((x) => x.impact === "serious" || x.impact === "critical");
    assert.equal(v.length, 0, v.map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target).join(" | ")}`).join("; "));
  });
}

await step("no runtime errors in console", async () => {
  assert.deepEqual(errors, []);
});

await browser.close();
for (const r of results) console.log(r.join("  "));
const failed = results.filter((r) => r[0] === "FAIL").length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
