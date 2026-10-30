"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BRAND } from "@/config/business";
import { NAV } from "@/config/nav";
import { useCart } from "@/lib/cart";
import s from "./Header.module.css";


export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`${s.wordmark} ${className ?? ""}`} aria-label="ATOK">
      ATOK<span className={s.dot} aria-hidden="true" />
    </span>
  );
}

export function Header() {
  const { totals, setOpen, ready } = useCart();
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    menu.current?.open && menu.current.close();
  }, [pathname]);

  const count = ready ? totals.count : 0;

  return (
    <header className={s.header}>
      <div className={`wrap ${s.bar}`}>
        <Link href="/" className={s.logo} aria-label="ATOK — inicio">
          <Wordmark />
        </Link>

        <nav aria-label="Principal" className={s.nav}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={s.navLink}
              aria-current={pathname?.startsWith(n.href) ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className={s.actions}>
          <a className={s.ig} href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer">
            @{BRAND.instagramHandle}
          </a>
          <button
            type="button"
            className={s.cart}
            onClick={() => setOpen(true)}
            aria-label={`Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`}
          >
            <span className={s.cartLabel}>Carrito</span>
            <span className={s.count} data-filled={count > 0}>
              {count}
            </span>
          </button>
          <button
            type="button"
            className={s.burger}
            aria-label="Abrir menú"
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <dialog ref={menu} className={s.menu} aria-label="Menú">
        <div className={s.menuTop}>
          <Wordmark />
          <button type="button" className={s.close} onClick={() => menu.current?.close()} aria-label="Cerrar menú">
            Cerrar
          </button>
        </div>
        <nav aria-label="Menú móvil" className={s.menuNav}>
          <Link href="/" className={s.menuLink} onClick={() => menu.current?.close()}>
            <span className={s.menuNum}>00</span>
            <span>Inicio</span>
          </Link>
          {NAV.map((n, i) => (
            <Link key={n.href} href={n.href} className={s.menuLink} onClick={() => menu.current?.close()}>
              <span className={s.menuNum}>{String(i + 1).padStart(2, "0")}</span>
              <span>{n.label}</span>
              <small>{n.note}</small>
            </Link>
          ))}
        </nav>
        <a className={s.menuIg} href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer">
          Instagram — @{BRAND.instagramHandle} <span className="arrow">→</span>
        </a>
      </dialog>
    </header>
  );
}
