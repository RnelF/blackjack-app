"use client";
import DeckQuantity from "./components/deck-quantity/DeckQuantity";
import GameButtons from "./components/game-buttons/GameButtons";
import Hands from "./components/hands/Hands";
import Deck from "./deck";
import { ICard } from "./types";
import { getHandValue, getStrHand } from "./utils";
import { useState } from "react";

export default function Home() {
  const [decision, setDecision] = useState("");
  const [playerHand, setPlayerHand] = useState<ICard[]>([]);
  const [dealerHand, setDealerHand] = useState<ICard[]>([]);
  const [gameDecision, setGameDecision] = useState<JSX.Element | string>("");
  const [balance, setBalance] = useState(100);
  const [bust, setBust] = useState(false);
  const [bet, setBet] = useState<any>("");
  const [betError, setBetError] = useState<string>("");
  const [deck, setDeck] = useState(new Deck());
  const [play, setPlay] = useState(false);
  const [deckQuantity, setDeckQuantity] = useState(deck.getDeckQuantity());

  function handleInputBet(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value === "") {
      setBet(0);
      return;
    }

    // Otherwise, parse the input as a number
    const parsedValue = parseFloat(value);

    // Only update bet if it's a valid number
    if (!isNaN(parsedValue)) {
      setBet(parsedValue);
      setBetError("");
    }
  }

  function handleSubmitBet() {
    const betAmount = parseFloat(bet);

    // Validate the bet
    if (betAmount > balance) {
      setBetError("Insufficient Balance");
      return;
    } else if (isNaN(betAmount) || betAmount <= 0) {
      setBetError("Invalid Bet!");
      return;
    }

    // Deduct bet from balance and clear errors
    setBalance(balance - betAmount);
    setBetError("");

    // Reset deck if quantity is low
    if (deckQuantity < 10) {
      deck.reset();
    }

    // Deal initial hands
    const playerStartingHand = deck.deal(2);
    const dealerStartingHand = deck.deal(2);
    setPlayerHand(playerStartingHand);
    setDealerHand(dealerStartingHand);
    setDeckQuantity(deck.getDeckQuantity());

    // Clear game state for a new round
    setGameDecision("");
    setDecision("");
    setBust(false);
    setPlay(true);

    // Check for immediate Blackjack for player
    const playerHandValue = getHandValue(playerStartingHand);
    if (playerHandValue === 21) {
      setDecision("stand");
      setGameDecision("Blackjack! You win!");
      setBalance((prevBalance) => prevBalance + betAmount * 2.5);
      setPlay(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-2 justify-center items-center">
        <div>
          <h1 className="text-4xl font-semibold">Blackjack</h1>
        </div>

        <DeckQuantity deckQuantity={deckQuantity} />
      </div>

      <Hands
        dealerHand={dealerHand}
        playerHand={playerHand}
        decision={decision}
        play={play}
      />

      <div className="whitespace-pre-line text-center font-semibold">
        {gameDecision}
      </div>

      <GameButtons
        dealerHand={dealerHand}
        playerHand={playerHand}
        decision={decision}
        play={play}
        gameDecision={gameDecision}
        deck={deck}
        balance={balance}
        bet={bet}
        setDealerHand={setDealerHand}
        setPlayerHand={setPlayerHand}
        setDecision={setDecision}
        setPlay={setPlay}
        setDeck={setDeck}
        setBet={setBet}
        setBetError={setBetError}
        setGameDecision={setGameDecision}
        setBalance={setBalance}
        setBust={setBust}
        setDeckQuantity={setDeckQuantity}
      />

      <div className={play ? "hidden" : ""}>
        <input
          type="text"
          onChange={handleInputBet}
          disabled={play}
          value={bet}
        />
        <button
          onClick={handleSubmitBet}
          disabled={play}
          className="border border-black bg-slate-50 rounded-md w-24 ml-3 font-semibold"
        >
          Place Bet
        </button>
        <div>{betError}</div>
      </div>
      <div>
        <p>Current Balance: {balance}</p>
      </div>
    </div>
  );
}
