"use client";

import { useEffect } from "react";
import { hydrateSaved } from "@/lib/saved";

/** Loads the saved shelf from localStorage once, after the first paint. */
export default function SavedHydrator() {
  useEffect(() => {
    hydrateSaved();
  }, []);

  return null;
}
