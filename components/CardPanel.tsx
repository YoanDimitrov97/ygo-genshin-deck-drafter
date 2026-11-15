"use client";
import { AutoTextSize } from 'auto-text-size'
import { Card } from "@/lib/types";
import { colorFor, frameColorFor, typeLabel, extraTypeClass } from "@/lib/theme";


interface CardPanelProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  size?: "choice" | "thumb";
}

export default function CardPanel({
  card,
  onClick,
  disabled,
  size = "choice",
}: CardPanelProps) {
  const glow = colorFor(card);
  const frame = frameColorFor(card);
  const isMonster =
    card.card_type === "effect monster" || card.card_type === "xyz";

  if (size === "thumb") {
    return (
      <div
        className="thumb-card"
        style={{ ["--glow" as string]: glow, ["--frame" as string]: frame }}
        title={card.name}
      >
        <img src={card.img} alt={card.name} loading="lazy" />
        <span className="thumb-name">{card.name}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="choice-card"
      style={{ ["--glow" as string]: glow, ["--frame" as string]: frame }}
    >
      <div className="choice-card-frame">
        <div className="choice-card-art">
          <img src={card.img} alt={card.name} loading="lazy" />
        </div>
        <div className="choice-card-body">
          <p className="choice-card-name">
            {card.name}
            {card.level && <span className="meta-pill meta-pill-level">{card.level} ⭐</span>}</p>
          <div className="choice-card-meta">
            {card.attribute && <span className="meta-pill meta-pill-attribute">{card.attribute}</span>}
            <span className={`meta-pill meta-pill-type ${extraTypeClass(card.card_type)}`}>
              {typeLabel(card)}
            </span>
            {card.type && <span className="meta-pill">{card.type}</span>}

            {card.is_limited === "1" && (
              <span className="meta-pill meta-pill-limited">Limit 1</span>
            )}
          </div>
          <p className="choice-card-effect">{card.effect}</p>
          {isMonster && (
            <div className="choice-card-stats">
              <span>{card.atk || "?"} ATK </span>
              <span>/</span>
              <span> {card.def || "?"} DEF</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}