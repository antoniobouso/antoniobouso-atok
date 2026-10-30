"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { DELIVERY, PAYMENT_RULES, PRODUCT_LINES } from "@/config/business";
import { useCart } from "@/lib/cart";
import { buildOrderMessage, makeOrderCode, type Delivery } from "@/lib/orders";
import { formatARS, formatPrice } from "@/lib/pricing";
import { isPostalCode, PROVINCES } from "@/lib/geo";
import { BankAccounts } from "@/components/BankAccounts";
import { Field } from "@/components/Field";
import { SendPanel } from "@/components/SendPanel";
import s from "./checkout.module.css";

type Errors = Partial<Record<"name" | "contact" | "postalCode" | "city" | "zone", string>>;

export function Checkout() {
  const { items, ready, totals } = useCart();
  const [method, setMethod] = useState<Delivery["method"]>("envio");
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<{ code: string; message: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  if (!ready) return <div className="wrap section" aria-busy="true" />;

  if (items.length === 0 && !result) {
    return (
      <section className="wrap section">
        <h1 className="display h-lg">Tu pedido</h1>
        <p className="lede muted" style={{ margin: "24px 0 32px" }}>
          Tu carrito está vacío.
        </p>
        <Link href="/tienda/" className="btn">
          Ir a la tienda <span className="arrow">→</span>
        </Link>
      </section>
    );
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const errs: Errors = {};
    if (v("name").length < 2) errs.name = "Contanos tu nombre.";
    if (v("contact").length < 3) errs.contact = "Dejanos tu usuario de Instagram o un teléfono.";
    if (method === "envio") {
      if (!isPostalCode(v("postalCode"))) errs.postalCode = "Código postal de 4 dígitos (ej. 1842).";
      if (v("city").length < 2) errs.city = "Indicá tu localidad.";
    } else if (v("zone").length < 2) errs.zone = "Indicá la zona.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    const delivery: Delivery =
      method === "envio"
        ? { method, postalCode: v("postalCode").toUpperCase(), city: v("city"), province: v("province") }
        : { method, zone: v("zone") };
    const code = makeOrderCode();
    setResult({ code, message: buildOrderMessage(code, items, { name: v("name"), contact: v("contact"), notes: v("notes") }, delivery) });
  };

  const hasSamples = items.some((i) => i.sample);

  return (
    <section className={s.page}>
      <div className="wrap">
        <p className="tag">
          <span className="gold">Pedido</span> — {result ? "Paso 2 de 2" : "Paso 1 de 2"}
        </p>
        <h1 className="display h-lg" style={{ marginTop: 16 }}>
          {result ? (
            <>
              Ahora,{" "}
              <span className="serif gold" style={{ textTransform: "none" }}>
                mandánoslo.
              </span>
            </>
          ) : (
            "Tu pedido"
          )}
        </h1>

        <div className={s.grid}>
          <div>
            {!result ? (
              <form onSubmit={onSubmit} noValidate className={s.form}>
                <fieldset className={s.block}>
                  <legend className={s.legend}>
                    <span className="gold">01</span> Tus datos
                  </legend>
                  <Field name="name" label="Nombre" autoComplete="name" error={errors.name} />
                  <Field
                    name="contact"
                    label="Instagram o teléfono"
                    hint="Para responderte por el mismo canal."
                    autoComplete="tel"
                    error={errors.contact}
                  />
                </fieldset>

                <fieldset className={s.block}>
                  <legend className={s.legend}>
                    <span className="gold">02</span> Entrega
                  </legend>
                  <div className="choices" role="radiogroup" aria-label="Método de entrega">
                    <label className="choice">
                      <input type="radio" name="method" checked={method === "envio"} onChange={() => setMethod("envio")} />
                      <strong>Envío a domicilio</strong>
                      <span>A todo el país. Te cotizamos el costo.</span>
                    </label>
                    <label className="choice">
                      <input type="radio" name="method" checked={method === "encuentro"} onChange={() => setMethod("encuentro")} />
                      <strong>Encuentro</strong>
                      <span>{DELIVERY.meetupArea}. A coordinar.</span>
                    </label>
                  </div>
                  {method === "envio" ? (
                    <div className={s.row3}>
                      <Field name="postalCode" label="Código postal" inputMode="text" autoComplete="postal-code" error={errors.postalCode} />
                      <Field name="city" label="Localidad" autoComplete="address-level2" error={errors.city} />
                      <div className="field">
                        <label htmlFor="province">Provincia</label>
                        <select id="province" name="province" className="input" defaultValue="Buenos Aires" autoComplete="address-level1">
                          {PROVINCES.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <Field
                      name="zone"
                      label="Zona para el encuentro"
                      defaultValue="Monte Grande"
                      hint={`Encuentros en ${DELIVERY.meetupArea}, sujetos a confirmación. Si estás lejos, elegí envío.`}
                      error={errors.zone}
                    />
                  )}
                </fieldset>

                <fieldset className={s.block}>
                  <legend className={s.legend}>
                    <span className="gold">03</span> Algo más <span className="muted">(opcional)</span>
                  </legend>
                  <div className="field">
                    <label htmlFor="notes">Notas</label>
                    <textarea id="notes" name="notes" className="input" placeholder="Horarios, dudas de talle, etc." />
                  </div>
                </fieldset>

                {hasSamples && (
                  <p className={s.warn} role="note">
                    Tu carrito tiene prendas de <strong>muestra</strong> que no están a la venta. Sirven para probar el
                    sitio: el mensaje las marca como [MUESTRA].
                  </p>
                )}

                <button type="submit" className="btn btn-block">
                  Preparar mensaje del pedido <span className="arrow">→</span>
                </button>
                <p className="muted" style={{ fontSize: 14 }}>
                  Todavía no pagás nada. Primero te confirmamos stock y costo de envío.
                </p>
              </form>
            ) : (
              <div ref={resultRef} tabIndex={-1} className={s.form} style={{ outline: "none" }}>
                <SendPanel code={result.code} message={result.message} />

                <div className={s.block}>
                  <h2 className={s.legend}>Qué sigue</h2>
                  <ol className={s.next}>
                    <li>
                      <strong>Enviás el mensaje.</strong> El pedido todavía no está confirmado.
                    </li>
                    <li>
                      <strong>Te respondemos</strong> con el stock confirmado y el total final (productos + envío), o
                      coordinamos el encuentro.
                    </li>
                    <li>
                      <strong>Transferís el {PAYMENT_RULES.standardUpfrontPct}% del total confirmado</strong> a una de
                      estas cuentas:
                    </li>
                  </ol>
                  <BankAccounts />
                  <ol className={s.next} start={4}>
                    <li>
                      <strong>Nos mandás el comprobante</strong> por el mismo chat, con tu código {result.code}. Cuando
                      verificamos el pago, despachamos o coordinamos la entrega.
                    </li>
                  </ol>
                  <p className={s.warn}>No transfieras antes de que confirmemos el total.</p>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => setResult(null)} style={{ justifySelf: "start" }}>
                  ← Editar datos
                </button>
              </div>
            )}
          </div>

          <aside className={s.summary} aria-label="Resumen del pedido">
            <h2 className="tag">Resumen</h2>
            <ul className={s.items}>
              {items.map((i) => (
                <li key={i.key}>
                  <div>
                    <p className={s.itemName}>
                      {i.qty > 1 && <span className="gold num">{i.qty}× </span>}
                      {i.name}
                    </p>
                    <p className="muted" style={{ fontSize: 13 }}>
                      {PRODUCT_LINES[i.line].label} · Talle {i.size} · {i.number ? `N° ${i.number}` : "Sin número"}
                    </p>
                  </div>
                  <span className="num">{formatPrice(i.unitPrice == null ? null : i.unitPrice * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className={s.totals}>
              <div>
                <dt>Productos</dt>
                <dd className="num">{formatARS(totals.subtotal)}</dd>
              </div>
              {totals.unpriced > 0 && (
                <div>
                  <dt>Ítems a consultar</dt>
                  <dd className="num">{totals.unpriced}</dd>
                </div>
              )}
              <div>
                <dt>{method === "envio" ? "Envío" : "Encuentro"}</dt>
                <dd>{method === "envio" ? "A cotizar" : "A coordinar"}</dd>
              </div>
              <div className={s.grand}>
                <dt>Total</dt>
                <dd>
                  <span className="num">{formatARS(totals.subtotal)}</span>
                  {method === "envio" && <small> + envío</small>}
                </dd>
              </div>
            </dl>
            <p className="muted" style={{ fontSize: 13 }}>
              Compra normal: se paga el {PAYMENT_RULES.standardUpfrontPct}% por transferencia, una vez confirmado.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
