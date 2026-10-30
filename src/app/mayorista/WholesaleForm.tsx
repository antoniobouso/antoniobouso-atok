"use client";

import { useState, type FormEvent } from "react";
import { WHOLESALE, wholesaleItems } from "@/config/business";
import { buildWholesaleMessage, makeOrderCode } from "@/lib/orders";
import { Field } from "@/components/Field";
import { SendPanel } from "@/components/SendPanel";
import f from "@/components/flow.module.css";

type Errors = Partial<Record<"quantity" | "name" | "contact", string>>;

export function WholesaleForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [qty, setQty] = useState(wholesaleItems());
  const [result, setResult] = useState<{ code: string; message: string } | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Errors = {};
    if (!Number.isFinite(qty) || qty < 1) errs.quantity = "Indicá una cantidad.";
    if (v("name").length < 2) errs.name = "Contanos tu nombre.";
    if (v("contact").length < 3) errs.contact = "Dejanos tu Instagram o teléfono.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    const code = makeOrderCode();
    setResult({
      code,
      message: buildWholesaleMessage(code, { name: v("name"), contact: v("contact"), quantity: qty, city: v("city"), notes: v("notes") }),
    });
  };

  if (result) {
    return (
      <div className={f.form}>
        <SendPanel code={result.code} message={result.message} title="Tu consulta está lista" />
        <button type="button" className="btn btn-ghost" onClick={() => setResult(null)} style={{ justifySelf: "start" }}>
          ← Editar consulta
        </button>
      </div>
    );
  }

  return (
    <form className={f.form} onSubmit={onSubmit} noValidate aria-label="Consulta mayorista">
      <div className={f.row2}>
        <Field
          name="quantity"
          label="Cantidad de prendas"
          type="number"
          min={1}
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value || "0", 10))}
          error={errors.quantity}
          hint={
            qty >= WHOLESALE.largerOrderThreshold
              ? "Son más de 15: te consultamos un mejor precio."
              : `Combo vigente: ${wholesaleItems()} prendas.`
          }
        />
        <Field name="city" label="Localidad (opcional)" autoComplete="address-level2" />
      </div>
      <div className="field">
        <label htmlFor="notes">¿Qué necesitás?</label>
        <textarea id="notes" name="notes" className="input" placeholder="Equipos, talles, números, si es para un club o reventa…" />
      </div>
      <div className={f.row2}>
        <Field name="name" label="Nombre" autoComplete="name" error={errors.name} />
        <Field name="contact" label="Instagram o teléfono" error={errors.contact} />
      </div>
      <button type="submit" className="btn btn-block">
        Preparar consulta <span className="arrow">→</span>
      </button>
    </form>
  );
}
