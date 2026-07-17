import type { Metadata } from "next";
import NearbySearch from "@/components/nearby-search";

const description =
  "Find tea rooms, coffee shops and cafés around you, mapped and sorted by walking distance.";

export const metadata: Metadata = {
  title: "Nearby",
  description,
  alternates: { canonical: "/nearby" },
  openGraph: {
    type: "website",
    title: "Nearby · TeaBrew",
    description,
    url: "/nearby",
  },
};

export default function NearbyPage() {
  return <NearbySearch />;
}
