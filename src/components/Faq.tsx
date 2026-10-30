import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND, DELIVERY, PAYMENT_RULES, SPECIAL_ORDER, WHOLESALE } from "@/config/business";

const { min, max } = SPECIAL_ORDER.leadTimeDays;

export const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "¿Las camisetas son originales u oficiales?",
    a: (
      <p>
        No. Son productos importados y no son productos oficiales licenciados por clubes, selecciones ni marcas. Si
        tenés dudas sobre un modelo puntual, escribinos y te contamos lo que sabemos.
      </p>
    ),
  },
  {
    q: "¿Cómo pago?",
    a: (
      <p>
        Por transferencia bancaria. En una compra normal transferís el {PAYMENT_RULES.standardUpfrontPct}% una vez que
        confirmamos stock y envío, y nos mandás el comprobante por mensaje.{" "}
        <Link href="/info/#pagos" className="link">
          Ver datos de pago
        </Link>
      </p>
    ),
  },
  {
    q: "¿Hacen envíos?",
    a: (
      <p>
        Sí, a todo el país. El costo depende del destino y del paquete, así que lo cotizamos con tu código postal
        antes de que pagues.
      </p>
    ),
  },
  {
    q: "¿Puedo retirar en persona?",
    a: (
      <p>
        Podemos coordinar un encuentro en {DELIVERY.meetupArea} ({DELIVERY.meetupRegion}). El punto y el horario se
        acuerdan por mensaje. Si estás lejos, te conviene el envío.
      </p>
    ),
  },
  {
    q: "¿Qué pasa si el modelo que quiero no está?",
    a: (
      <p>
        Lo podemos consultar como pedido especial. Si se consigue, te confirmamos precio; se reserva con el{" "}
        {PAYMENT_RULES.specialDepositPct}% y el resto se paga cuando llega. La demora es de hasta {min}–{max} días desde
        que se hace el pedido.{" "}
        <Link href="/encargos/" className="link">
          Consultar un encargo
        </Link>
      </p>
    ),
  },
  {
    q: "¿El stock de la web es en tiempo real?",
    a: (
      <p>
        No. Mostramos el stock de nuestro último relevamiento y siempre lo confirmamos antes de cobrarte. Por eso nunca
        te pedimos que pagues sin antes hablar con nosotros.
      </p>
    ),
  },
  {
    q: "¿Venden por mayor?",
    a: (
      <p>
        Sí. {WHOLESALE.note} Desde {WHOLESALE.largerOrderThreshold} prendas puede haber mejor precio, que confirma el
        equipo.{" "}
        <Link href="/mayorista/" className="link">
          Ver mayorista
        </Link>
      </p>
    ),
  },
  {
    q: "¿Por dónde los contacto?",
    a: (
      <p>
        Por Instagram:{" "}
        <a href={BRAND.instagramUrl} className="link" target="_blank" rel="noopener noreferrer">
          @{BRAND.instagramHandle}
        </a>
        .
      </p>
    ),
  },
];

export function Faq({ limit }: { limit?: number }) {
  return (
    <div>
      {FAQ.slice(0, limit ?? FAQ.length).map((f) => (
        <details key={f.q} className="acc">
          <summary>{f.q}</summary>
          <div className="acc-body">{f.a}</div>
        </details>
      ))}
    </div>
  );
}
