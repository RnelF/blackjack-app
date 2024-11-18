"use client";
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

  function playerHit() {
    if (gameDecision) return; // Prevent further actions if the game has ended

    const newCard = deck.deal(1)[0];
    const updatedPlayerHand = [...playerHand, newCard];
    setPlayerHand(updatedPlayerHand);

    setDeckQuantity(deck.getDeckQuantity());

    // Check if the player busts after hitting
    const handValue = getHandValue(updatedPlayerHand);
    if (handValue > 21) {
      if (balance === 0) {
        setGameDecision(
          <>
            Busted! <br />
            You ran out of funds! GAME OVER! <br />
            <button
              className="rounded border border-black bg-slate-50 w-16"
              onClick={resetGame}
            >
              Reset
            </button>
            the game if you'd like to play again!
          </>
        );
      } else {
        setGameDecision(
          `Bust! You lost. Your hand: ${getStrHand(
            updatedPlayerHand
          )} (Total: ${handValue})`
        );
        setBalance(balance - bet);
        setBust(true);
        setPlay(false);
      }
    }
  }

  function playerStand() {
    dealerTurn();
  }

  function dealerTurn() {
    let updatedDealerHand = [...dealerHand];

    while (getHandValue(updatedDealerHand) < 17) {
      updatedDealerHand.push(deck.deal(1)[0]);
      setDealerHand([...updatedDealerHand]);

      setDeckQuantity(deck.getDeckQuantity());
    }

    // Check the game outcome after the dealer finishes their turn
    const dealerValue = getHandValue(updatedDealerHand);
    const playerValue = getHandValue(playerHand);

    if (dealerValue === 21) {
      if (balance === 0) {
        setGameDecision(
          <>
            Your hand Total: {getHandValue(playerHand)} <br />
            Dealer hand Total: {getHandValue(dealerHand)} <br />
            You Lose! <br />
            You ran out of funds! GAME OVER! <br />
            <button
              className="rounded border border-black bg-slate-50 w-16"
              onClick={resetGame}
            >
              Reset
            </button>
            the game if you'd like to play again!
          </>
        );
        setPlay(false);
      } else {
        setGameDecision(`Dealer Blackjack! You Lose!`);
        setPlay(false);
      }
    } else if (dealerValue > 21) {
      setGameDecision(`Dealer Busts! You win!`);
      setBalance(balance + bet * 2);
      setPlay(false);
    } else if (playerValue > dealerValue) {
      setGameDecision(
        `You Win! Your Hand: ${getStrHand(
          playerHand
        )} Total: ${playerValue}, Dealer Hand: ${getStrHand(
          updatedDealerHand
        )} Total: ${dealerValue}`
      );
      setBalance(balance + bet * 2);
      setPlay(false);
    } else if (playerValue < dealerValue) {
      if (balance === 0) {
        setGameDecision(
          <>
            Your hand Total: {getHandValue(playerHand)} <br />
            Dealer hand Total: {getHandValue(dealerHand)} <br />
            You Lose! <br />
            You ran out of funds! GAME OVER! <br />
            <button
              className="rounded border border-black bg-slate-50 w-16"
              onClick={resetGame}
            >
              Reset
            </button>
            the game if you'd like to play again!
          </>
        );
        setPlay(false);
      } else {
        setGameDecision(
          `You Lose! Your Hand: ${getStrHand(
            playerHand
          )} Total: ${playerValue}, Dealer Hand: ${getStrHand(
            updatedDealerHand
          )} Total: ${dealerValue}`
        );
        setPlay(false);
      }
    } else {
      setGameDecision(`Push! It's a tie.`);
      setBalance(balance + bet); // Return the bet on a tie
      setPlay(false);
    }
  }

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

  function resetGame() {
    setDeck(new Deck());
    setPlayerHand([]);
    setDealerHand([]);
    setBet(0);
    setBetError("");
    setDecision("");
    setGameDecision("");
    setBalance(100);
    setBust(false);
    setPlay(false);
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div>
        <h1>Blackjack</h1>
        <div>Deck Quantity: {deckQuantity}</div>
      </div>
      <div>
        <div>
          <span>Dealer's Hand: </span>
          <span>
            {decision === "stand"
              ? `${getStrHand(dealerHand)} Total: ${getHandValue(dealerHand)} `
              : getStrHand(dealerHand, true)}
          </span>
        </div>

        <div>
          <span>Your Hand: </span>
          <span>
            {getStrHand(playerHand)} Total: {getHandValue(playerHand)}
          </span>
        </div>
      </div>

      <div className="whitespace-pre-line text-center font-semibold">
        {gameDecision}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            playerHit();
          }}
          disabled={decision === "stand" || !play}
          className="border border-black bg-slate-50 rounded-md w-32"
        >
          Hit
        </button>

        <button
          onClick={() => {
            setDecision("stand");
            playerStand();
          }}
          disabled={decision === "stand" || !play}
          className="border border-black bg-slate-50 rounded-md w-32"
        >
          Stand
        </button>
      </div>
      <div>
        <input type="text" onChange={handleInputBet} value={bet} />
        <button onClick={handleSubmitBet} disabled={play}>
          Place Bet
        </button>
        <div>{betError}</div>
        <div>
          <p>Current Balance: {balance}</p>
        </div>
      </div>
    </div>
  );
}
