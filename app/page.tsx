"use client";
import Deck from "./deck";
import { ICard } from "./types";
import { getHandValue, getStrHand } from "./utils";
import { use, useState } from "react";

export default function Home() {
  const [decision, setDecision] = useState("");
  const [playerHand, setPlayerHand] = useState([]);
  const [playerHandDisplay, setPlayerHandDisplay] = useState("");
  const [dealerHand, setDealerHand] = useState([]);
  const [dealerHandDisplay, setDealerHandDisplay] = useState("");
  const [balance, setBalance] = useState(100);
  const [bust, setBust] = useState(false);

  function playerTurn(playerHand: ICard[], deck: Deck) {
    let handValue = getHandValue(playerHand);

    if (decision === "hit") {
      playerHand.push(deck.deal(1)[0]);
      handValue = getHandValue(playerHand);
      setPlayerHandDisplay(
        `Your hand: ${getStrHand(playerHand)} (Total: ${handValue})`
      );
    } else {
      setPlayerHandDisplay(
        `Your hand: ${getStrHand(playerHand)} (Total: ${handValue})`
      );
    }

    if (handValue > 21) {
      setPlayerHandDisplay(
        "`Your hand: ${getStrHand(playerHand)} (Total: ${handValue}) \n Busted!"
      );
      setBust(true);
    }
  }

  function dealerTurn(dealerHand: ICard[], deck: Deck) {
    let handValue = getHandValue(dealerHand);

    if (handValue >= 17) {
      setDealerHandDisplay(
        `Dealer's hand: ${getStrHand(dealerHand)} (Total: ${handValue})`
      );
    } else {
      dealerHand.push(deck.deal(1)[0]);
      handValue = getHandValue(dealerHand);
    }
  }

  return (
    <div>
      <div>
        <h1>Blackjack</h1>
        <button onClick={() => new Deck()}>Reset</button>
      </div>
      <div>
        <div>{playerHand}</div>
        <div>{dealerHand}</div>
      </div>
      <div>
        <input type="number" />
      </div>
    </div>
  );
}
