/* ==========================================================
 * components/NavLinks.tsx — Main menu with an active style
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The menu links. The link for the page you're
 *   on gets a highlighted look.
 * LOGIC: usePathname() reads the current address, like
 *   '/meetings'. Each link compares itself to that address.
 * WHY WE NEED IT: The assignment requires a Client Component
 *   that uses usePathname for the active link.
 * LEARNING GAP: 'use client' is REQUIRED here because
 *   usePathname only works in the browser (quiz question 8!).
 *   aria-current="page" tells screen readers which page is active.
 * ========================================================== */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'Meetings' },
  { href: '/meetings/current', label: 'This Sunday' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          /* Home is active only on '/'. Others are active on their
             own page and any page inside it (like /meetings/3). */
          const isActive =
            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? 'rounded-full bg-white px-4 py-2 font-semibold text-navy'
                    : 'rounded-full px-4 py-2 text-white hover:bg-white/15'
                }
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
