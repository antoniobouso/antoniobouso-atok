import Link from "next/link";
import { BRAND, DELIVERY } from "@/config/business";
import { NAV } from "@/config/nav";
import s from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className="wrap">
        <div className={s.grid}>
          <div className={s.col}>
            <p className="tag gold">Hablemos</p>
            <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className={s.big}>
              @{BRAND.instagramHandle}
            </a>
            <p className="muted">Pedidos, consultas y comprobantes por mensaje directo.</p>
          </div>
          <nav aria-label="Pie de página" className={s.col}>
            <p className="tag gold">Sitio</p>
            <Link href="/">Inicio</Link>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className={s.col}>
            <p className="tag gold">Entregas</p>
            <p>Envíos a todo el país</p>
            <p>Encuentros en {DELIVERY.meetupArea}, a coordinar</p>
            <Link href="/info/#envios" className="link" style={{ justifySelf: "start" }}>
              Cómo funcionan
            </Link>
          </div>
          <div className={s.col}>
            <p className="tag gold">Transparencia</p>
            <p className="muted">
              Los productos de ATOK son importados y no son productos oficiales licenciados.{" "}
              <Link href="/info/#autenticidad" className="link">
                Más info
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className={s.giant} aria-hidden="true">
        ATOK
      </div>
      <div className={`wrap ${s.legal}`}>
        <span>© {new Date().getFullYear()} ATOK · Argentina</span>
        <Link href="/info/#privacidad">Privacidad</Link>
      </div>
    </footer>
  );
}
