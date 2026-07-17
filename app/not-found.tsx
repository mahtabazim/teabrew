import type { Metadata } from "next";
import Link from "next/link";
import { recipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page has gone cold. Find tea nearby or pick a brew guide.",
  robots: { index: false, follow: true },
};

const destinations = [
  {
    href: "/nearby",
    title: "Find tea nearby",
    body: "Search a place or share your location and see what's within walking distance.",
  },
  {
    href: "/brew",
    title: "Browse brew guides",
    body: "Six recipes with the temperature, ratio and a timer that runs while you steep.",
  },
  {
    href: "/saved",
    title: "Open your shelf",
    body: "The spots and recipes you've kept on this device.",
  },
];

export default function NotFound() {
  const suggestion = recipes[0];

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
      <p
        aria-hidden="true"
        className="font-display text-7xl font-semibold text-brew tabular-nums sm:text-8xl"
      >
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        This page has gone cold
      </h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-muted text-pretty">
        The page you were after doesn&apos;t exist — it may have moved, or the
        link might have a typo. Everything below is still hot.
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {destinations.map((destination) => (
          <Link
            key={destination.href}
            href={destination.href}
            className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brew/40 hover:shadow-md"
          >
            <h2 className="font-display text-lg font-semibold transition-colors group-hover:text-brew">
              {destination.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {destination.body}
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted">
        Or put the kettle on:{" "}
        <Link
          href={`/brew/${suggestion.slug}`}
          className="font-medium text-brew underline decoration-line underline-offset-4 transition-colors hover:decoration-brew"
        >
          {suggestion.name}
        </Link>
      </p>
    </div>
  );
}
