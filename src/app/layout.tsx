import type { Metadata, Viewport } from "next";
import "@fontsource/big-shoulders-display/latin-800";
import "@fontsource/big-shoulders-display/latin-900";
import "@fontsource/instrument-serif/latin-400-italic";
import "@fontsource/instrument-serif/latin-400";
import "@fontsource-variable/inter/index.css";
import "./globals.css";
import { BRAND } from "@/config/business";
import { asset } from "@/lib/paths";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { RevealObserver } from "@/components/Reveal";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: "ATOK — Camisetas de fútbol · Argentina",
    template: "%s · ATOK",
  },
  description:
    "Camisetas, camisetas con número, manga larga y shorts de fútbol. Envíos a todo el país y encuentros en Monte Grande. Pedidos especiales y mayorista.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "ATOK",
  },
  alternates: { canonical: "/" },
  icons: { icon: asset("/icon.svg") },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        {/* Enables scroll-reveal styles only when JS runs, so content is never hidden without it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <CartProvider>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
