import Link from "next/link";
import { DELIVERY, PAYMENT_RULES, PRODUCT_LINES, SPECIAL_ORDER, WHOLESALE, wholesaleItems, wholesaleTotal } from "@/config/business";
import { featuredProducts, USING_SAMPLES } from "@/lib/catalog";
import { formatARS } from "@/lib/pricing";
import { Garment } from "@/components/Garment";
import { ProductCard } from "@/components/ProductCard";
import { PriceList } from "@/components/PriceList";
import { SectionHead } from "@/components/SectionHead";
import { DorsalBuilder } from "@/components/DorsalBuilder";
import { Faq } from "@/components/Faq";
import s from "./home.module.css";

const TICKER = [
  "Envíos a todo el país",
  `Encuentros en ${DELIVERY.meetupArea}`,
  "Camisetas con número",
  "Pedidos especiales",
  "Precio mayorista",
  "Pago por transferencia",
];

const STEPS = [
  { t: "Elegí", d: "Prenda, talle y, si querés, tu número. Todo va al carrito." },
  { t: "Mandanos el pedido", d: "El sitio arma el mensaje con un código. Lo enviás por Instagram." },
  { t: "Confirmamos", d: "Revisamos stock y te pasamos el costo de envío o coordinamos el encuentro." },
  {
    t: "Pagás y listo",
    d: `Transferís el ${PAYMENT_RULES.standardUpfrontPct}% y nos mandás el comprobante. Verificado el pago, despachamos.`,
  },
];

export default function Home() {
  const featured = featuredProducts(4);
  const fromPrice = Math.min(
    ...Object.values(PRODUCT_LINES).flatMap((l) => [l.base, l.numbered].filter((p): p is number => p != null)),
  );

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className={s.hero} aria-labelledby="hero-title">
        <div className={s.beams} aria-hidden="true" />
        <div className={`wrap ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <p className="tag gold">Camisetas de fútbol · Argentina</p>
            <h1 id="hero-title" className={s.heroTitle}>
              <span className="display">Cada camiseta</span>
              <span className="serif gold">guarda un partido.</span>
            </h1>
            <p className={`lede muted ${s.heroLede}`}>
              Camisetas, manga larga y shorts de fútbol, con o sin número. Envíos a todo el país y encuentros en
              Monte Grande.
            </p>
            <div className={s.ctas}>
              <Link href="/tienda/" className="btn">
                Ver la tienda <span className="arrow">→</span>
              </Link>
              <Link href="/encargos/" className="btn btn-ghost">
                Buscás una que no está
              </Link>
            </div>
          </div>

          <div className={s.heroArt} aria-hidden="true">
            <div className={s.hanger} />
            <div className={s.sway}>
              <Garment
                art={{ pattern: "pinstripe", colors: ["#0b0b0b", "#1d1d1d"], trim: "#D4AF37", numberColor: "#D4AF37" }}
                line="camiseta"
                view="back"
                number="10"
                className={s.heroShirt}
              />
            </div>
            <span className={s.heroNum}>10</span>
          </div>
        </div>

        <div className={`wrap ${s.facts}`}>
          <div>
            <span className="tag muted">Desde</span>
            <strong className="num">{formatARS(fromPrice)}</strong>
          </div>
          <div>
            <span className="tag muted">Envíos</span>
            <strong>Todo el país</strong>
          </div>
          <div>
            <span className="tag muted">Encargos</span>
            <strong className="num">
              {SPECIAL_ORDER.leadTimeDays.min}–{SPECIAL_ORDER.leadTimeDays.max} días
            </strong>
          </div>
        </div>
      </section>

      {/* ---------------- Ticker ---------------- */}
      <div className={s.ticker} role="region" aria-label="Lo esencial">
        <ul className={s.tickerTrack}>
          {[0, 1].map((k) =>
            TICKER.map((t) => (
              <li key={`${k}-${t}`} aria-hidden={k === 1 || undefined}>
                {t}
                <span className={s.star} aria-hidden="true">
                  ✦
                </span>
              </li>
            )),
          )}
        </ul>
      </div>

      {/* ---------------- Vestuario ---------------- */}
      <section className="section" aria-labelledby="vestuario">
        <div className="wrap">
          <SectionHead
            n="01"
            kicker="Vestuario"
            id="vestuario"
            title={
              <>
                Lo que hay
                <br />
                <span className="serif gold" style={{ textTransform: "none" }}>
                  en el vestuario
                </span>
              </>
            }
            aside={
              <div style={{ display: "grid", gap: 16 }}>
                <p className="muted">
                  {USING_SAMPLES
                    ? "Estamos cargando el stock real. Mientras tanto ves prendas de muestra para recorrer el sitio: preguntanos por Instagram qué hay hoy."
                    : "Stock según nuestro último relevamiento. Lo confirmamos siempre antes de cobrar."}
                </p>
                <Link href="/tienda/" className="link" style={{ justifySelf: "start", fontWeight: 600 }}>
                  Ver toda la tienda <span className="arrow">→</span>
                </Link>
              </div>
            }
          />
          <div className={s.grid}>
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Tarifario ---------------- */}
      <section className="section paper" aria-labelledby="tarifario">
        <div className={`wrap ${s.tarifa}`}>
          <div className={s.tarifaIntro}>
            <p className="tag reveal">
              <span className="gold">N° 02</span> — Tarifario
            </p>
            <h2 id="tarifario" className="display h-lg reveal">
              Precios
              <br />
              <span className="serif" style={{ textTransform: "none" }}>
                sin letra chica.
              </span>
            </h2>
            <p className="muted reveal">
              En pesos argentinos, por prenda. El envío se cotiza aparte según tu código postal. Si comprás cantidad,
              mirá el{" "}
              <Link href="/mayorista/" className="link">
                precio mayorista
              </Link>
              .
            </p>
          </div>
          <PriceList />
        </div>
      </section>

      {/* ---------------- Tu número ---------------- */}
      <section className="section" aria-labelledby="dorsal-title">
        <div className="wrap">
          <SectionHead
            n="03"
            kicker="Tu número"
            id="dorsal-title"
            title={
              <>
                Ponele
                <br />
                <span className="serif gold" style={{ textTransform: "none" }}>
                  tu número.
                </span>
              </>
            }
            aside={<p className="muted">El de tu ídolo, el que usabas en el club del barrio o el de tu fecha. Probalo acá.</p>}
          />
          <DorsalBuilder />
        </div>
      </section>

      {/* ---------------- Cómo comprar ---------------- */}
      <section className={`section ${s.steps}`} aria-labelledby="como-comprar">
        <div className="wrap">
          <SectionHead
            n="04"
            kicker="Cómo comprar"
            id="como-comprar"
            title="Cuatro pasos."
            aside={<p className="muted">Sin cobros automáticos ni sorpresas: nadie te pide plata antes de confirmar que tu pedido existe.</p>}
          />
          <ol className={s.stepList}>
            {STEPS.map((st, i) => (
              <li key={st.t} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className={s.stepN}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{st.t}</h3>
                <p className="muted">{st.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Encargos + Mayorista ---------------- */}
      <section className="section" aria-label="Encargos y mayorista" style={{ paddingTop: 0 }}>
        <div className={`wrap ${s.duo}`}>
          <article className={`${s.card} ${s.cardGold} reveal`}>
            <p className="tag">
              <span className="gold">N° 05</span> — Encargos
            </p>
            <h2 className="display h-md">
              ¿No está?
              <br />
              <span className="serif gold" style={{ textTransform: "none" }}>
                La buscamos.
              </span>
            </h2>
            <p className="muted">
              Mandanos el modelo que querés. Si lo conseguimos, te confirmamos precio y se reserva con una seña.
            </p>
            <dl className={s.split}>
              <div>
                <dt className="tag muted">Para reservar</dt>
                <dd>{PAYMENT_RULES.specialDepositPct}%</dd>
              </div>
              <div>
                <dt className="tag muted">Cuando llega</dt>
                <dd>{PAYMENT_RULES.specialBalancePct}%</dd>
              </div>
              <div>
                <dt className="tag muted">Demora</dt>
                <dd>
                  {SPECIAL_ORDER.leadTimeDays.min}–{SPECIAL_ORDER.leadTimeDays.max}
                  <small> días</small>
                </dd>
              </div>
            </dl>
            <Link href="/encargos/" className="btn">
              Consultar un encargo <span className="arrow">→</span>
            </Link>
          </article>

          <article className={`${s.card} reveal`}>
            <p className="tag">
              <span className="gold">N° 06</span> — Mayorista
            </p>
            <h2 className="display h-md">
              {wholesaleItems()} prendas.
              <br />
              <span className="serif gold num" style={{ textTransform: "none" }}>
                {formatARS(wholesaleTotal())}
              </span>
            </h2>
            <ul className={s.bundle}>
              {WHOLESALE.bundle.map((b) => (
                <li key={b.label}>
                  <span>
                    {b.qty} {b.label.toLowerCase()}
                  </span>
                  <span className="num">{formatARS(b.unit)} c/u</span>
                </li>
              ))}
            </ul>
            <p className="muted">
              {WHOLESALE.note} Desde {WHOLESALE.largerOrderThreshold} prendas consultá por un mejor precio.
            </p>
            <Link href="/mayorista/" className="btn btn-ghost">
              Ver mayorista <span className="arrow">→</span>
            </Link>
          </article>
        </div>
      </section>

      {/* ---------------- Manifiesto ---------------- */}
      <section className={`section paper ${s.manifesto}`} aria-labelledby="manifiesto">
        <div className="wrap">
          <p className="tag reveal">
            <span className="gold">N° 07</span> — De frente
          </p>
          <h2 id="manifiesto" className={`serif reveal ${s.quote}`}>
            Nuestras camisetas son importadas y <em>no son oficiales.</em> Te lo decimos antes de que preguntes, porque
            la confianza también se viste.
          </h2>
          <Link href="/info/#autenticidad" className="link reveal" style={{ fontWeight: 600 }}>
            Qué significa esto <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="section" aria-labelledby="faq">
        <div className={`wrap ${s.faqGrid}`}>
          <div>
            <p className="tag reveal">
              <span className="gold">N° 08</span> — Preguntas
            </p>
            <h2 id="faq" className="display h-md reveal" style={{ marginTop: 20 }}>
              Lo que
              <br />
              <span className="serif gold" style={{ textTransform: "none" }}>
                siempre nos preguntan
              </span>
            </h2>
          </div>
          <Faq limit={5} />
        </div>
      </section>
    </>
  );
}
