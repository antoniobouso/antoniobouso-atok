"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { INVENTORY, PRODUCT_LINES, type LineId } from "@/config/business";
import { PRODUCTS, productStatus, USING_SAMPLES } from "@/lib/catalog";
import { fromPrice } from "@/lib/pricing";
import { ProductCard } from "@/components/ProductCard";
import s from "./shop.module.css";

const LINES: { id: LineId | "all"; label: string }[] = [
  { id: "all", label: "Todo" },
  ...Object.values(PRODUCT_LINES).map((l) => ({ id: l.id, label: l.plural })),
];

const AVAIL = [
  { id: "all", label: "Todo" },
  { id: "stock", label: "En stock" },
  { id: "encargo", label: "Por encargo" },
] as const;

const SORTS = [
  { id: "destacados", label: "Destacados" },
  { id: "precio-asc", label: "Menor precio" },
  { id: "precio-desc", label: "Mayor precio" },
] as const;

const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function Shop() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const line = (params.get("tipo") ?? "all") as LineId | "all";
  const avail = params.get("disp") ?? "all";
  const numero = params.get("numero") === "1";
  const talle = params.get("talle") ?? "";
  const q = params.get("q") ?? "";
  const sort = params.get("orden") ?? "destacados";

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value == null || value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const sizes = useMemo(() => {
    const order = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const all = new Set(PRODUCTS.flatMap((p) => p.sizes.map((z) => z.size)));
    return [...all].sort((a, b) => (order.indexOf(a) + 99) % 99 - (order.indexOf(b) + 99) % 99);
  }, []);

  const results = useMemo(() => {
    const nq = norm(q.trim());
    let list = PRODUCTS.filter((p) => {
      if (line !== "all" && p.line !== line) return false;
      if (numero && !p.numbering) return false;
      if (talle && !p.sizes.some((z) => z.size === talle && z.status !== "out_of_stock")) return false;
      const st = productStatus(p);
      if (avail === "stock" && st !== "in_stock" && st !== "to_confirm") return false;
      if (avail === "encargo" && st !== "special") return false;
      if (nq) {
        const hay = norm([p.name, p.team, p.edition, PRODUCT_LINES[p.line].label].filter(Boolean).join(" "));
        if (!nq.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const price = (p: (typeof list)[number]) => fromPrice(p.line, p.numbering) ?? Infinity;
    if (sort === "precio-asc") list = [...list].sort((a, b) => price(a) - price(b));
    if (sort === "precio-desc") list = [...list].sort((a, b) => price(b) - price(a));
    if (sort === "destacados") {
      const rank = (p: (typeof list)[number]) => (p.featured ? 0 : 1) + (productStatus(p) === "out_of_stock" ? 2 : 0);
      list = [...list].sort((a, b) => rank(a) - rank(b));
    }
    return list;
  }, [line, numero, talle, avail, q, sort]);

  const active = line !== "all" || avail !== "all" || numero || talle || q;

  return (
    <>
      <section className={s.head}>
        <div className="wrap">
          <p className="tag">
            <span className="gold">N° 01</span> — Tienda
          </p>
          <div className={s.titleRow}>
            <h1 className="display h-xl">
              Tienda<span className="gold">.</span>
            </h1>
            <p className="muted">
              {INVENTORY.live
                ? "Stock sincronizado."
                : INVENTORY.updatedAt
                  ? `Stock al ${new Date(INVENTORY.updatedAt).toLocaleDateString("es-AR")}. Lo confirmamos antes de cobrar.`
                  : "Confirmamos stock por mensaje antes de que pagues."}
            </p>
          </div>
          {USING_SAMPLES && (
            <p className={s.notice} role="note">
              <span className="badge-sample">Muestra</span> El stock real se está cargando. Estas prendas son ejemplos
              para recorrer la tienda: no son productos a la venta. Consultá disponibilidad por Instagram.
            </p>
          )}
        </div>
      </section>

      <div className={s.filtersBar}>
        <div className={`wrap ${s.filters}`}>
          <div className={s.searchWrap}>
            <label htmlFor="q" className="sr-only">
              Buscar
            </label>
            <input
              id="q"
              type="search"
              className={`input ${s.search}`}
              placeholder="Buscar equipo, modelo…"
              defaultValue={q}
              onChange={(e) => set("q", e.target.value)}
            />
          </div>
          <div className={s.chips} role="group" aria-label="Tipo de prenda">
            {LINES.map((l) => (
              <button key={l.id} type="button" aria-pressed={line === l.id} onClick={() => set("tipo", l.id)} className={s.chip}>
                {l.label}
              </button>
            ))}
          </div>
          <div className={s.more}>
            <label className={s.selectWrap}>
              <span className="sr-only">Disponibilidad</span>
              <select className={`input ${s.select}`} value={avail} onChange={(e) => set("disp", e.target.value)}>
                {AVAIL.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id === "all" ? "Disponibilidad" : a.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.selectWrap}>
              <span className="sr-only">Talle</span>
              <select className={`input ${s.select}`} value={talle} onChange={(e) => set("talle", e.target.value)}>
                <option value="">Talle</option>
                {sizes.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.selectWrap}>
              <span className="sr-only">Ordenar</span>
              <select className={`input ${s.select}`} value={sort} onChange={(e) => set("orden", e.target.value)}>
                {SORTS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.toggle}>
              <input type="checkbox" checked={numero} onChange={(e) => set("numero", e.target.checked ? "1" : null)} />
              <span aria-hidden="true" />
              Con número
            </label>
          </div>
        </div>
      </div>

      <section className="wrap" style={{ paddingBlock: "32px 120px" }} aria-label="Productos">
        <div className={s.count}>
          <p aria-live="polite" className="tag muted">
            {results.length} {results.length === 1 ? "prenda" : "prendas"}
          </p>
          {active && (
            <Link href="/tienda/" className="link tag" scroll={false}>
              Limpiar filtros
            </Link>
          )}
        </div>
        {results.length > 0 ? (
          <div className={s.grid}>
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className={s.empty}>
            <p className="display h-md">
              No está acá.
              <br />
              <span className="serif gold" style={{ textTransform: "none" }}>
                Quizás la conseguimos.
              </span>
            </p>
            <p className="muted">
              {PRODUCTS.length === 0
                ? "Todavía no cargamos el catálogo en la web. Escribinos y te contamos qué hay."
                : "Probá con otros filtros, o pedinos el modelo como encargo."}
            </p>
            <Link href="/encargos/" className="btn">
              Consultar un encargo <span className="arrow">→</span>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
