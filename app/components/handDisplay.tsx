import React from "react";
import { ICard, getStrHand } from "../utils/blackjack";

interface HandDisplayProps {
  title: string;
  hand: ICard[];
  hideSecondCard?: boolean;
}

const HandDisplay: React.FC<HandDisplayProps> = ({
  title,
  hand,
  hideSecondCard = false,
}) => {
  return (
    <div className="hand-display">
      <h2>{title}</h2>
      <p>{getStrHand(hand, hideSecondCard)}</p>
    </div>
  );
};

export default HandDisplay;
