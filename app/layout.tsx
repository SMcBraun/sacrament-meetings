/* ==========================================================
 * app/layout.tsx — Root layout (the frame around every page)
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Loads the fonts and puts the Header on top,
 *   the page in the middle, and the Footer at the bottom.
 * LOGIC: next/font/google loads Inter (body text) and Lora
 *   (headings). Their CSS variables are used in globals.css.
 * WHY WE NEED IT: The assignment requires a Google Font loaded
 *   with next/font, and a root layout that only "composes"
 *   (puts pieces together).
 * LEARNING GAP: dynamic = 'force-dynamic' makes the Header's
 *   date fresh on every visit instead of frozen at build time.
 *   <main> lives here, so pages should NOT add another <main>.
 * ========================================================== */
import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const lora = Lora({ variable: '--font-lora', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sacrament Meeting Planner | Sunrise Ward',
  description: 'Plan, view, and print sacrament meeting programs.',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
