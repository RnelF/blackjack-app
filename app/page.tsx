"use client";
import Deck from "./deck";
import { ICard } from "./types";
import { getHandValue, getStrHand } from "./utils";
import { useState } from "react";

export default function Home() {
  const [decision, setDecision] = useState("");
  const [playerHand, setPlayerHand] = useState<ICard[]>([]);
  const [dealerHand, setDealerHand] = useState<ICard[]>([]);
  const [gameDecision, setGameDecision] = useState("");
  const [balance, setBalance] = useState(100);
  const [bust, setBust] = useState(false);
  const [bet, setBet] = useState<number>(0);
  const [betError, setBetError] = useState<string>("");
  const [deck, setDeck] = useState(new Deck());

  function playerHit() {
    const newCard = deck.deal(1)[0];
    const updatedPlayerHand = [...playerHand, newCard];
    setPlayerHand(updatedPlayerHand);

    // Check if the player busts after hitting
    const handValue = getHandValue(updatedPlayerHand);
    if (handValue > 21) {
      setGameDecision(
        `Bust! You lost. Your hand: ${getStrHand(
          updatedPlayerHand
        )} (Total: ${handValue})`
      );
      setBalance(balance - bet);
      setBust(true);
      resetGame();
    }
  }

  function playerStand() {
    setDecision("stand");
    dealerTurn();
  }

  function dealerTurn() {
    let updatedDealerHand = [...dealerHand];

    while (getHandValue(updatedDealerHand) < 17) {
      updatedDealerHand.push(deck.deal(1)[0]);
      setDealerHand([...updatedDealerHand]);
    }

    // Check the game outcome after the dealer finishes their turn
    const dealerValue = getHandValue(updatedDealerHand);
    const playerValue = getHandValue(playerHand);

    if (dealerValue > 21) {
      setGameDecision(`Dealer Busts! You win!`);
      setBalance(balance + bet * 2);
    } else if (playerValue > dealerValue) {
      setGameDecision(
        `You Win! Your Hand: ${getStrHand(
          playerHand
        )} Total: ${playerValue}, Dealer Hand: ${getStrHand(
          updatedDealerHand
        )} Total: ${dealerValue}`
      );
      setBalance(balance + bet * 2);
    } else if (playerValue < dealerValue) {
      setGameDecision(
        `You Lose! Your Hand: ${getStrHand(
          playerHand
        )} Total: ${playerValue}, Dealer Hand: ${getStrHand(
          updatedDealerHand
        )} Total: ${dealerValue}`
      );
    } else {
      setGameDecision(`Push! It's a tie.`);
      setBalance(balance + bet); // Return the bet on a tie
    }

    resetGame();
  }

  function handleInputBet(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(event.target.value);
    setBet(value);
    setBetError("");
  }

  function handleSubmitBet() {
    if (bet > balance) {
      setBetError("Insufficient Balance");
    } else if (bet <= 0 || isNaN(bet)) {
      setBetError("Invalid Bet!");
    } else if (bet > 0 && typeof bet === "number") {
      setBalance(balance - bet);
      const playerStartingHand = deck.deal(2);
      const dealerStartingHand = deck.deal(2);
      setPlayerHand(playerStartingHand);
      setDealerHand(dealerStartingHand);
      setGameDecision("");
      setBust(false);
    }
  }

  function resetGame() {
    setDeck(new Deck());
    setPlayerHand([]);
    setDealerHand([]);
    setBet(0);
    setBetError("");
    setDecision("");
    setGameDecision("");
    setBust(false);
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div>
        <h1>Blackjack</h1>
        <button
          onClick={() => {
            resetGame();
          }}
        >
          Reset
        </button>
      </div>
      <div>
        <div>
          <span>Dealer's Hand</span>
          <span>{JSON.stringify(dealerHand)}</span>
        </div>

        <div>
          <span>Your Hand</span>
          <span>
            {JSON.stringify(playerHand)} Total: {getHandValue(playerHand)}
          </span>
        </div>
      </div>

      <div>{gameDecision}</div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            playerHit();
          }}
          className="border border-black bg-slate-50 rounded-md w-32"
        >
          Hit
        </button>

        <button
          onClick={() => {
            setDecision("stand");
            dealerTurn();
          }}
          className="border border-black bg-slate-50 rounded-md w-32"
        >
          Stand
        </button>
      </div>
      <div>
        <input type="text" onChange={handleInputBet} value={bet} />{" "}
        <button onClick={handleSubmitBet}>Place Bet</button>
        <div>
          <p>Current Balance: {balance}</p>
        </div>
      </div>
    </div>
  );
}
