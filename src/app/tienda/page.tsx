import type { Metadata } from "next";
import { Suspense } from "react";
import { Shop } from "./Shop";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Camisetas, camisetas con número, manga larga y shorts de fútbol. Precios en pesos y stock confirmado antes de pagar.",
  alternates: { canonical: "/tienda/" },
};

export default function TiendaPage() {
  return (
    <Suspense>
      <Shop />
    </Suspense>
  );
}
