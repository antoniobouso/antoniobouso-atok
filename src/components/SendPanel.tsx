"use client";

import { useState } from "react";
import { BRAND } from "@/config/business";
import { channel, channelUrl, copyText } from "@/lib/contact";
import s from "./SendPanel.module.css";

/**
 * Final step of every flow: shows the exact message, copies it and opens the
 * real contact channel. Nothing is "confirmed" here — the panel says so.
 */
export function SendPanel({ code, message, title = "Tu mensaje está listo" }: { code: string; message: string; title?: string }) {
  const [copied, setCopied] = useState<null | boolean>(null);
  const ch = channel();

  const onSend = async () => {
    const ok = await copyText(message);
    setCopied(ok);
    window.open(channelUrl(message), "_blank", "noopener,noreferrer");
  };

  const onCopy = async () => setCopied(await copyText(message));

  return (
    <div className={s.panel}>
      <div className={s.head}>
        <p className="tag gold">Código {code}</p>
        <h2 className="display h-sm">{title}</h2>
        <p className="muted">
          {ch.kind === "instagram"
            ? `Lo copiamos y abrimos Instagram: pegalo en el chat con @${BRAND.instagramHandle} y envialo.`
            : "Se abre WhatsApp con el mensaje escrito: solo tenés que enviarlo."}
        </p>
      </div>
      <pre className={s.msg} tabIndex={0} aria-label="Mensaje a enviar">
        {message}
      </pre>
      <div className={s.actions}>
        <button type="button" className="btn" onClick={onSend}>
          {ch.kind === "instagram" ? "Copiar y abrir Instagram" : ch.label} <span className="arrow">→</span>
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCopy}>
          Copiar mensaje
        </button>
      </div>
      <p role="status" className={s.status}>
        {copied === true && "Mensaje copiado. Pegalo en el chat."}
        {copied === false && "No pudimos copiarlo automáticamente: seleccioná el texto y copialo a mano."}
      </p>
    </div>
  );
}
