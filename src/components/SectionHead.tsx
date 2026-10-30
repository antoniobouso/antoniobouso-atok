import type { ReactNode } from "react";
import s from "./SectionHead.module.css";

/** Kit-room style section header: "N° 02 — Tarifario" + title + optional aside. */
export function SectionHead({
  n,
  kicker,
  title,
  aside,
  id,
}: {
  n: string;
  kicker: string;
  title: ReactNode;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <div className={`${s.head} reveal`}>
      <p className={`tag ${s.kicker}`}>
        <span className="gold">N° {n}</span>
        <span className={s.bar} aria-hidden="true" />
        {kicker}
      </p>
      <div className={s.row}>
        <h2 id={id} className="display h-lg">
          {title}
        </h2>
        {aside && <div className={s.aside}>{aside}</div>}
      </div>
    </div>
  );
}
