// Subpath where the site is served, e.g. "/antoniobouso-atok" on GitHub Pages.
// Empty when deployed at the root of a domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the site has no server-side state today (orders are sent to
  // ATOK by Instagram/WhatsApp and confirmed by hand), so it can be hosted anywhere.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
