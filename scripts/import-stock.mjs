#!/usr/bin/env node
/**
 * Imports the ATOK stock sheet (exported as CSV from Google Sheets:
 * Archivo → Descargar → CSV) into src/data/products.json.
 *
 *   npm run import:stock -- ruta/al/stock.csv
 *
 * Expected columns (header row, case-insensitive, Spanish):
 *   nombre*      Product name as it should appear (e.g. "Titular 2024")
 *   tipo*        camiseta | manga-larga | short
 *   talles*      Sizes with status, separated by ";"  →  S:stock; M:sin stock; L:consultar; XL:encargo
 *                Status words: stock | sin stock | consultar | encargo   (missing = consultar)
 *   equipo       Club / national team (only if verified)
 *   temporada    Season / edition (only if verified)
 *   numero       si | no   — whether a number can be printed (default: si for camisetas)
 *   fotos        Image paths under /public separated by "|", front first, back second
 *   descripcion  Free text
 *   encargo      si | no   — can be sourced as a special order when out of stock
 *   destacado    si | no   — shown on the homepage
 *   slug         Optional URL id; generated from equipo + nombre otherwise
 *
 * Rows without nombre/tipo are skipped and reported. Nothing is invented: unknown
 * statuses become "to_confirm".
 */
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("Uso: npm run import:stock -- ruta/al/stock.csv");
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  const sep = text.split("\n")[0].includes(";") && !text.split("\n")[0].includes(",") ? ";" : ",";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === sep) row.push(cell), (cell = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell), rows.push(row), (row = []), (cell = "");
    } else cell += c;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  return rows.filter((r) => r.some((x) => x.trim()));
}

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const yes = (s, d = false) => (s == null || s.trim() === "" ? d : ["si", "s", "yes", "true", "1", "x"].includes(norm(s)));
const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const STATUS = { stock: "in_stock", "en stock": "in_stock", "sin stock": "out_of_stock", agotado: "out_of_stock", consultar: "to_confirm", encargo: "special" };
const LINES = { camiseta: "camiseta", "manga larga": "manga-larga", "manga-larga": "manga-larga", short: "short", shorts: "short" };

const [header, ...rows] = parseCsv(fs.readFileSync(file, "utf8"));
const cols = header.map(norm);
const get = (r, k) => r[cols.indexOf(k)]?.trim() ?? "";

const products = [];
const skipped = [];
const seen = new Set();
rows.forEach((r, i) => {
  const name = get(r, "nombre");
  const line = LINES[norm(get(r, "tipo"))];
  if (!name || !line) return skipped.push(`fila ${i + 2}: falta nombre o tipo válido`);
  const team = get(r, "equipo") || undefined;
  let slug = get(r, "slug") || slugify([team, name, line].filter(Boolean).join(" "));
  while (seen.has(slug)) slug += "-2";
  seen.add(slug);
  const sizes = get(r, "talles")
    .split(";")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const [size, st = "consultar"] = t.split(":").map((x) => x.trim());
      return { size: size.toUpperCase(), status: STATUS[norm(st)] ?? "to_confirm" };
    });
  const images = get(r, "fotos")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((src, j) => ({ src, alt: `${[team, name].filter(Boolean).join(" ")}${j === 1 ? ", espalda" : ""}` }));
  products.push({
    slug,
    name,
    ...(team && { team }),
    ...(get(r, "temporada") && { edition: get(r, "temporada") }),
    line,
    sizes,
    numbering: yes(get(r, "numero"), true),
    images,
    ...(get(r, "descripcion") && { description: get(r, "descripcion") }),
    specialOrderable: yes(get(r, "encargo")),
    featured: yes(get(r, "destacado")),
  });
});

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
fs.writeFileSync(path.join(root, "src/data/products.json"), JSON.stringify(products, null, 2) + "\n");
const cfg = path.join(root, "src/config/business.ts");
fs.writeFileSync(
  cfg,
  fs.readFileSync(cfg, "utf8").replace(/updatedAt: (null|"[^"]*") as string \| null/, `updatedAt: "${new Date().toISOString().slice(0, 10)}" as string | null`),
);
console.log(`✓ ${products.length} productos importados a src/data/products.json`);
if (skipped.length) console.log(`⚠ ${skipped.length} filas omitidas:\n  ` + skipped.join("\n  "));
const missingPhotos = products.filter((p) => !p.images.length).length;
if (missingPhotos) console.log(`ℹ ${missingPhotos} productos sin foto: se verán con el texto "Foto pendiente".`);
