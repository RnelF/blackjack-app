"use client";
import Deck from "./deck";
import { ICard } from "./types";
import { getHandValue, getStrHand } from "./utils";
import { useState } from "react";

export default function Home() {
  const [decision, setDecision] = useState("");
  const [playerHand, setPlayerHand] = useState<ICard[]>([]);
  const [playerHandDisplay, setPlayerHandDisplay] = useState("");
  const [dealerHand, setDealerHand] = useState<ICard[]>([]);
  const [dealerHandDisplay, setDealerHandDisplay] = useState("");
  const [balance, setBalance] = useState(100);
  const [bust, setBust] = useState(false);
  const [bet, setBet] = useState("");
  const [deck, setDeck] = useState(new Deck());

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

  function dealPlayer(playerHand: ICard[], deck: Deck) {
    playerHand = deck.deal(2);
    setPlayerHand(playerHand);
  }

  function dealDealer(dealerHand: ICard[], deck: Deck) {
    dealerHand = deck.deal(2);
    setDealerHand(dealerHand);
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

  function handleInputBet(event: React.ChangeEvent<HTMLInputElement>) {
    setBet(event.target.value);
  }

  function handleSubmitBet() {
    if (parseInt(bet) > balance) {
      setBet("Insufficient Balance");
    } else if (parseInt(bet) <= 0) {
      setBet("Invalid Bet!");
    } else {
      dealDealer(playerHand, deck);
      dealPlayer(dealerHand, deck);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div>
        <h1>Blackjack</h1>
        <button
          onClick={() => {
            setDeck(new Deck());
            setPlayerHand([]);
            setDealerHand([]);
          }}
        >
          Reset
        </button>
      </div>
      <div>
        <div>{JSON.stringify(playerHand)}</div>
        <div>{JSON.stringify(dealerHand)}</div>
      </div>
      <div>
        <div>{playerHandDisplay}</div>
        <div>{dealerHandDisplay}</div>
      </div>
      <div>
        <button
          onClick={() => {
            setDecision("hit");
            playerTurn(playerHand, deck);
            dealerTurn(dealerHand, deck);
          }}
        >
          Hit
        </button>
        <button
          onClick={() => {
            setDecision("stand");
            playerTurn(playerHand, deck);
            dealerTurn(dealerHand, deck);
          }}
        >
          Stand
        </button>
      </div>
      <div>
        <input type="number" onChange={handleInputBet} value={bet} />{" "}
        <button onClick={handleSubmitBet}>Place Bet</button>
        <div>{bet}</div>
        <div>
          <p>Current Balance: {balance}</p>
        </div>
      </div>
    </div>
  );
}
