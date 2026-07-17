import type { MetadataRoute } from "next";
import { recipes } from "@/lib/recipes";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    { url: `${siteUrl}/`, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${siteUrl}/brew`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${siteUrl}/nearby`, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const recipeRoutes = recipes.map((recipe) => ({
    url: `${siteUrl}/brew/${recipe.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  // /saved is deliberately omitted: it renders only device-local state and has
  // nothing meaningful for a crawler to index.
  return [...staticRoutes, ...recipeRoutes].map((route) => ({
    ...route,
    lastModified,
  }));
}
