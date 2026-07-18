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
    slug: "dragonwell",
    name: "Dragonwell Green Tea",
    subtitle: "Sweet, nutty, and impossibly smooth",
    image: "/assets/dragonwell.jpg",
    blurb:
      "China's most famous green tea, pan-fired into flat blades. The whole art is restraint: cooler water and a short steep keep it sweet and chestnutty instead of grassy and astringent.",
    tempC: 80,
    steepSeconds: 120,
    servings: 1,
    strength: "Delicate",
    caffeine: "Low",
    ingredients: [
      "250 ml water",
      "3 g Dragonwell (Longjing) leaves, about 1 tbsp",
      "A tall glass or a gaiwan",
    ],
    steps: [
      "Boil the water, then let it stand 3–4 minutes to fall to roughly 80 °C — boiling water scalds green tea into bitterness.",
      "Warm the glass with a little of the hot water and tip it out.",
      "Add the leaves and pour the water gently down the side of the glass.",
      "Steep 2 minutes, watching the blades sink and unfurl. Sip without straining, and top up the same leaves twice more.",
    ],
    tip: "Buy the freshest spring pick you can find. Dragonwell is at its sweetest within a few months of harvest and dulls quickly once it ages.",
  },
  {
    slug: "english-breakfast",
    name: "English Breakfast Tea",
    subtitle: "Bold, malty, and made for milk",
    image: "/assets/english-breakfast.jpg",
    blurb:
      "A brisk blend of black teas built to stand up to milk. Unlike the greens, this one wants a full rolling boil — the heat is what pulls out the malt and the backbone.",
    tempC: 100,
    steepSeconds: 240,
    servings: 1,
    strength: "Bold",
    caffeine: "Medium",
    ingredients: [
      "250 ml freshly boiled water",
      "1 heaped tsp (about 3 g) English Breakfast leaves, or 1 tea bag",
      "Milk, to taste",
      "Sugar, optional",
    ],
    steps: [
      "Warm the pot or mug with a splash of boiling water and pour it away.",
      "Bring the water to a full, still-bubbling boil — black tea needs the heat that green tea can't take.",
      "Add the leaves, pour, and steep a full 4 minutes.",
      "Strain, then add milk. Judge the strength by colour before you pour it.",
    ],
    tip: "Use freshly drawn water brought to the boil once. Re-boiled or off-the-boil water is low on oxygen and leaves black tea flat and thin.",
  },
  {
    slug: "earl-grey",
    name: "Earl Grey",
    subtitle: "Black tea lifted with bergamot",
    image: "/assets/earl-grey.jpg",
    blurb:
      "Black tea scented with oil of bergamot, a bitter Mediterranean citrus. The perfume is fragile — push the steep too long and it tips from floral into sharp and soapy.",
    tempC: 95,
    steepSeconds: 180,
    servings: 1,
    strength: "Balanced",
    caffeine: "Medium",
    ingredients: [
      "250 ml water",
      "1 tsp (about 3 g) Earl Grey leaves, or 1 tea bag",
      "1 thin slice of lemon, optional",
    ],
    steps: [
      "Heat the water to just under boiling — a few small bubbles, not a rolling churn.",
      "Warm the cup and add the leaves.",
      "Steep 3 minutes, a shade shorter than plain black tea.",
      "Strain and drink it black, or with a thin slice of lemon. Milk mutes the bergamot.",
    ],
    tip: "Steep Earl Grey a touch shorter than you would ordinary black tea. The bergamot turns bitter before the tea itself does.",
  },
  {
    slug: "oolong",
    name: "Tie Guan Yin Oolong",
    subtitle: "Floral, buttery, endlessly re-steepable",
    image: "/assets/oolong.jpg",
    blurb:
      "A partly-oxidised tea rolled into tight pellets that open over several infusions. Brewed the gongfu way — lots of leaf, little water, short steeps — it gives a different cup every round.",
    tempC: 95,
    steepSeconds: 45,
    servings: 2,
    strength: "Balanced",
    caffeine: "Medium",
    ingredients: [
      "150 ml water",
      "6 g Tie Guan Yin, a rounded tbsp of rolled pellets",
      "A small teapot or gaiwan and two cups",
    ],
    steps: [
      "Rinse the leaves: pour hot water over them and tip it straight out to wake the pellets.",
      "Fill the pot and steep the first infusion just 45 seconds.",
      "Pour it out completely into the cups — water left sitting on the leaves stews them bitter.",
      "Re-steep, adding 10–15 seconds each round. Good Tie Guan Yin gives five or more infusions.",
    ],
    tip: "Don't bin the leaves after one cup. Oolong's best infusion is often the second or third, once the pellets have fully unrolled.",
  },
  {
    slug: "matcha",
    name: "Whisked Matcha",
    subtitle: "Bright, umami, stone-ground green",
    image: "/assets/matcha.jpg",
    blurb:
      "Shade-grown green tea milled to a fine powder, so you drink the whole leaf rather than an infusion of it. It isn't steeped — it's whisked into suspension and drunk at once.",
    tempC: 75,
    steepSeconds: 30,
    servings: 1,
    strength: "Bold",
    caffeine: "Medium",
    ingredients: [
      "2 g matcha, about 1 heaped tsp",
      "70 ml water at 75 °C",
      "A bamboo whisk (chasen) and a wide bowl (chawan)",
    ],
    steps: [
      "Sift the matcha into the warm bowl — it clumps in the tin, and lumps never whisk out.",
      "Add a splash of the 75 °C water and stir to a smooth paste.",
      "Pour in the rest of the water.",
      "Whisk briskly in a W or M motion for about 30 seconds, until an even layer of fine foam forms. Drink straight away, before it separates.",
    ],
    tip: "Water much above 80 °C scorches matcha bitter. Rest just-boiled water a couple of minutes first, and always sift — that's what gives foam instead of lumps.",
  },
  {
    slug: "jasmine",
    name: "Jasmine Dragon Pearls",
    subtitle: "Green tea scented with real jasmine",
    image: "/assets/jasmine.jpg",
    blurb:
      "Young green tea leaves hand-rolled into pearls and scented over several nights with fresh jasmine blossoms. The base is green, so it takes cooler water and a gentle hand.",
    tempC: 80,
    steepSeconds: 180,
    servings: 1,
    strength: "Delicate",
    caffeine: "Low",
    ingredients: [
      "250 ml water",
      "6–8 jasmine dragon pearls, about 3 g",
      "A glass teapot or gaiwan",
    ],
    steps: [
      "Let just-boiled water rest a few minutes to reach about 80 °C — boiling water turns the green base bitter and burns off the jasmine perfume.",
      "Add the pearls to a warmed glass and pour the water over them.",
      "Steep 3 minutes, watching the pearls slowly unroll.",
      "Pour off completely, then re-steep two or three times, adding a little time each round.",
    ],
    tip: "Real jasmine tea is scented with fresh blossoms, not sprayed with oil. Brew it in glass so you can watch the pearls open — half the pleasure is in the unrolling.",
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
