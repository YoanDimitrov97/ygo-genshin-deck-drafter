import { Card } from "./types";

export const MAIN_DECK_SIZE = 40;
export const EXTRA_DECK_SIZE = 15;
export const TOTAL_SKIPS = 3;
export const CHOICES_PER_ROUND = 3;

// Card types that belong in the Extra Deck rather than the Main Deck.
const EXTRA_DECK_TYPES = new Set(["xyz", "synchro", "fusion", "link"]);

export function isExtraDeckCard(card: Card): boolean {
  return EXTRA_DECK_TYPES.has(card.card_type.toLowerCase());
}

export function maxCopiesFor(card: Card): number {
  return card.is_limited === "1" ? 1 : 3;
}

export function countInDeck(deck: Card[], name: string): number {
  return deck.reduce((n, c) => (c.name === name ? n + 1 : n), 0);
}

/** Can this card still legally be added, given the current decks? */
export function isCardEligible(
  card: Card,
  mainDeck: Card[],
  extraDeck: Card[]
): boolean {
  const isExtra = isExtraDeckCard(card);
  const deck = isExtra ? extraDeck : mainDeck;
  const deckCap = isExtra ? EXTRA_DECK_SIZE : MAIN_DECK_SIZE;

  if (deck.length >= deckCap) return false;
  return countInDeck(deck, card.name) < maxCopiesFor(card);
}

export function getEligiblePool(
  pool: Card[],
  mainDeck: Card[],
  extraDeck: Card[],
  exclude: string[] = []
): Card[] {
  return pool.filter(
    (card) =>
      isCardEligible(card, mainDeck, extraDeck) && !exclude.includes(card.name)
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Draw the next set of selectable cards. Tries to avoid repeating whatever
 * was just on screen (useful for the skip button); falls back to the full
 * eligible pool if excluding those cards leaves too few options.
 */
export function drawChoices(
  pool: Card[],
  mainDeck: Card[],
  extraDeck: Card[],
  count: number = CHOICES_PER_ROUND,
  exclude: string[] = []
): Card[] {
  let eligible = getEligiblePool(pool, mainDeck, extraDeck, exclude);
  if (eligible.length < count && exclude.length > 0) {
    eligible = getEligiblePool(pool, mainDeck, extraDeck, []);
  }
  return shuffle(eligible).slice(0, count);
}
