"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PRODUCT_LINES } from "@/config/business";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/catalog";
import { formatARS, formatPrice } from "@/lib/pricing";
import { ProductVisual } from "@/components/ProductVisual";
import s from "./CartDrawer.module.css";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, totals } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={s.drawer}
      aria-labelledby="cart-title"
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === ref.current && setOpen(false)}
    >
      <div className={s.panel}>
        <div className={s.head}>
          <h2 id="cart-title" className="display">
            Carrito <span className="gold num">{totals.count}</span>
          </h2>
          <button type="button" className={s.close} onClick={() => setOpen(false)}>
            Cerrar
          </button>
        </div>

        {items.length === 0 ? (
          <div className={s.empty}>
            <p className="serif" style={{ fontSize: 30 }}>
              Todavía no elegiste ninguna.
            </p>
            <Link href="/tienda/" className="btn" onClick={() => setOpen(false)}>
              Ver la tienda <span className="arrow">→</span>
            </Link>
          </div>
        ) : (
          <>
            <ul className={s.list}>
              {items.map((i) => {
                const p = getProduct(i.slug);
                return (
                  <li key={i.key} className={s.item}>
                    <div className={s.thumb}>{p && <ProductVisual product={p} view={i.number ? "back" : "front"} number={i.number} />}</div>
                    <div className={s.info}>
                      <p className={s.name}>
                        {i.name} {i.sample && <span className="badge-sample">Muestra</span>}
                      </p>
                      <p className={s.meta}>
                        {PRODUCT_LINES[i.line].label} · Talle {i.size}
                        {i.number ? ` · N° ${i.number}` : ""}
                      </p>
                      <div className={s.row}>
                        <div className={s.qty} role="group" aria-label={`Cantidad de ${i.name}`}>
                          <button type="button" onClick={() => setQty(i.key, i.qty - 1)} disabled={i.qty <= 1} aria-label="Restar uno">
                            −
                          </button>
                          <span aria-live="polite" className="num">
                            {i.qty}
                          </span>
                          <button type="button" onClick={() => setQty(i.key, i.qty + 1)} aria-label="Sumar uno">
                            +
                          </button>
                        </div>
                        <span className={`${s.price} num`}>{formatPrice(i.unitPrice == null ? null : i.unitPrice * i.qty)}</span>
                      </div>
                      <button type="button" className={s.remove} onClick={() => remove(i.key)}>
                        Quitar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className={s.foot}>
              <div className={s.total}>
                <span>Subtotal</span>
                <strong className="num">{formatARS(totals.subtotal)}</strong>
              </div>
              {totals.unpriced > 0 && <p className={s.note}>+ {totals.unpriced} ítem(s) con precio a consultar.</p>}
              <p className={s.note}>El envío se cotiza según tu código postal. Confirmamos stock y costo antes de que pagues.</p>
              <Link href="/pedido/" className="btn btn-block" onClick={() => setOpen(false)}>
                Preparar pedido <span className="arrow">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
