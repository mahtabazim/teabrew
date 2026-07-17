"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSaved } from "@/lib/saved";

const links = [
  { href: "/nearby", label: "Nearby" },
  { href: "/brew", label: "Brew" },
  { href: "/saved", label: "Shelf" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const saved = useSaved();
  const savedCount = saved.shops.length + saved.recipes.length;

  return (
    <header className="sticky top-0 z-[1000] border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/assets/logo.ico"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-display text-xl font-semibold tracking-tight">
            TeaBrew
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brew-soft text-brew"
                    : "text-muted hover:bg-surface-alt hover:text-ink"
                }`}
              >
                {label}
                {href === "/saved" && savedCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-brew px-1.5 py-0.5 text-[11px] font-semibold text-cream tabular-nums">
                    {savedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-ink transition-colors hover:bg-surface-alt md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-cream md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {links.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      active ? "bg-brew-soft text-brew" : "text-ink hover:bg-surface-alt"
                    }`}
                  >
                    {label}
                    {href === "/saved" && savedCount > 0 && (
                      <span className="ml-2 text-sm text-muted tabular-nums">
                        {savedCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
