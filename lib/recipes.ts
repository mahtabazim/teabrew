export type Recipe = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  blurb: string;
  /** Water temperature in °C. */
  tempC: number;
  /** Steep time the timer counts down. */
  steepSeconds: number;
  servings: number;
  strength: "Delicate" | "Balanced" | "Bold";
  caffeine: "None" | "Low" | "Medium";
  ingredients: string[];
  steps: string[];
  tip: string;
};

export const recipes: Recipe[] = [
  {
    slug: "ginger",
    name: "Ginger Root Tea",
    subtitle: "Spicy, energizing, and full of flavor",
    image: "/assets/ginger.jpg",
    blurb:
      "Fresh ginger simmered rather than steeped — boiling is what pulls the heat and oils out of the root. Sharp, warming, and good for a scratchy throat.",
    tempC: 100,
    steepSeconds: 600,
    servings: 2,
    strength: "Bold",
    caffeine: "None",
    ingredients: [
      "500 ml water",
      "20 g fresh ginger (a thumb-sized piece), thinly sliced",
      "1 tsp honey, to taste",
      "2 lemon wedges",
    ],
    steps: [
      "Peel the ginger with the edge of a spoon and slice it into thin coins — more surface area means more extraction.",
      "Bring the water to a rolling boil, add the ginger, and reduce to a low simmer.",
      "Simmer for 10 minutes. The liquid should turn faintly golden and smell sharp.",
      "Strain into cups, then stir in honey and a squeeze of lemon off the heat.",
    ],
    tip: "Add honey only after the tea leaves the heat — sustained boiling flattens its floral notes.",
  },
  {
    slug: "lemon",
    name: "Honey Lemon Tea",
    subtitle: "A citrus twist for freshness and zest",
    image: "/assets/lemon.jpg",
    blurb:
      "The simplest thing in this book and the easiest to ruin. Boiling water scorches lemon juice into bitterness, so let the kettle rest before it meets the fruit.",
    tempC: 80,
    steepSeconds: 240,
    servings: 1,
    strength: "Delicate",
    caffeine: "None",
    ingredients: [
      "250 ml water",
      "Juice of half a lemon (about 20 ml)",
      "1 strip lemon peel, pith removed",
      "2 tsp honey",
    ],
    steps: [
      "Boil the water, then let it stand for 2 minutes to fall to roughly 80 °C.",
      "Drop the lemon peel into the cup and pour the water over it.",
      "Steep 4 minutes, then remove the peel — leaving it longer turns the cup bitter.",
      "Stir in the honey, then the lemon juice last.",
    ],
    tip: "Roll the lemon under your palm before juicing; it ruptures the cells and yields noticeably more juice.",
  },
  {
    slug: "mint",
    name: "Fresh Mint Tea",
    subtitle: "Cooling and refreshing herb for calmness",
    image: "/assets/mint.jpg",
    blurb:
      "Whole leaves, never chopped. Bruising mint releases chlorophyll and turns a clean, cooling cup grassy and dull.",
    tempC: 95,
    steepSeconds: 300,
    servings: 1,
    strength: "Delicate",
    caffeine: "None",
    ingredients: [
      "250 ml water",
      "A generous handful of fresh mint (about 10 sprigs)",
      "1 tsp sugar, optional",
    ],
    steps: [
      "Rinse the mint and pat it dry, keeping the leaves whole and on their stems.",
      "Heat the water to just under boiling — small bubbles, no rolling churn.",
      "Press the mint gently into the pot and pour the water over it.",
      "Cover and steep 5 minutes. Covering traps the volatile oils that would otherwise escape as steam.",
    ],
    tip: "Cover the pot while it steeps. Everything that makes mint smell like mint is volatile, and an open pot lets it leave.",
  },
  {
    slug: "honey",
    name: "Honey Ginger Soother",
    subtitle: "Natural sweetness for a balanced taste",
    image: "/assets/honey.jpg",
    blurb:
      "A soft, rounded cup for a rough evening. The honey is the point here rather than an afterthought, so it goes in last and never boils.",
    tempC: 75,
    steepSeconds: 300,
    servings: 1,
    strength: "Balanced",
    caffeine: "None",
    ingredients: [
      "250 ml water",
      "2 tbsp raw honey",
      "3 thin slices fresh ginger",
      "1 tsp lemon juice",
      "1 small cinnamon stick, optional",
    ],
    steps: [
      "Steep the ginger and cinnamon in freshly boiled water for 5 minutes.",
      "Let the cup cool until it is warm rather than hot — around 75 °C, comfortable to sip.",
      "Strain out the solids.",
      "Stir in the honey until dissolved, then finish with the lemon juice.",
    ],
    tip: "Raw honey's enzymes break down above roughly 40 °C. It will still taste sweet in a hot cup, just less complex.",
  },
  {
    slug: "cinnamon",
    name: "Cinnamon Bark Tea",
    subtitle: "Warm and aromatic spice for cozy brews",
    image: "/assets/cinnamon.jpg",
    blurb:
      "Sticks, not powder. Ground cinnamon clouds the cup and settles into silt at the bottom; whole bark gives a clear, sweet-spiced infusion.",
    tempC: 100,
    steepSeconds: 900,
    servings: 2,
    strength: "Bold",
    caffeine: "None",
    ingredients: [
      "500 ml water",
      "2 cinnamon sticks, preferably Ceylon",
      "1 tsp honey, to taste",
      "1 star anise, optional",
    ],
    steps: [
      "Snap the cinnamon sticks in half to expose the inner bark.",
      "Bring the water to a boil, add the cinnamon, and drop to a bare simmer.",
      "Simmer 15 minutes until the water turns a deep amber.",
      "Strain, sweeten to taste, and serve hot.",
    ],
    tip: "Ceylon cinnamon is milder and sweeter than the common cassia, and far lower in coumarin if you drink this daily.",
  },
  {
    slug: "cardamom",
    name: "Cardamom Masala Chai",
    subtitle: "Sweet and fragrant for exotic blends",
    image: "/assets/cardamom.jpg",
    blurb:
      "Real chai is boiled, not steeped, and the milk goes in to finish. Cardamom leads; everything else supports it.",
    tempC: 100,
    steepSeconds: 300,
    servings: 2,
    strength: "Bold",
    caffeine: "Medium",
    ingredients: [
      "300 ml water",
      "200 ml whole milk",
      "6 green cardamom pods, crushed",
      "2 tsp strong black tea leaves (Assam works best)",
      "2 tsp sugar, to taste",
      "1 thin slice fresh ginger",
    ],
    steps: [
      "Crush the cardamom pods under the flat of a knife until they just split.",
      "Boil the water with the cardamom and ginger for 2 minutes to open the spices.",
      "Add the tea leaves and boil 2 minutes more.",
      "Pour in the milk and sugar, and bring it back up until it rises in the pan — pull it off the heat before it climbs over.",
      "Strain into cups from a height to aerate it.",
    ],
    tip: "Let it rise and pull it back two or three times. Each cycle thickens the body without stewing the tea into bitterness.",
  },
];

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
