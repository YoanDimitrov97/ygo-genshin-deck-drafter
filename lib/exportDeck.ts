import { Card } from "./types";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Uses dbook_id; falls back to the number in the image URL if it's missing. */
function cardId(card: Card): string {
  if (card.dbook_id) return card.dbook_id;
  const m = card.img.match(/\/(\d+)\.\w+/);
  return m ? m[1] : "";
}

// One <card> line per copy, alphabetical like a normal export.
function cardLines(deck: Card[]): string[] {
  return [...deck]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (c) =>
        `<card id="${escapeXml(cardId(c))}" passcode="">${escapeXml(c.name)}</card>`
    );
}

export function buildDeckXml(
  deckName: string,
  mainDeck: Card[],
  extraDeck: Card[]
): string {
  const indent = (lines: string[]) => lines.map((l) => `  ${l}`);
  return [
    `<?xml version="1.0" encoding="utf-8" ?>`,
    `<deck name="${escapeXml(deckName)}">`,
    " <main>",
    ...indent(cardLines(mainDeck)),
    " </main>",
    " <side>",
    " </side>",
    " <extra>",
    ...indent(cardLines(extraDeck)),
    " </extra>",
    "</deck>",
  ].join("\n");
}

export function downloadDeckXml(
  deckName: string,
  mainDeck: Card[],
  extraDeck: Card[]
) {
  const xml = buildDeckXml(deckName, mainDeck, extraDeck);
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const safe = deckName.replace(/[^\w\- ]+/g, "").trim() || "deck";
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safe}.xml`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}