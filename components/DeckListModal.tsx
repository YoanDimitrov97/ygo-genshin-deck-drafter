"use client";

import { Card } from "@/lib/types";
import { colorFor } from "@/lib/theme";

interface DeckListModalProps {
  mainDeck: Card[];
  extraDeck: Card[];
  onClose: () => void;
}

interface GroupedCard {
  card: Card;
  count: number;
}

function groupByName(deck: Card[]): GroupedCard[] {
  const map = new Map<string, GroupedCard>();
  for (const c of deck) {
    const existing = map.get(c.name);
    if (existing) existing.count += 1;
    else map.set(c.name, { card: c, count: 1 });
  }
  return Array.from(map.values());
}

// Monsters, then Spells, then Traps — the order a real decklist reads in.
const CATEGORY_ORDER: Record<string, number> = {
  "effect monster": 0,
  xyz: 0,
  synchro: 0,
  fusion: 0,
  link: 0,
  spell: 1,
  trap: 2,
};

function sortForDisplay(grouped: GroupedCard[]): GroupedCard[] {
  return [...grouped].sort((a, b) => {
    const catA = CATEGORY_ORDER[a.card.card_type.toLowerCase()] ?? 3;
    const catB = CATEGORY_ORDER[b.card.card_type.toLowerCase()] ?? 3;
    if (catA !== catB) return catA - catB;
    return a.card.name.localeCompare(b.card.name);
  });
}

function DeckTile({ card, count }: GroupedCard) {
  const glow = colorFor(card);
  return (
    <div
      className="deck-tile"
      style={{ ["--glow" as string]: glow }}
      title={`${card.name} \u00d7${count}`}
    >
      <img src={card.img} alt={card.name} loading="lazy" />
      {count > 1 && <span className="deck-tile-qty">&times;{count}</span>}
      <small>{card.name}</small>
    </div>

  );
}

function DeckSection({ title, deck }: { title: string; deck: Card[] }) {
  const grouped = sortForDisplay(groupByName(deck));
  return (
    <div className="deck-section">
      <h3 className="deck-section-title">
        {title} <span className="deck-section-count">({deck.length})</span>
      </h3>
      {grouped.length === 0 ? (
        <p className="deck-section-empty">No cards yet.</p>
      ) : (
        <div className="deck-tile-grid">
          {grouped.map(({ card, count }) => (
            <DeckTile key={card.name} card={card} count={count} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DeckListModal({
  mainDeck,
  extraDeck,
  onClose,
}: DeckListModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Deck</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            close
          </button>
        </div>
        <div className="modal-body">
          <DeckSection title="Main Deck" deck={mainDeck} />
          <DeckSection title="Extra Deck" deck={extraDeck} />
        </div>
      </div>
    </div>
  );
}
