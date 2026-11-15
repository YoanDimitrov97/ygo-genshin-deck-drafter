"use client";

import { useState } from "react";
import { Card } from "@/lib/types";
import { downloadDeckXml } from "@/lib/exportDeck";
import CardPanel from "./CardPanel";

interface CompletionScreenProps {
  mainDeck: Card[];
  extraDeck: Card[];
  skipsUsed: number;
  onRestart: () => void;
}

export default function CompletionScreen({
  mainDeck,
  extraDeck,
  skipsUsed,
  onRestart,
}: CompletionScreenProps) {
  const [deckName, setDeckName] = useState("My Genshin Deck");

  return (
    <div className="completion-wrap">
      <div className="completion-header">
        <p className="completion-eyebrow">Codex Sealed</p>
        <h1 className="completion-title">Your Deck is Complete</h1>
        <p className="completion-sub">
          {mainDeck.length} main deck cards &middot; {extraDeck.length} extra
          deck cards &middot; {skipsUsed} skip{skipsUsed === 1 ? "" : "s"} used
        </p>

        <div className="export-row">
          <label className="export-field">
            <span className="export-label">Deck name</span>
            <input
              className="export-input"
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              maxLength={60}
            />
          </label>
          <button
            type="button"
            className="restart-btn"
            onClick={() =>
              downloadDeckXml(deckName.trim() || "My Genshin Deck", mainDeck, extraDeck)
            }
          >
            Export Deck (.xml)
          </button>
          <button type="button" className="export-secondary" onClick={onRestart}>
            Build a New Deck
          </button>
        </div>
      </div>

      {extraDeck.length > 0 && (
        <section className="completion-section">
          <h2>Extra Deck</h2>
          <div className="thumb-grid">
            {extraDeck.map((c, i) => (
              <CardPanel key={c.name + i} card={c} size="thumb" />
            ))}
          </div>
        </section>
      )}

      <section className="completion-section">
        <h2>Main Deck</h2>
        <div className="thumb-grid">
          {mainDeck.map((c, i) => (
            <CardPanel key={c.name + i} card={c} size="thumb" />
          ))}
        </div>
      </section>
    </div>
  );
}