# ATOK — sitio web

Tienda y sitio de marca de **ATOK** (camisetas de fútbol, Argentina · [@atok.arg](https://www.instagram.com/atok.arg/)).
Next.js 15 (App Router) + TypeScript, exportado como sitio estático: se puede publicar en Vercel, Netlify,
Cloudflare Pages o cualquier hosting de archivos.

```bash
npm install
npm run dev          # desarrollo en http://localhost:3000
npm run build        # genera /out (sitio estático)
npm start            # sirve /out en http://localhost:3000
npm test             # tests unitarios (precios, mensajes, estados de stock)
npm run test:e2e     # recorrido completo + accesibilidad (requiere npm start corriendo)
```

## Sitio ya generado (`out/`)

La carpeta `out/` tiene el sitio listo en HTML, CSS y JavaScript: se puede subir tal cual a cualquier hosting
(Netlify, Cloudflare Pages, Hostinger, etc.) y abrir `index.html` desde la raíz del dominio.
Después de cambiar precios o productos, volvé a generarla con `npm run build`.

## Publicación automática en GitHub Pages

`.github/workflows/pages.yml` genera y publica el sitio en cada push a `main`, en
`https://antoniobouso.github.io/antoniobouso-atok/`. Requisito (una sola vez):
**Settings → Pages → Build and deployment → Source: "GitHub Actions"**.

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Precios, mayorista, cuentas bancarias, reglas de pago, encargos, zona de encuentros | `src/config/business.ts` |
| Número de WhatsApp (activa mensajes pre-escritos en vez de copiar y pegar en Instagram) | `BRAND.whatsapp` en `src/config/business.ts` |
| Dominio real (SEO, sitemap) | `BRAND.siteUrl` en `src/config/business.ts` |
| Catálogo real | `src/data/products.json` (generado por el importador) |
| Fotos de productos | `public/products/...` y la columna `fotos` del CSV |
| Preguntas frecuentes | `src/components/Faq.tsx` |

## Cargar el stock real

1. En la planilla de Google: **Archivo → Descargar → Valores separados por comas (.csv)**.
2. Dar a las columnas el formato documentado en `scripts/import-stock.mjs`
   (ejemplo en `scripts/fixtures/ejemplo-stock.csv`).
3. `npm run import:stock -- ruta/al/stock.csv` → escribe `src/data/products.json` y la fecha del relevamiento.
4. `npm run build` y publicar.

Mientras `products.json` esté vacío, el sitio muestra **prendas de muestra** claramente marcadas
("Muestra · no está a la venta"). Desaparecen solas al importar el stock real, o antes con
`NEXT_PUBLIC_SHOW_SAMPLES=false`.

El stock **no es en tiempo real**: el sitio lo dice y siempre se confirma por mensaje antes de cobrar.

## Cómo funciona un pedido

No hay backend ni pasarela de pago. El sitio arma un mensaje con código (`ATK-XXXXXX`), lo copia y abre el
chat de Instagram; el equipo confirma stock y envío a mano.

- **Compra normal:** el cliente transfiere el 100% del total confirmado (productos + envío) y manda el comprobante.
- **Pedido especial:** es una *consulta*. Si se consigue, se reserva con 50% y el otro 50% se paga al llegar
  (hasta 15–20 días). La página de encargos no muestra datos bancarios.
- **Mayorista:** combo 5 camisetas + 5 shorts = $335.000; desde 15 prendas, precio a confirmar.

Ningún pago se marca como recibido automáticamente: la verificación es siempre manual.
