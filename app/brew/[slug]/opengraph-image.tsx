import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { formatDuration, getRecipe } from "@/lib/recipes";

export const alt = "TeaBrew brew guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function RecipeOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) {
    return new ImageResponse(<div style={{ display: "flex" }} />, size);
  }

  // Satori can't fetch relative URLs, so the photo is inlined from disk.
  const photo = await readFile(path.join(process.cwd(), "public", recipe.image));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const facts = [
    `${recipe.tempC} °C`,
    `${formatDuration(recipe.steepSeconds)} steep`,
    recipe.strength,
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fdf8f3",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 70,
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: "#b26a12",
              letterSpacing: 6,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            TeaBrew · Brew guide
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 68,
                color: "#2a211a",
                lineHeight: 1.05,
                letterSpacing: -1.5,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {recipe.name}
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 28,
                color: "#7a6a5d",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {recipe.subtitle}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {facts.map((fact) => (
              <div
                key={fact}
                style={{
                  display: "flex",
                  background: "#fbeed9",
                  color: "#b26a12",
                  fontSize: 24,
                  padding: "10px 22px",
                  borderRadius: 999,
                }}
              >
                {fact}
              </div>
            ))}
          </div>
        </div>

        {/* Satori renders to an image; next/image has no role inside an OG card. */}
        <img
          src={photoSrc}
          alt=""
          width={480}
          height={630}
          style={{ width: 480, height: 630, objectFit: "cover" }}
        />
      </div>
    ),
    size,
  );
}
