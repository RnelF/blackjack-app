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
  const [finalDealerHand, setFinalDealerHand] = useState<number>(0);
  const [dealerHandDisplay, setDealerHandDisplay] = useState("");
  const [gameDecision, setGameDecision] = useState("");
  const [balance, setBalance] = useState(100);
  const [bust, setBust] = useState(false);
  const [bet, setBet] = useState<number>(0);
  const [betError, setBetError] = useState<string>("");
  const [deck, setDeck] = useState(new Deck());

  function playerTurn(playerCards: ICard[], deck: Deck) {
    let handValue = getHandValue(playerCards);

    setPlayerHand(playerCards);
    if (handValue > finalDealerHand) {
      setBalance(balance + bet * 2);
      setGameDecision(
        `You Win! Your Hand ${getStrHand(playerHand)} Total ${getHandValue(
          playerHand
        )} , Dealer Hand: ${getStrHand(dealerHand)} Total ${getHandValue(
          dealerHand
        )}`
      );
    } else if (handValue < finalDealerHand) {
      setGameDecision(
        `You Lost! Your Hand ${getStrHand(playerHand)} Total ${getHandValue(
          playerHand
        )} , Dealer Hand: ${getStrHand(dealerHand)} Total ${getHandValue(
          dealerHand
        )}`
      );
    } else if (handValue === finalDealerHand) {
      setGameDecision(
        `Push/Tie! Your Hand ${getStrHand(playerHand)} Total ${getHandValue(
          playerHand
        )} , Dealer Hand: ${getStrHand(dealerHand)} Total ${getHandValue(
          dealerHand
        )}`
      );
    }
    resetGame();

    if (handValue > 21) {
      setGameDecision(
        `Your hand: ${getStrHand(playerHand)} (Total: ${handValue}) \n Busted!`
      );
      setBalance(balance - bet);
      setBust(true);
      resetGame();
    }

    if (finalDealerHand > 21) {
      setBalance(balance + bet * 2);
      setGameDecision(`You win! Dealer Busted!`);
      resetGame();
    }
  }

  function playerHit(playerCards: ICard[], deck: Deck) {
    playerCards.push(deck.deal(1)[0]);
    setPlayerHand(playerCards);
  }

  function dealPlayer(playerHand: ICard[], deck: Deck) {
    let handValue = getHandValue(playerHand);
    playerHand = deck.deal(2);
    setPlayerHand(playerHand);
    playerTurn(playerHand, deck);
    if (handValue === 21) {
      setBalance(bet * 2.5);
      setGameDecision(`Blackjack! you Won $${bet * 2.5}`);
      resetGame();
    }
  }

  function dealDealer(dealerHand: ICard[], deck: Deck) {
    let handValue = getHandValue(dealerHand);
    dealerHand = deck.deal(2);
    setDealerHand(dealerHand);
    playerTurn(dealerHand, deck);
    if (handValue === 21) {
      setGameDecision(`Dealer has Blackjack! you Lost`);
      resetGame();
    }
    setDealerHand(dealerHand);
  }

  function dealerTurn(dealerHand: ICard[], deck: Deck) {
    let handValue = getHandValue(dealerHand);

    if (handValue < 17) {
      dealerHand.push(deck.deal(1)[0]);
      setFinalDealerHand(getHandValue(dealerHand));
    }
  }

  function handleInputBet(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(event.target.value);
    setBet(isNaN(value) ? 0 : value);
    setBetError("");
  }

  function handleSubmitBet() {
    if (bet > balance) {
      setBetError("Insufficient Balance");
    } else if (bet <= 0) {
      setBetError("Invalid Bet!");
    } else {
      setBalance(balance - bet);
      dealDealer(playerHand, deck);
      dealPlayer(dealerHand, deck);
      setGameDecision("");
    }
  }

  function resetGame() {
    setDeck(new Deck());
    setPlayerHand([]);
    setDealerHand([]);
    setBet(0);
    setDecision("");
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

      <div>
        <button
          onClick={() => {
            setDecision("hit");
            playerHit(playerHand, deck);
          }}
          disabled={bet <= 0}
          className={bet > 0 ? "enabled-button-class" : "disabled-button-class"}
        >
          Hit
        </button>
        <button
          onClick={() => {
            setDecision("stand");
            playerTurn(playerHand, deck);
            dealerTurn(dealerHand, deck);
          }}
          disabled={bet <= 0}
          className={bet > 0 ? "enabled-button-class" : "disabled-button-class"}
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
