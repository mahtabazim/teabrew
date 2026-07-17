import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrewTimer from "@/components/brew-timer";
import SaveRecipeButton from "@/components/save-recipe-button";
import { formatDuration, getRecipe, recipes } from "@/lib/recipes";
import { siteUrl, toIsoDuration } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return { title: "Recipe not found" };

  return {
    title: recipe.name,
    description: recipe.blurb,
    alternates: { canonical: `/brew/${recipe.slug}` },
    openGraph: {
      type: "article",
      title: `${recipe.name} · TeaBrew`,
      description: recipe.blurb,
      url: `/brew/${recipe.slug}`,
    },
  };
}

export default async function RecipePage({ params }: Params) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const facts = [
    { label: "Water", value: `${recipe.tempC} °C` },
    { label: "Steep", value: formatDuration(recipe.steepSeconds) },
    { label: "Serves", value: String(recipe.servings) },
    { label: "Strength", value: recipe.strength },
  ];

  // schema.org Recipe: lets search engines show ingredients, time and rating
  // affordances rather than a plain blue link.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description: recipe.blurb,
    image: `${siteUrl}${recipe.image}`,
    url: `${siteUrl}/brew/${recipe.slug}`,
    recipeCategory: "Beverage",
    recipeCuisine: "Tea",
    keywords: `${recipe.name}, tea, ${recipe.strength.toLowerCase()}`,
    totalTime: toIsoDuration(recipe.steepSeconds),
    cookTime: toIsoDuration(recipe.steepSeconds),
    recipeYield: `${recipe.servings} ${recipe.servings === 1 ? "cup" : "cups"}`,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
    author: { "@type": "Organization", name: "TeaBrew" },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <script
        type="application/ld+json"
        // Recipe content is authored in-repo, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/brew"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brew"
      >
        <span aria-hidden="true">←</span> All brew guides
      </Link>

      <article className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-surface-alt">
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </div>

          <header className="mt-8">
            <p className="text-sm font-medium tracking-wide text-brew uppercase">
              {recipe.caffeine === "None"
                ? "Caffeine-free"
                : `${recipe.caffeine} caffeine`}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {recipe.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
              {recipe.blurb}
            </p>
            <SaveRecipeButton slug={recipe.slug} className="mt-6" />
          </header>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-surface px-4 py-4 text-center">
                <dt className="text-xs tracking-wide text-muted uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold tabular-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">Method</h2>
            <ol className="mt-5 space-y-5">
              {recipe.steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brew-soft font-display text-sm font-semibold text-brew"
                  >
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-relaxed text-pretty">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <aside className="mt-10 rounded-2xl border-l-2 border-leaf bg-surface-alt p-5">
            <p className="font-display text-sm font-semibold tracking-wide text-leaf uppercase">
              Why it matters
            </p>
            <p className="mt-2 leading-relaxed text-pretty">{recipe.tip}</p>
          </aside>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BrewTimer
            seconds={recipe.steepSeconds}
            label={`${formatDuration(recipe.steepSeconds)} steep`}
          />

          <section className="mt-6 rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-xl font-semibold">
              You&apos;ll need
            </h2>
            <ul className="mt-4 space-y-3">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-start gap-3 text-sm">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brew"
                  />
                  <span className="leading-relaxed">{ingredient}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
              Makes {recipe.servings} {recipe.servings === 1 ? "cup" : "cups"}.
              Scale the water and everything else together.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
