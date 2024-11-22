import Deck from "../../deck";
import { ICard } from "@/app/types";
import { getHandValue } from "@/app/utils";

interface ChildProps {
  dealerHand: ICard[];
  playerHand: ICard[];
  decision: string;
  gameDecision: JSX.Element | string;
  play: boolean;
  deck: Deck;
  balance: number;
  bet: any;
  setDealerHand: React.Dispatch<React.SetStateAction<ICard[]>>;
  setPlayerHand: React.Dispatch<React.SetStateAction<ICard[]>>;
  setDecision: React.Dispatch<React.SetStateAction<string>>;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setBust: React.Dispatch<React.SetStateAction<boolean>>;
  setDeck: React.Dispatch<React.SetStateAction<Deck>>;
  setBet: React.Dispatch<React.SetStateAction<any>>;
  setBetError: React.Dispatch<React.SetStateAction<string>>;
  setGameDecision: React.Dispatch<React.SetStateAction<JSX.Element | string>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setDeckQuantity: React.Dispatch<React.SetStateAction<number>>;
  setInitialPlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GameButtons({
  dealerHand,
  playerHand,
  decision,
  play,
  gameDecision,
  deck,
  balance,
  bet,
  setDealerHand,
  setPlayerHand,
  setDecision,
  setPlay,
  setDeck,
  setBet,
  setBetError,
  setGameDecision,
  setBalance,
  setBust,
  setDeckQuantity,
  setInitialPlay,
}: ChildProps) {
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
            <span className="text-2xl font-semibold">
              Busted! Hand Total: {getHandValue(updatedPlayerHand)}
            </span>
            <br />
            You ran out of funds! GAME OVER! <br />
            <button
              className="rounded border border-black bg-slate-50 w-14 text-sm hover:text-white hover:bg-slate-700 duration-100"
              onClick={resetGame}
            >
              Reset
            </button>
            <span> the game if you like to play again!</span>
          </>
        );
        setPlay(false);
        setInitialPlay(false);
      } else {
        setGameDecision(
          <>
            <span className="text-2xl font-semibold">
              Bust! You lost. Your hand Total: ${handValue}
            </span>
          </>
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
              className="rounded border border-black bg-slate-50 w-16 text-sm hover:text-white hover:bg-slate-700 duration-100"
              onClick={resetGame}
            >
              Reset
            </button>
            the game if you like to play again!
          </>
        );
        setPlay(false);
        setInitialPlay(false);
      } else {
        setGameDecision(
          <>
            <span className="text-2xl font-semibold">
              Dealer Blackjack! You Lose!
            </span>
          </>
        );
        setPlay(false);
      }
    } else if (dealerValue > 21) {
      setGameDecision(
        <>
          <span className="text-2xl font-semibold">Dealer Busts! You win!</span>
        </>
      );
      setBalance(balance + bet * 2);
      setPlay(false);
    } else if (playerValue > dealerValue) {
      setGameDecision(
        <>
          <span className="text-2xl font-semibold">
            You Win! Your Hand Total: {playerValue}
          </span>
        </>
      );
      setBalance(balance + bet * 2);
      setPlay(false);
    } else if (playerValue < dealerValue) {
      if (balance === 0) {
        setGameDecision(
          <>
            <span className="text-2xl font-semibold">
              You Lose! Your Hand Total: {playerValue}
            </span>{" "}
            <br />
            <span className="text-2xl font-semibold">
              Dealer Hand Total: {dealerValue}
            </span>{" "}
            <br />
            You ran out of funds! GAME OVER! <br />
            <button
              className="rounded border border-black bg-slate-50 w-16  text-sm hover:text-white hover:bg-slate-700 duration-100"
              onClick={resetGame}
            >
              Reset
            </button>
            the game if you like to play again!
          </>
        );
        setPlay(false);
        setInitialPlay(false);
      } else {
        setGameDecision(
          <>
            <span className="text-2xl font-semibold">
              You Lose! Your Hand Total: {playerValue}
            </span>
          </>
        );
        setPlay(false);
      }
    } else if (dealerValue === playerValue) {
      setGameDecision(
        <>
          <span className="text-2xl font-semibold">Push! It's a tie.</span>
        </>
      );
      setBalance(balance + bet); // Return the bet on a tie
      setPlay(false);
    }
  }
  return (
    <div className="-mt-10">
      <div className={!play ? "hidden" : "flex gap-3"}>
        <button
          onClick={() => {
            playerHit();
          }}
          disabled={decision === "stand" || !play}
          className="border border-black bg-slate-50 rounded-md w-32 font-semibold"
        >
          Hit
        </button>

        <button
          onClick={() => {
            setDecision("stand");
            playerStand();
          }}
          disabled={decision === "stand" || !play}
          className="border border-black bg-slate-50 rounded-md w-32 font-semibold"
        >
          Stand
        </button>
      </div>
    </div>
  );
}
