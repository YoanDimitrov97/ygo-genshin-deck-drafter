"use client";

import { EXTRA_DECK_SIZE, MAIN_DECK_SIZE, TOTAL_SKIPS } from "@/lib/deck";

interface DeckStatusBarProps {
  mainCount: number;
  extraCount: number;
  skipsLeft: number;
  onViewDeck: () => void;
}

export default function DeckStatusBar({
  mainCount,
  extraCount,
  skipsLeft,
  onViewDeck,
}: DeckStatusBarProps) {
  const mainPct = Math.min(100, (mainCount / MAIN_DECK_SIZE) * 100);
  const extraPct = Math.min(100, (extraCount / EXTRA_DECK_SIZE) * 100);

  return (
    <div className="status-bar">
      <div className="status-block">
        <div className="status-label">
          <span>Main Deck</span>
          <span className="status-count">
            {mainCount} / {MAIN_DECK_SIZE}
          </span>
        </div>
        <div className="status-track">
          <div
            className="status-fill status-fill-main"
            style={{ width: `${mainPct}%` }}
          />
        </div>
      </div>

      <div className="status-block">
        <div className="status-label">
          <span>Extra Deck</span>
          <span className="status-count">
            {extraCount} / {EXTRA_DECK_SIZE}
          </span>
        </div>
        <div className="status-track">
          <div
            className="status-fill status-fill-extra"
            style={{ width: `${extraPct}%` }}
          />
        </div>
      </div>

      <div className="status-block status-skips">
        <div className="status-label">
          <span>Skips</span>
        </div>
        <div className="skip-orbs">
          {Array.from({ length: TOTAL_SKIPS }).map((_, i) => (
            <span
              key={i}
              className={
                "skip-orb" + (i < TOTAL_SKIPS - skipsLeft ? " skip-orb-used" : "")
              }
            />
          ))}
        </div>
      </div>

      <button type="button" className="view-deck-btn" onClick={onViewDeck}>
        View Deck
      </button>
    </div>
  );
}
