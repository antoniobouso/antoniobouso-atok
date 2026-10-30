import type { Metadata } from "next";
import { Checkout } from "./Checkout";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false },
};

export default function PedidoPage() {
  return <Checkout />;
}
