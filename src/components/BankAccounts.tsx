"use client";

import { useState } from "react";
import { BANK_ACCOUNTS } from "@/config/business";
import { copyText } from "@/lib/contact";
import s from "./BankAccounts.module.css";

function CopyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <div className={s.row}>
      <dt>{label}</dt>
      <dd className={s.value}>
        <span className={mono ? s.mono : undefined}>{value}</span>
        <button
        type="button"
        className={s.copy}
        onClick={async () => {
          if (await copyText(value)) {
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          }
        }}
        aria-label={`Copiar ${label.toLowerCase()} ${value}`}
      >
          {done ? "Copiado ✓" : "Copiar"}
        </button>
      </dd>
    </div>
  );
}

export function BankAccounts() {
  return (
    <div className={s.grid}>
      {BANK_ACCOUNTS.map((a, i) => (
        <div key={a.alias} className={s.card}>
          <p className="tag gold">Cuenta {i + 1}</p>
          <dl className={s.list}>
            <CopyRow label="Alias" value={a.alias} />
            <CopyRow label="CBU" value={a.cbu} mono />
            <div className={s.row}>
              <dt>Titular</dt>
              <dd>{a.holder}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
