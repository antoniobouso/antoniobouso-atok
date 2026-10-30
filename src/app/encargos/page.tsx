import type { Metadata } from "next";
import { Suspense } from "react";
import { PAYMENT_RULES, SPECIAL_ORDER } from "@/config/business";
import { SpecialOrderForm } from "./SpecialOrderForm";
import f from "@/components/flow.module.css";

export const metadata: Metadata = {
  title: "Pedidos especiales",
  description: `¿Buscás una camiseta que no está? Consultanos. Si se consigue: ${PAYMENT_RULES.specialDepositPct}% para reservar, el resto al llegar.`,
  alternates: { canonical: "/encargos/" },
};

const { min, max } = SPECIAL_ORDER.leadTimeDays;

const STEPS = [
  { t: "Nos contás qué buscás", d: "Equipo, temporada, talle, número. Si tenés una foto, la mandás por el chat." },
  { t: "Lo revisamos", d: "Vemos si se consigue. Hasta acá no pagás nada." },
  { t: "Te confirmamos precio", d: "Si se consigue, te pasamos precio y condiciones." },
  { t: `Reservás con el ${PAYMENT_RULES.specialDepositPct}%`, d: "Recién ahí te mandamos los datos de pago. Con la seña, hacemos el pedido." },
  { t: `Llega en hasta ${min}–${max} días`, d: `Te avisamos, pagás el ${PAYMENT_RULES.specialBalancePct}% restante y coordinamos la entrega.` },
];

export default function EncargosPage() {
  return (
    <>
      <section className={f.hero}>
        <div className="wrap">
          <p className="tag">
            <span className="gold">N° 05</span> — Encargos
          </p>
          <div className={f.heroGrid}>
            <h1 className="display h-xl">
              ¿No está?
              <br />
              <span className="serif gold" style={{ textTransform: "none" }}>
                La buscamos.
              </span>
            </h1>
            <dl className={f.kpis}>
              <div>
                <dt>Reserva</dt>
                <dd>{PAYMENT_RULES.specialDepositPct}%</dd>
              </div>
              <div>
                <dt>Al llegar</dt>
                <dd>{PAYMENT_RULES.specialBalancePct}%</dd>
              </div>
              <div>
                <dt>Demora</dt>
                <dd>
                  {min}–{max}
                  <small> días</small>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <div className={`wrap ${f.body}`}>
        <ol className={f.steps} aria-label="Cómo funciona un encargo">
          {STEPS.map((s, i) => (
            <li key={s.t}>
              <span>{i + 1}</span>
              <strong>{s.t}</strong>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
        <Suspense>
          <SpecialOrderForm />
        </Suspense>
      </div>
    </>
  );
}
