import { Card } from "./types";

// Set this in .env.local — see .env.local.example.
const SHEETDB_URL = process.env.NEXT_PUBLIC_SHEETDB_URL;

/**
 * Pulls the card pool from SheetDB. Normalizes a couple of response shapes
 * since SheetDB returns a bare array for a plain GET, but wraps it in
 * `{ data: [...] }` when you pass query params like `?sheet=`.
 */
export async function fetchCardPool(): Promise<Card[]> {
  if (!SHEETDB_URL) {
    throw new Error(
      "Missing NEXT_PUBLIC_SHEETDB_URL. Add it to .env.local — see .env.local.example."
    );
  }

  const res = await fetch(SHEETDB_URL);
  if (!res.ok) {
    throw new Error(`SheetDB request failed (${res.status})`);
  }

  const json = await res.json();
  const rows: unknown[] = Array.isArray(json) ? json : json?.data ?? [];

  return rows.map(normalizeRow);
}

function normalizeRow(row: unknown): Card {
  const r = row as Record<string, string | undefined>;
  return {
    card_type: r.card_type ?? "",
    img: r.img ?? "",
    name: r.name ?? "",
    attribute: r.attribute ?? "",
    level: r.level ?? "",
    effect: r.effect ?? "",
    type: r.type ?? "",
    atk: r.atk ?? "",
    def: r.def ?? "",
    is_limited: r.is_limited ?? "",
    dbook_id: (r.dbook_id ?? "").trim(),
  };
}
