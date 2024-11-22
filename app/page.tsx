"use client";
import DeckQuantity from "./components/deck-quantity/DeckQuantity";
import GameButtons from "./components/game-buttons/GameButtons";
import Hands from "./components/hands/Hands";
import Betting from "./components/input-bet/Betting";
import Deck from "./deck";
import { ICard } from "./types";
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
  const [initialPlay, setInitialPlay] = useState(true);

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
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
        setInitialPlay={setInitialPlay}
      />

      <Betting
        play={play}
        deck={deck}
        balance={balance}
        bet={bet}
        betError={betError}
        deckQuantity={deckQuantity}
        setDealerHand={setDealerHand}
        setPlayerHand={setPlayerHand}
        setDecision={setDecision}
        setPlay={setPlay}
        setBet={setBet}
        setBetError={setBetError}
        setGameDecision={setGameDecision}
        setBalance={setBalance}
        setBust={setBust}
        setDeckQuantity={setDeckQuantity}
        setInitialPlay={setInitialPlay}
      />
      <div>
        <p>Current Balance: {balance}</p>
      </div>
    </div>
  );
}
