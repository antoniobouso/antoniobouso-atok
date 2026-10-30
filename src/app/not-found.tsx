import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap section" style={{ display: "grid", gap: 28, justifyItems: "start", minHeight: "60vh", alignContent: "center" }}>
      <p className="tag gold">Error 404</p>
      <h1 className="display h-xl">
        Fuera
        <br />
        <span className="serif gold" style={{ textTransform: "none" }}>
          de juego.
        </span>
      </h1>
      <p className="lede muted">Esta página no existe o ya no está.</p>
      <Link href="/tienda/" className="btn">
        Volver a la tienda <span className="arrow">→</span>
      </Link>
    </section>
  );
}
