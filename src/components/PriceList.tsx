import { PRICE_LIST } from "@/config/business";
import { formatPrice, linePrice } from "@/lib/pricing";
import s from "./PriceList.module.css";

/** The public price list rendered as a match-day lineup sheet. */
export function PriceList({ compact }: { compact?: boolean }) {
  return (
    <ol className={`${s.list} ${compact ? s.compact : ""}`}>
      {PRICE_LIST.map((row, i) => (
        <li key={row.label} className={`${s.row} reveal`} style={{ transitionDelay: `${i * 60}ms` }}>
          <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
          <span className={s.label}>{row.label}</span>
          <span className={s.leader} aria-hidden="true" />
          <span className={`${s.price} num`}>{formatPrice(linePrice(row.line, row.numbered))}</span>
        </li>
      ))}
    </ol>
  );
}
