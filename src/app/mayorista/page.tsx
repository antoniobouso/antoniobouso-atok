import type { Metadata } from "next";
import { WHOLESALE, wholesaleItems, wholesaleTotal } from "@/config/business";
import { formatARS } from "@/lib/pricing";
import { WholesaleForm } from "./WholesaleForm";
import f from "@/components/flow.module.css";
import s from "./mayorista.module.css";

export const metadata: Metadata = {
  title: "Mayorista",
  description: `Combo mayorista: ${WHOLESALE.bundle.map((b) => `${b.qty} ${b.label.toLowerCase()}`).join(" + ")} por ${formatARS(wholesaleTotal())}.`,
  alternates: { canonical: "/mayorista/" },
};

export default function MayoristaPage() {
  return (
    <>
      <section className={f.hero}>
        <div className="wrap">
          <p className="tag">
            <span className="gold">N° 06</span> — Mayorista
          </p>
          <div className={f.heroGrid}>
            <h1 className="display h-xl">
              Por
              <br />
              <span className="serif gold" style={{ textTransform: "none" }}>
                cantidad.
              </span>
            </h1>
            <p className="lede muted">
              Para revender, equipar a tu equipo o regalar. Precios por prenda que bajan cuando comprás en combo.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: "clamp(48px, 7vw, 96px)" }}>
        <div className={s.offer}>
          <div className={s.offerHead}>
            <p className="tag gold">Combo vigente</p>
            <p className={s.total}>
              <span className="num">{formatARS(wholesaleTotal())}</span>
              <small>{wholesaleItems()} prendas</small>
            </p>
          </div>
          <table className={s.table}>
            <caption className="sr-only">Detalle del combo mayorista</caption>
            <thead>
              <tr>
                <th scope="col">Prenda</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Precio c/u</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {WHOLESALE.bundle.map((b) => (
                <tr key={b.label}>
                  <th scope="row">{b.label}</th>
                  <td className="num">{b.qty}</td>
                  <td className="num">{formatARS(b.unit)}</td>
                  <td className="num">{formatARS(b.unit * b.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className={s.notes}>
            <li>{WHOLESALE.note}</li>
            <li>
              Desde <strong>{WHOLESALE.largerOrderThreshold} prendas</strong> puede haber un mejor precio: lo confirma el
              equipo según el pedido.
            </li>
            <li>Mismas condiciones de pago y envío que una compra normal, salvo que acordemos otra cosa.</li>
          </ul>
        </div>
      </section>

      <div className={`wrap ${f.body}`}>
        <div className={f.steps}>
          <h2 className="display h-md">
            Armemos
            <br />
            <span className="serif gold" style={{ textTransform: "none" }}>
              tu pedido.
            </span>
          </h2>
          <p className="muted" style={{ marginTop: 16 }}>
            Contanos cuántas prendas y qué tenés en mente. Te respondemos con lo disponible y el precio final.
          </p>
        </div>
        <WholesaleForm />
      </div>
    </>
  );
}
