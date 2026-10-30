import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, DELIVERY, PAYMENT_RULES, SPECIAL_ORDER } from "@/config/business";
import { BankAccounts } from "@/components/BankAccounts";
import { Faq } from "@/components/Faq";
import { PriceList } from "@/components/PriceList";
import s from "./info.module.css";

export const metadata: Metadata = {
  title: "Envíos, pagos y preguntas",
  description: "Cómo comprar en ATOK: envíos a todo el país, encuentros en Monte Grande, pago por transferencia y pedidos especiales.",
  alternates: { canonical: "/info/" },
};

const TOC = [
  ["precios", "Precios"],
  ["envios", "Envíos"],
  ["encuentros", "Encuentros"],
  ["pagos", "Pagos"],
  ["autenticidad", "Autenticidad"],
  ["preguntas", "Preguntas"],
  ["privacidad", "Privacidad"],
] as const;

const { min, max } = SPECIAL_ORDER.leadTimeDays;

export default function InfoPage() {
  return (
    <>
      <section className={s.hero}>
        <div className="wrap">
          <p className="tag">
            <span className="gold">N° 09</span> — Info
          </p>
          <h1 className="display h-xl" style={{ marginTop: 16 }}>
            Todo claro
            <br />
            <span className="serif gold" style={{ textTransform: "none" }}>
              antes de pagar.
            </span>
          </h1>
        </div>
      </section>

      <div className={`wrap ${s.layout}`}>
        <nav aria-label="En esta página" className={s.toc}>
          <ol>
            {TOC.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span className="gold num">{String(i + 1).padStart(2, "0")}</span> {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={s.content}>
          <section id="precios" className={s.block} aria-labelledby="h-precios">
            <h2 id="h-precios" className="display h-md">Precios</h2>
            <PriceList compact />
            <p className="muted">
              En pesos argentinos, por prenda. Pueden cambiar: el precio que vale es el que te confirmamos por mensaje.
              Para cantidad, mirá{" "}
              <Link href="/mayorista/" className="link">
                mayorista
              </Link>
              .
            </p>
          </section>

          <section id="envios" className={s.block} aria-labelledby="h-envios">
            <h2 id="h-envios" className="display h-md">Envíos</h2>
            <p>Enviamos a todo el país.</p>
            <p className="muted">
              El costo depende del destino y del tamaño del paquete. Por eso no lo calculamos automáticamente: con tu
              código postal y localidad te pasamos la cotización antes de que pagues, y recién ahí cerrás el total.
            </p>
          </section>

          <section id="encuentros" className={s.block} aria-labelledby="h-encuentros">
            <h2 id="h-encuentros" className="display h-md">Encuentros</h2>
            <p>
              Podemos coordinar la entrega en persona en {DELIVERY.meetupArea} ({DELIVERY.meetupRegion}).
            </p>
            <p className="muted">
              El punto y el horario se acuerdan por mensaje y están sujetos a disponibilidad. Si estás fuera de la zona,
              te recomendamos el envío.
            </p>
          </section>

          <section id="pagos" className={s.block} aria-labelledby="h-pagos">
            <h2 id="h-pagos" className="display h-md">Pagos</h2>
            <p>Por transferencia bancaria. Hay dos formas de pago según el tipo de compra:</p>
            <div className={s.compare}>
              <div>
                <p className="tag gold">Compra normal</p>
                <p className={s.big}>{PAYMENT_RULES.standardUpfrontPct}%</p>
                <p className="muted">
                  Del total (productos + envío), una vez que confirmamos stock y costo de envío.
                </p>
              </div>
              <div>
                <p className="tag gold">Pedido especial</p>
                <p className={s.big}>
                  {PAYMENT_RULES.specialDepositPct}
                  <span className="muted">/</span>
                  {PAYMENT_RULES.specialBalancePct}
                </p>
                <p className="muted">
                  {PAYMENT_RULES.specialDepositPct}% para reservar, cuando confirmamos que se consigue y el precio.{" "}
                  {PAYMENT_RULES.specialBalancePct}% restante cuando llega (hasta {min}–{max} días).
                </p>
              </div>
            </div>
            <BankAccounts />
            <ol className={s.ol}>
              <li>Transferí solo después de que te confirmemos el monto.</li>
              <li>
                Mandanos el comprobante por mensaje a{" "}
                <a href={BRAND.instagramUrl} className="link" target="_blank" rel="noopener noreferrer">
                  @{BRAND.instagramHandle}
                </a>
                , con tu código de pedido.
              </li>
              <li>El pago queda acreditado cuando lo verificamos en la cuenta. Ahí despachamos o coordinamos la entrega.</li>
            </ol>
          </section>

          <section id="autenticidad" className={`${s.block} ${s.honest}`} aria-labelledby="h-auth">
            <h2 id="h-auth" className="display h-md">Autenticidad</h2>
            <p className={s.statement}>
              Los productos de ATOK son <strong>importados</strong> y <strong>no son productos oficiales</strong>{" "}
              licenciados por clubes, selecciones o marcas.
            </p>
            <p className="muted">
              Los nombres de equipos se usan solo para describir el modelo de cada prenda. Si querés saber algo puntual
              de un modelo —talle, calce, tela— preguntanos antes de comprar y te contamos lo que sabemos.
            </p>
          </section>

          <section id="preguntas" className={s.block} aria-labelledby="h-faq">
            <h2 id="h-faq" className="display h-md">Preguntas</h2>
            <Faq />
          </section>

          <section id="privacidad" className={s.block} aria-labelledby="h-priv">
            <h2 id="h-priv" className="display h-md">Privacidad</h2>
            <p className="muted">
              Este sitio no guarda tus datos en ningún servidor. El carrito se guarda solo en tu navegador. Los datos que
              escribís en un pedido o consulta se usan para armar el mensaje y nos llegan únicamente si vos lo enviás.
              Los usamos solo para responderte y coordinar tu compra.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
