"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { BANK_ACCOUNTS, DELIVERY, PAYMENT_RULES, PRODUCT_LINES, SPECIAL_ORDER } from "@/config/business";
import { useCart } from "@/lib/cart";
import { isBuyable, productStatus, STATUS_HINT, STATUS_LABEL } from "@/lib/catalog";
import { cartKey } from "@/lib/orders";
import { formatPrice, linePrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { ProductVisual } from "@/components/ProductVisual";
import s from "./product.module.css";

export function ProductDetail({ product: p }: { product: Product }) {
  const { add, setOpen } = useCart();
  const firstBuyable = p.sizes.find((z) => isBuyable(z.status))?.size ?? "";
  const [size, setSize] = useState(firstBuyable);
  const [withNumber, setWithNumber] = useState(false);
  const [number, setNumber] = useState("");
  const [view, setView] = useState<"front" | "back">("front");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const numId = useId();

  const status = productStatus(p);
  const line = PRODUCT_LINES[p.line];
  const price = linePrice(p.line, withNumber);
  const sizeStatus = p.sizes.find((z) => z.size === size)?.status;
  const canBuy = p.sizes.some((z) => isBuyable(z.status));
  const hasBack = p.line !== "short";
  const shownView = withNumber && number && hasBack ? "back" : view;

  const onAdd = () => {
    if (!size) return setError("Elegí un talle.");
    if (withNumber && !number) return setError("Escribí el número que querés.");
    setError("");
    const n = withNumber ? number : undefined;
    add({
      key: cartKey(p.slug, size, n),
      slug: p.slug,
      name: [p.team, p.name].filter(Boolean).join(" "),
      line: p.line,
      size,
      number: n,
      unitPrice: price,
      qty: 1,
      sample: p.sample,
    });
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 2400);
  };

  return (
    <section className={s.pdp}>
      <div className={`wrap ${s.grid}`}>
        {/* Gallery */}
        <div className={s.gallery}>
          <div className={s.stage}>
            {p.sample && <span className={`badge-sample ${s.sample}`}>Muestra · no está a la venta</span>}
            <div className={s.visual} key={shownView + number}>
              <ProductVisual product={p} view={shownView} number={withNumber ? number : undefined} priority />
            </div>
            {!p.images.length && <p className={`tag ${s.caption}`}>Ilustración · foto real pendiente</p>}
          </div>
          {hasBack && (
            <div className={s.thumbs} role="group" aria-label="Vistas">
              {(["front", "back"] as const).map((v) => (
                <button key={v} type="button" aria-pressed={shownView === v} onClick={() => setView(v)} className={s.thumb}>
                  <ProductVisual product={p} view={v} number={v === "back" && withNumber ? number : undefined} />
                  <span>{v === "front" ? "Frente" : "Espalda"}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className={s.info}>
          <nav aria-label="Ruta" className={`tag ${s.crumbs}`}>
            <Link href="/tienda/">Tienda</Link> / <Link href={`/tienda/?tipo=${p.line}`}>{line.plural}</Link>
          </nav>

          <h1 className={s.title}>
            {p.team && <span className="display">{p.team}</span>}
            <span className={p.team ? "serif gold" : "display"}>{p.name}</span>
          </h1>
          {p.edition && <p className="muted">{p.edition}</p>}

          <div className={s.priceRow}>
            <span className={`${s.price} num`} aria-live="polite">
              {formatPrice(price)}
            </span>
            <span className={`status status-${status}`}>{STATUS_LABEL[status]}</span>
          </div>
          <p className={`muted ${s.hint}`}>{STATUS_HINT[status]}</p>

          {p.description && <p>{p.description}</p>}

          {canBuy ? (
            <>
              <fieldset className={s.group}>
                <legend className="tag">
                  Talle {sizeStatus && sizeStatus !== "in_stock" && <span className="muted">· {STATUS_LABEL[sizeStatus]}</span>}
                </legend>
                <div className={s.sizes}>
                  {p.sizes.map((z) => {
                    const ok = isBuyable(z.status);
                    return (
                      <label key={z.size} className={s.size} data-status={z.status}>
                        <input
                          type="radio"
                          name="size"
                          value={z.size}
                          checked={size === z.size}
                          disabled={!ok}
                          onChange={() => setSize(z.size)}
                        />
                        <span>{z.size}</span>
                        {!ok && <span className="sr-only">(sin stock)</span>}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {p.numbering && (
                <fieldset className={s.group}>
                  <legend className="tag">Número</legend>
                  <div className="choices">
                    <label className="choice">
                      <input type="radio" name="num" checked={!withNumber} onChange={() => setWithNumber(false)} />
                      <strong>Sin número</strong>
                      <span className="num">{formatPrice(line.base)}</span>
                    </label>
                    <label className="choice">
                      <input
                        type="radio"
                        name="num"
                        checked={withNumber}
                        onChange={() => {
                          setWithNumber(true);
                          setNumber((n) => n || "10");
                        }}
                      />
                      <strong>Con número</strong>
                      <span className="num">{formatPrice(line.numbered)}</span>
                    </label>
                  </div>
                  {withNumber && (
                    <div className={s.numRow}>
                    <div className="field">
                      <label htmlFor={numId}>¿Qué número?</label>
                      <input
                        id={numId}
                        className={`input ${s.numInput}`}
                        inputMode="numeric"
                        autoComplete="off"
                        value={number}
                        onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                        placeholder="10"
                      />
                    </div>
                    {hasBack && (
                      <div className={s.numPreview} aria-hidden="true">
                        <ProductVisual product={p} view="back" number={number} />
                      </div>
                    )}
                    </div>
                  )}
                </fieldset>
              )}

              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}

              <div className={s.cta}>
                <button type="button" className="btn btn-block" onClick={onAdd}>
                  {added ? "Agregado al carrito ✓" : `Agregar al carrito · ${formatPrice(price)}`}
                </button>
              </div>
              <p className={`muted ${s.small}`}>
                No se cobra nada ahora: confirmamos stock y envío por mensaje y después transferís el{" "}
                {PAYMENT_RULES.standardUpfrontPct}%.
              </p>
            </>
          ) : (
            <div className={s.unavailable}>
              <p>
                {status === "special"
                  ? `No tenemos stock, pero podemos consultar si se consigue. Si se confirma, se reserva con el ${PAYMENT_RULES.specialDepositPct}% y demora hasta ${SPECIAL_ORDER.leadTimeDays.min}–${SPECIAL_ORDER.leadTimeDays.max} días.`
                  : "Por ahora no está disponible. Podés consultarnos si vuelve a entrar o pedirlo como encargo."}
              </p>
              <Link href={`/encargos/?producto=${encodeURIComponent(p.slug)}`} className="btn btn-block">
                Consultar como encargo <span className="arrow">→</span>
              </Link>
            </div>
          )}

          <div className={s.accs}>
            <details className="acc">
              <summary>Envíos y encuentros</summary>
              <div className="acc-body">
                <p>Enviamos a todo el país. El costo depende del destino y lo cotizamos con tu código postal antes de que pagues.</p>
                <p>
                  También podemos coordinar un encuentro en {DELIVERY.meetupArea}, a confirmar por mensaje.
                </p>
              </div>
            </details>
            <details className="acc">
              <summary>Pago</summary>
              <div className="acc-body">
                <p>
                  Transferencia bancaria a {BANK_ACCOUNTS.map((a) => a.alias).join(" o ")}. Compra normal: el{" "}
                  {PAYMENT_RULES.standardUpfrontPct}% del total, una vez confirmado el pedido. Después nos mandás el
                  comprobante y lo verificamos.
                </p>
                <Link href="/info/#pagos" className="link" style={{ justifySelf: "start" }}>
                  Datos completos
                </Link>
              </div>
            </details>
            <details className="acc">
              <summary>Sobre el producto</summary>
              <div className="acc-body">
                <p>Producto importado. No es un producto oficial licenciado por el club, la selección ni la marca.</p>
                <p>Si querés detalles de talle o tela de este modelo, preguntanos por mensaje antes de comprar.</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
