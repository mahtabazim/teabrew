import { ImageResponse } from "next/og";

export const alt = "TeaBrew — find tea near you, brew it right at home";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fdf8f3",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 999,
              background: "#b26a12",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 30,
              color: "#b26a12",
              letterSpacing: 6,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            TeaBrew
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 82,
              color: "#2a211a",
              lineHeight: 1.05,
              letterSpacing: -2,
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 940,
            }}
          >
            Find tea near you, brew it right at home.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              color: "#7a6a5d",
              maxWidth: 860,
              display: "flex",
            }}
          >
            Tea rooms and cafés around you, plus the temperature, ratio and
            timer to make the same cup yourself.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["Find it", "Brew it", "Keep it"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                background: "#fbeed9",
                color: "#b26a12",
                fontSize: 24,
                padding: "10px 22px",
                borderRadius: 999,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
