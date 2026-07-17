import type { Metadata } from "next";
import SavedShelf from "@/components/saved-shelf";

export const metadata: Metadata = {
  title: "Your shelf",
  description: "The tea spots and brew guides you've saved, kept on this device.",
};

export default function SavedPage() {
  return <SavedShelf />;
}
