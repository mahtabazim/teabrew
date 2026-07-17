"use client";

import { toggleRecipe, useSaved } from "@/lib/saved";

export default function SaveRecipeButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const saved = useSaved();
  const isSaved = saved.recipes.includes(slug);

  return (
    <button
      type="button"
      onClick={() => toggleRecipe(slug)}
      aria-pressed={isSaved}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        isSaved
          ? "border-brew bg-brew-soft text-brew"
          : "border-line text-muted hover:border-brew hover:text-brew"
      } ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.9-9.5-9.3C1 8.4 2.8 5 6.2 5c2 0 3.3 1.1 4 2.1L12 9l1.8-1.9C14.5 6.1 15.8 5 17.8 5c3.4 0 5.2 3.4 3.7 6.7C19.5 16.1 12 21 12 21z"
          fill={isSaved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      {isSaved ? "Saved to shelf" : "Save recipe"}
    </button>
  );
}
