import { BRAND } from "@/config/business";

/** Where a composed message is sent. WhatsApp supports prefilled text; Instagram does not. */
export function channel() {
  return BRAND.whatsapp
    ? ({ kind: "whatsapp", label: "Enviar por WhatsApp" } as const)
    : ({ kind: "instagram", label: "Abrir Instagram" } as const);
}

export function channelUrl(message: string) {
  return BRAND.whatsapp
    ? `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`
    : BRAND.instagramDmUrl;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers without async clipboard permission
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
