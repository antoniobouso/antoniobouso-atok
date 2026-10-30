/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the site has no server-side state today (orders are sent to
  // ATOK by Instagram/WhatsApp and confirmed by hand), so it can be hosted anywhere.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
