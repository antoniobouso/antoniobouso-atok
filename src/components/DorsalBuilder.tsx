"use client";

import Link from "next/link";
import { useState } from "react";
import { Garment } from "@/components/Garment";
import { PRODUCT_LINES } from "@/config/business";
import { formatPrice } from "@/lib/pricing";
import type { GarmentArt } from "@/lib/types";
import s from "./DorsalBuilder.module.css";

const KITS: { id: string; label: string; art: GarmentArt }[] = [
  { id: "noche", label: "Noche", art: { pattern: "solid", colors: ["#0b0b0b", "#D4AF37"], trim: "#D4AF37", numberColor: "#D4AF37" } },
  { id: "hueso", label: "Hueso", art: { pattern: "solid", colors: ["#efe9dc", "#111"], trim: "#111", numberColor: "#111" } },
  { id: "franjas", label: "Franjas", art: { pattern: "stripes", colors: ["#151515", "#3a3a3a"], trim: "#D4AF37", numberColor: "#fff" } },
  { id: "aros", label: "Aros", art: { pattern: "hoops", colors: ["#13294b", "#1f3d6b"], trim: "#ece4cf", numberColor: "#fff" } },
];

const QUICK = ["1", "5", "9", "10", "23"];

/**
 * "Tu número": a playful, purposeful moment — the customer sees their number on
 * a shirt back, then jumps to products that accept numbering.
 */
export function DorsalBuilder() {
  const [num, setNum] = useState("10");
  const [kit, setKit] = useState(KITS[0]);

  const onNum = (v: string) => setNum(v.replace(/\D/g, "").slice(0, 2));

  return (
    <div className={s.wrap}>
      <div className={s.stage}>
        <div className={s.spot} aria-hidden="true" />
        <Garment
          art={kit.art}
          line="camiseta"
          view="back"
          number={num || " "}
          className={s.shirt}
          title={`Vista previa ilustrada: espalda con el número ${num || "vacío"}`}
        />
        <p className={`tag ${s.caption}`}>Vista previa ilustrativa · no representa un producto</p>
      </div>

      <div className={s.panel}>
        <div className="field">
          <label htmlFor="dorsal">Tu número</label>
          <input
            id="dorsal"
            className={`input ${s.numInput}`}
            inputMode="numeric"
            autoComplete="off"
            value={num}
            onChange={(e) => onNum(e.target.value)}
            placeholder="10"
            aria-describedby="dorsal-hint"
          />
          <p id="dorsal-hint" className="hint">
            Del 0 al 99. El número final se acuerda con vos al confirmar el pedido.
          </p>
        </div>

        <div className={s.quick} role="group" aria-label="Números rápidos">
          {QUICK.map((q) => (
            <button key={q} type="button" onClick={() => setNum(q)} aria-pressed={num === q}>
              {q}
            </button>
          ))}
        </div>

        <fieldset className={s.kits}>
          <legend className="tag muted">Probalo en</legend>
          {KITS.map((k) => (
            <label key={k.id} className={s.kit}>
              <input type="radio" name="kit" checked={kit.id === k.id} onChange={() => setKit(k)} />
              <span className={s.swatch} style={{ background: k.art.colors[0], borderColor: k.art.trim }} aria-hidden="true" />
              {k.label}
            </label>
          ))}
        </fieldset>

        <dl className={s.prices}>
          {(["camiseta", "manga-larga", "short"] as const).map((l) => (
            <div key={l}>
              <dt>{PRODUCT_LINES[l].label} con número</dt>
              <dd className="num">{formatPrice(PRODUCT_LINES[l].numbered)}</dd>
            </div>
          ))}
        </dl>

        <Link href={`/tienda/?numero=1`} className="btn">
          Ver prendas que llevan número <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
