/* ==========================================================
 * next.config.ts — Next.js project settings
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The settings file for how Next.js builds and
 *   runs this app.
 * LOGIC: Export one settings object (nextConfig) that Next.js
 *   reads when it starts.
 * WHY WE NEED IT: The newer create-next-app turns on
 *   "cacheComponents", which pre-builds pages and treats
 *   today's date (new Date() in the Header and the current
 *   Sunday redirect) as an error. The course code is written
 *   for the standard behavior, so these two settings are OFF.
 * LEARNING GAP:
 *   - Same fix as my WDD 430 portfolio.
 *   - partialPrefetching works together with cacheComponents,
 *     so it's turned off too.
 *   - The turbopack/Tailwind section is the default setup that
 *     makes Tailwind CSS work. Leave it as is.
 * ========================================================== */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
