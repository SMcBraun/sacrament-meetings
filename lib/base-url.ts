/* ==========================================================
 * lib/base-url.ts — Finds this website's own address
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Works out "http://localhost:3000" on my Mac, or
 *   the Vercel address when it's online.
 * LOGIC: Reads the "host" from the incoming request's headers.
 * WHY WE NEED IT: Pages fetch from my own API (/api/meetings).
 *   Server code needs the FULL address, not just /api/meetings.
 * LEARNING GAP: In this Next.js version, headers() must be
 *   awaited. Using headers() also tells Next.js to build the page
 *   fresh on every visit, so the data is always current.
 * ========================================================== */
import { headers } from 'next/headers';

export async function getBaseUrl(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3000';
  const protocol =
    headerList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}
