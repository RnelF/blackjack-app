import { ICard } from "@/app/types";
import Deck from "@/app/deck";
import { getHandValue } from "@/app/utils";

interface BettingProps {
  bet: any;
  balance: number;
  deckQuantity: number;
  deck: Deck;
  play: boolean;
  betError: string;
  setBet: React.Dispatch<React.SetStateAction<any>>;
  setBetError: React.Dispatch<React.SetStateAction<string>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setDealerHand: React.Dispatch<React.SetStateAction<ICard[]>>;
  setPlayerHand: React.Dispatch<React.SetStateAction<ICard[]>>;
  setDeckQuantity: React.Dispatch<React.SetStateAction<number>>;
  setDecision: React.Dispatch<React.SetStateAction<string>>;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setBust: React.Dispatch<React.SetStateAction<boolean>>;
  setGameDecision: React.Dispatch<React.SetStateAction<JSX.Element | string>>;
  setInitialPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Betting({
  setBet,
  setBetError,
  bet,
  balance,
  setBalance,
  setPlayerHand,
  setDealerHand,
  deck,
  deckQuantity,
  setDeckQuantity,
  setDecision,
  setBust,
  setPlay,
  setGameDecision,
  setInitialPlay,
  play,
  betError,
}: BettingProps) {
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
    setInitialPlay(true);

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
    <>
      <div className="mt-10">
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
            className="border border-black bg-slate-50 rounded-md w-24 ml-3 font-semibold hover:text-white hover:bg-slate-700 duration-100"
          >
            Place Bet
          </button>
          <div>{betError}</div>
        </div>
      </div>
    </>
  );
}
