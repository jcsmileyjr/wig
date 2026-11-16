// ===========================================================
// products.js: the single source of truth for subscription plans
// used by checkout. Plan names, prices, and included items were
// copied from services.html. IDs are stable; never use the
// displayed name as an identifier.
// ===========================================================

const PLANS = [
  {
    id: "everyday-synthetic",
    name: "Everyday Synthetic Box",
    category: "wig",
    hairType: "Synthetic",
    price: 40,
    frequency: "month",
    frequencyLabel: "/month",
    summary: "One synthetic wig a month, yours to keep.",
    included: [
      "1 synthetic wig every month",
      "Yours to keep, nothing to return",
      "Ready to wear",
      "Matched to your style quiz answers",
    ],
  },
  {
    id: "luxury-wig",
    name: "Luxury Wig",
    category: "wig",
    hairType: "Human hair",
    price: 110,
    frequency: "month",
    frequencyLabel: "/month",
    summary: "One luxury human hair wig a month.",
    note: "Pre-cut, glueless closures only",
    terms: ["glueless"],
    included: [
      "1 luxury human hair wig a month",
      "Cleaned, inspected, and sealed before it ships",
      "Prepaid return shipping",
      "Ready to wear",
    ],
  },
  {
    id: "luxury-swap",
    name: "Luxury Swap",
    category: "wig",
    hairType: "Human hair",
    price: 200,
    frequency: "month",
    frequencyLabel: "/month",
    summary: "Two luxury human hair wigs a month.",
    note: "Pre-cut, glueless closures only",
    terms: ["glueless"],
    included: [
      "2 luxury human hair wigs a month",
      "Cleaned, inspected, and sealed before they ship",
      "Prepaid return shipping",
      "Ready to wear",
    ],
  },
  {
    id: "synthetic-weave",
    name: "Synthetic Weave Box",
    category: "weave",
    hairType: "Synthetic",
    price: 40,
    frequency: "month",
    frequencyLabel: "/month",
    summary: "Two sets of two packs, yours to keep.",
    included: [
      "2 sets of 2 packs each (4 packs total)",
      "New and unworn",
      "Yours to keep, nothing to return",
      "Matched to your style quiz answers",
    ],
  },
  {
    id: "complete-install",
    name: "Complete Install Box",
    category: "weave",
    hairType: "Human hair",
    price: 350,
    frequency: "every 90 days",
    frequencyLabel: " every 90 days",
    summary: "Everything you need for a full install.",
    equivalent: "About $117 a month",
    terms: ["closure", "frontal"],
    included: [
      "3 bundles of human hair",
      "Closure and frontal both included",
      "New and unworn, yours to keep",
      "Delivered every 90 days",
    ],
  },
];

// Plain-language explanations for hair terms customers may not know.
// Shown on plan cards whose `terms` list includes the key.
const GLOSSARY = {
  glueless: "Glueless means the wig stays on with its built-in bands or straps, so no glue or adhesive is needed.",
  closure: "A closure is a small piece of lace that finishes the top of a weave and creates a natural-looking part.",
  frontal: "A frontal is a larger piece of lace that runs ear to ear across the front hairline, for a natural hairline and flexible parting.",
};

// Returns the plan with this ID, or null when the ID is missing or unknown.
function getPlanById(id) {
  if (typeof id !== "string") return null;
  return PLANS.find((plan) => plan.id === id) || null;
}

// Example: "$110/month" or "$350 every 90 days"
function formatPlanPrice(plan) {
  return "$" + plan.price + plan.frequencyLabel;
}
