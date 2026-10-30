"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PAYMENT_RULES, PRODUCT_LINES, type LineId } from "@/config/business";
import { getProduct } from "@/lib/catalog";
import { buildSpecialMessage, makeOrderCode } from "@/lib/orders";
import { Field } from "@/components/Field";
import { SendPanel } from "@/components/SendPanel";
import f from "@/components/flow.module.css";

type Errors = Partial<Record<"product" | "size" | "name" | "contact", string>>;

export function SpecialOrderForm() {
  const params = useSearchParams();
  const from = getProduct(params.get("producto") ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [line, setLine] = useState<LineId>(from?.line ?? "camiseta");
  const [result, setResult] = useState<{ code: string; message: string } | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Errors = {};
    if (v("product").length < 3) errs.product = "Contanos qué camiseta o prenda buscás.";
    if (!v("size")) errs.size = "Indicá el talle.";
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
      message: buildSpecialMessage(code, {
        product: v("product"),
        team: v("team"),
        edition: v("edition"),
        line,
        size: v("size"),
        number: v("number"),
        reference: v("reference"),
        postalCode: v("postalCode"),
        name: v("name"),
        contact: v("contact"),
        notes: v("notes"),
      }),
    });
  };

  if (result) {
    return (
      <div className={f.form}>
        <SendPanel code={result.code} message={result.message} title="Tu consulta está lista" />
        <p className={f.note}>
          Esto es una <strong>consulta</strong>, no un pedido confirmado. No transfieras nada hasta que te confirmemos
          que se consigue y el precio. Ahí se reserva con el {PAYMENT_RULES.specialDepositPct}%.
        </p>
        <button type="button" className="btn btn-ghost" onClick={() => setResult(null)} style={{ justifySelf: "start" }}>
          ← Editar consulta
        </button>
      </div>
    );
  }

  const defaultProduct = from ? [from.team, from.name].filter(Boolean).join(" ") : "";

  return (
    <form className={f.form} onSubmit={onSubmit} noValidate aria-label="Consulta de pedido especial">
      <h2 className="display h-sm">Contanos qué buscás</h2>
      <Field
        name="product"
        label="¿Qué prenda buscás?"
        placeholder="Ej.: camiseta titular, edición retro"
        defaultValue={defaultProduct}
        error={errors.product}
      />
      <div className={f.row2}>
        <Field name="team" label="Equipo o selección (opcional)" defaultValue={from?.team} />
        <Field name="edition" label="Temporada o versión (opcional)" defaultValue={from?.edition} placeholder="Ej.: 2006, suplente" />
      </div>
      <div className={f.row2}>
        <div className="field">
          <label htmlFor="line">Tipo</label>
          <select id="line" name="line" className="input" value={line} onChange={(e) => setLine(e.target.value as LineId)}>
            {Object.values(PRODUCT_LINES).map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="size">Talle</label>
          <select id="size" name="size" className="input" defaultValue="" aria-invalid={!!errors.size || undefined}>
            <option value="" disabled>
              Elegí
            </option>
            {["XS", "S", "M", "L", "XL", "XXL", "Infantil (aclarar en notas)"].map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
          {errors.size && <p className="error-text">{errors.size}</p>}
        </div>
      </div>
      <div className={f.row2}>
        <Field name="number" label="Número (opcional)" inputMode="numeric" maxLength={2} placeholder="10" />
        <Field name="postalCode" label="Código postal (opcional)" hint="Para estimar el envío." autoComplete="postal-code" />
      </div>
      <Field
        name="reference"
        label="Link de referencia (opcional)"
        type="url"
        placeholder="https://"
        hint="Una publicación o foto del modelo. También podés mandar la imagen por el chat."
      />
      <div className="field">
        <label htmlFor="notes">Notas</label>
        <textarea id="notes" name="notes" className="input" placeholder="Cualquier detalle que nos ayude a encontrarla." />
      </div>
      <div className={f.row2}>
        <Field name="name" label="Nombre" autoComplete="name" error={errors.name} />
        <Field name="contact" label="Instagram o teléfono" error={errors.contact} />
      </div>
      <p className={f.note}>
        Primero confirmamos si se consigue y el precio. No se paga nada hasta entonces.
      </p>
      <button type="submit" className="btn btn-block">
        Preparar consulta <span className="arrow">→</span>
      </button>
    </form>
  );
}
