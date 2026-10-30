/** Prefixes a /public path with the deploy subpath (GitHub Pages serves the site under /<repo>/). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
