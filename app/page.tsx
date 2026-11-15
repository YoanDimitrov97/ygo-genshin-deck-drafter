"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/lib/types";
import {
  MAIN_DECK_SIZE,
  TOTAL_SKIPS,
  drawChoices,
  isExtraDeckCard,
} from "@/lib/deck";
import { fetchCardPool } from "@/lib/fetchCards";
import CardPanel from "@/components/CardPanel";
import DeckStatusBar from "@/components/DeckStatusBar";
import DeckListModal from "@/components/DeckListModal";
import CompletionScreen from "@/components/CompletionScreen";

const PICK_ANIMATION_MS = 1800; // keep in sync with the 1.8s in the CSS

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; pool: Card[] };

export default function Home() {
  const [load, setLoad] = useState<LoadState>({ status: "loading" });

  const [mainDeck, setMainDeck] = useState<Card[]>([]);
  const [extraDeck, setExtraDeck] = useState<Card[]>([]);
  const [skipsLeft, setSkipsLeft] = useState(TOTAL_SKIPS);
  const [choices, setChoices] = useState<Card[]>([]);
  const [showDeck, setShowDeck] = useState(false);
  const [round, setRound] = useState(0);

  const [picked, setPicked] = useState<Card | null>(null);
  const pickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCardPool()
      .then((pool) => {
        if (cancelled) return;
        if (pool.length === 0) {
          setLoad({
            status: "error",
            message: "SheetDB returned an empty card pool.",
          });
          return;
        }
        setLoad({ status: "ready", pool });
        setChoices(drawChoices(pool, [], []));
      })
      .catch((err: Error) => {
        if (!cancelled) setLoad({ status: "error", message: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pickTimer.current) clearTimeout(pickTimer.current);
    };
  }, []);



  const complete = mainDeck.length >= MAIN_DECK_SIZE;
  const stuck =
    load.status === "ready" && !complete && choices.length === 0 && round > 0;

  function handleSelect(card: Card) {
    if (load.status !== "ready" || complete || picked) return;
    setPicked(card);
    pickTimer.current = setTimeout(() => commitPick(card), PICK_ANIMATION_MS);
  }

  function commitPick(card: Card) {
    if (load.status !== "ready") return;
    const pool = load.pool;
    let nextMain = mainDeck;
    let nextExtra = extraDeck;
    if (isExtraDeckCard(card)) {
      nextExtra = [...extraDeck, card];
      setExtraDeck(nextExtra);
    } else {
      nextMain = [...mainDeck, card];
      setMainDeck(nextMain);
    }
    setRound((r) => r + 1);
    if (nextMain.length < MAIN_DECK_SIZE) {
      setChoices(drawChoices(pool, nextMain, nextExtra));
    } else {
      setChoices([]);
    }
    setPicked(null);
  }

  function handleSkip() {
    if (load.status !== "ready" || skipsLeft <= 0 || complete || picked) return;
    setSkipsLeft((s) => s - 1);
    setChoices(
      drawChoices(
        load.pool,
        mainDeck,
        extraDeck,
        3,
        choices.map((c) => c.name)
      )
    );
  }

  function handleRestart() {
    if (load.status !== "ready") return;
    setMainDeck([]);
    setExtraDeck([]);
    setSkipsLeft(TOTAL_SKIPS);
    setRound(0);
    setChoices(drawChoices(load.pool, [], []));
  }

  if (load.status === "loading") {
    return (
      <main className="game-wrap status-screen">
        <p className="status-screen-text">Consulting the Egyptian Gods...&hellip;</p>
      </main>
    );
  }

  if (load.status === "error") {
    return (
      <main className="game-wrap status-screen">
        <p className="status-screen-text status-screen-error">
          Couldn&apos;t reach the data API: {load.message}
        </p>
      </main>
    );
  }

  if (complete) {
    return (
      <CompletionScreen
        mainDeck={mainDeck}
        extraDeck={extraDeck}
        skipsUsed={TOTAL_SKIPS - skipsLeft}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <main className="game-wrap">
      <header className="game-header">
        {/* <p className="game-eyebrow">A Duel Codex of Teyvat</p> */}
        {/* <h1 className="game-title">Select Your Deck</h1> */}
      </header>

      <DeckStatusBar
        mainCount={mainDeck.length}
        extraCount={extraDeck.length}
        skipsLeft={skipsLeft}
        mainDeck={mainDeck}
        onViewDeck={() => setShowDeck(true)}
      />

      {stuck ? (
        <div className="stuck-panel">
          <p>
            No legal cards remain to offer you. Your Deck holds{" "}
            {mainDeck.length} of {MAIN_DECK_SIZE} main deck cards.
          </p>
        </div>
      ) : (
        <section className="choice-row" key={round}>
          {choices.map((card, i) => {
            const state = picked
              ? picked.name === card.name
                ? "picked"
                : "destroyed"
              : "";
            return (
              <div
                className={`choice-slot${state ? ` choice-slot--${state}` : ""}`}
                style={{ animationDelay: state ? "0ms" : `${i * 70}ms` }}
                key={card.name}
              >
                <CardPanel
                  card={card}
                  disabled={picked !== null}
                  onClick={() => handleSelect(card)}
                />
              </div>
            );
          })}
        </section>
      )}

      <div className="controls-row">
        <button
          type="button"
          className="skip-btn"
          onClick={handleSkip}
          disabled={skipsLeft <= 0 || picked !== null}
        >
          Skip These Cards ({skipsLeft} left)
        </button>
      </div>

      {showDeck && (
        <DeckListModal
          mainDeck={mainDeck}
          extraDeck={extraDeck}
          onClose={() => setShowDeck(false)}
        />
      )}
    </main>
  );
}
