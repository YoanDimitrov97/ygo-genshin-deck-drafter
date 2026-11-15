"use client";

import { Card } from "@/lib/types";

function computeStats(deck: Card[]) {
  const s = { low: 0, mid: 0, high: 0, spells: 0, traps: 0 };
  for (const c of deck) {
    const type = c.card_type.toLowerCase();
    if (type === "spell") s.spells++;
    else if (type === "trap") s.traps++;
    else {
      const lv = parseInt(c.level, 10);
      if (Number.isNaN(lv)) continue;
      if (lv <= 4) s.low++;
      else if (lv <= 6) s.mid++;
      else s.high++;
    }
  }
  return { ...s, monsters: s.low + s.mid + s.high };
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="stat" style={{ ["--stat" as string]: color }}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function DeckStats({ mainDeck }: { mainDeck: Card[] }) {
  const s = computeStats(mainDeck);
  return (
    <div className="stats-bar">
      <div className="stats-group">
        <Stat label="Monsters" value={s.monsters} color="#FF8B53" />
        <span className="stats-divider" />
        <Stat label="Lv 1–4" value={s.low} color="#e6d6a3" />
        <Stat label="Lv 5–6" value={s.mid} color="#e6d6a3" />
        <Stat label="Lv 7+" value={s.high} color="#e6d6a3" />
      </div>
      <div className="stats-group">
        <Stat label="Spells" value={s.spells} color="#42c478" />
        <Stat label="Traps" value={s.traps} color="#d4466a" />
      </div>
    </div>
  );
}