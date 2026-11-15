import { Card } from "./types";

export const ATTRIBUTE_COLORS: Record<string, string> = {
  FIRE: "#e0663c",
  WATER: "#4a9edb",
  WIND: "#5fc98d",
  EARTH: "#b8873f",
  DARK: "#9b6fd1",
  LIGHT: "#e8d48b",
  XYZ: "#383838",
};

export const SPELL_COLOR = "#42c478";
export const TRAP_COLOR = "#9b1e3f";
export const NEUTRAL_COLOR = "#e7b65b";

const EXTRA_TYPE_CLASS: Record<string, string> = {
  xyz: "meta-pill-xyz",
  synchro: "meta-pill-synchro",
  fusion: "meta-pill-fusion",
  link: "meta-pill-link",
};

export function extraTypeClass(cardType: string): string {
  return EXTRA_TYPE_CLASS[cardType.toLowerCase()] ?? "";
}

export function colorFor(card: Pick<Card, "attribute" | "card_type">): string {
  if (card.attribute && ATTRIBUTE_COLORS[card.attribute]) {
    return ATTRIBUTE_COLORS[card.attribute];
  }
  if (card.card_type === "effect monster") return NEUTRAL_COLOR;
  if (card.card_type === "spell") return SPELL_COLOR;
  if (card.card_type === "trap") return TRAP_COLOR;
  return NEUTRAL_COLOR;
}

export function typeLabel(card: Pick<Card, "card_type">): string {
  switch (card.card_type) {
    case "effect monster":
      return "Effect Monster";
    case "xyz":
      return "Xyz Monster";
    case "synchro":
      return "Synchro Monster";
    case "link":
      return "Link Monster";
    case "Fusion":
      return "Fusion Monster";
    case "spell":
      return "Spell";
    case "trap":
      return "Trap";
    default:
      return card.card_type;
  }
}


// TCG-style frame colors, keyed by card_type (not attribute).
const FRAME_COLORS: Record<string, string> = {
  "normal monster": "#b8963f", // yellow
  "effect monster": "#c8703a", // orange
  ritual: "#4a6fb0",           // blue
  fusion: "#7a4fc7",           // purple
  synchro: "#d9d9d4",          // whitish
  xyz: "#3a3a44",              // charcoal (pure black vanishes on a dark UI)
  link: "#2f5fae",             // blue
  spell: "#1d9e74",            // green-teal
  trap: "#a2457a",             // magenta-purple
};

export function frameColorFor(card: Pick<Card, "card_type">): string {
  return FRAME_COLORS[card.card_type.toLowerCase()] ?? NEUTRAL_COLOR;
}