/* ==========================================================
 * app/page.tsx — Landing page (URL: "/")
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The welcome page, with a picture and two
 *   buttons: "View this Sunday" and "All meetings".
 * LOGIC: next/image shows the picture. Link goes to other pages.
 * WHY WE NEED IT: The assignment requires next/image (not <img>)
 *   with alt, width, and height.
 * LEARNING GAP: width and height reserve space while the image
 *   loads, so the page doesn't jump (no "layout shift"). The alt
 *   text describes the picture for screen readers.
 * ========================================================== */
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">
            Sunrise Ward
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-navy">
            Sacrament Meeting Planner
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Plan and review weekly sacrament meeting programs. Members can view and print the
            program for this week and past weeks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/meetings/current"
              className="rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90"
            >
              View this Sunday
            </Link>
            <Link
              href="/meetings"
              className="rounded-full border-2 border-navy px-6 py-3 font-semibold text-navy hover:bg-navy/5"
            >
              All meetings
            </Link>
          </div>
        </div>
        <Image
          src="/hero.svg"
          alt="Illustration of a chapel with a steeple at sunrise"
          width={600}
          height={400}
          className="h-auto w-full rounded-xl shadow-sm"
        />
      </section>
    </div>
  );
}
