import { getHandValue, getStrHand } from "../../utils";
import { ICard } from "../../types";

interface HandsProps {
  dealerHand: ICard[];
  playerHand: ICard[];
  decision: string;
  play: boolean;
}
export default function Hands({
  dealerHand,
  playerHand,
  decision,
  play,
}: HandsProps) {
  return (
    <div className="mr-20">
      <div className="mb-5 mt-20 flex flex-col items-center justify-center gap-20">
        <div>
          <div className="relative inline-block perspective">
            {decision === "stand" ? (
              dealerHand.map((card, index) => (
                <div
                  key={`${card.getName()}-${card.value}-${card.suit}-${index}`}
                  className="absolute bg-white text-black p-2 w-12 h-20 items-start shadow-lg rounded border border-black -bottom-16"
                  style={{
                    transform: `rotate(${
                      index * 10 - dealerHand.length * 3
                    }deg)`,
                    left: `${index * 1.3}rem`,
                  }}
                >
                  <span className="absolute top-4 right-7">
                    {card.value === 1 ? "A" : card.value}
                  </span>
                  <span
                    className={
                      card.suit === "♥" || card.suit === "♦"
                        ? "absolute bottom-14 text-red-600"
                        : "absolute bottom-14 text-black"
                    }
                  >
                    {card.suit}
                  </span>
                </div>
              ))
            ) : (
              <>
                {/* First card: face-up (only if it exists) */}
                {dealerHand[0] && (
                  <div
                    className="animate-deal absolute bg-white text-black p-2 w-12 h-20 items-start rounded border border-black shadow-lg"
                    style={{
                      transform: `rotate(-5deg)`,
                      left: "0rem",
                    }}
                  >
                    <span className="absolute top-4 right-7">
                      {dealerHand[0].value === 1 ? "A" : dealerHand[0].value}
                    </span>
                    <span
                      className={
                        dealerHand[0].suit === "♥" || dealerHand[0].suit === "♦"
                          ? "absolute bottom-14 text-red-600"
                          : "absolute bottom-14 text-black"
                      }
                    >
                      {dealerHand[0].suit}
                    </span>
                  </div>
                )}

                {/* Second card: back of the card (only if it exists) */}
                {dealerHand[1] && (
                  <div
                    className="animate-deal absolute bg-blue-500 w-12 h-20 shadow-lg flex justify-center items-center rounded border-2 border-black border-double"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #1d4ed8 0, #1d4ed8 10px, #3b82f6 10px, #3b82f6 20px)`,
                      backgroundSize: "cover",
                      transform: `rotate(5deg)`,
                      left: "1.5rem",
                    }}
                  >
                    <div className="bg-white w-6 h-6 rounded-full border border-black flex justify-center items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div
          className={decision === "stand" ? "font-semibold text-xl" : "hidden"}
        >
          Dealer Hand Total: {getHandValue(dealerHand)}
        </div>

        <div>
          <div className="relative inline-block my-10">
            {playerHand.map((card, index) => (
              <div
                key={`${card.getName()}-${card.value}-${card.suit}-${index}`}
                className={
                  decision === "stand"
                    ? "absolute bg-white text-black p-2 w-12 h-20 flex flex-col items-start shadow-lg rounded border border-black animate-deal -bottom-10"
                    : "absolute bg-white text-black p-2 w-12 h-20 flex flex-col items-start shadow-lg rounded border border-black animate-deal"
                }
                style={{
                  transform: `rotate(${index * 10 - playerHand.length * 3}deg)`,
                  left: `${index * 1.3}rem`,
                }}
              >
                <span className="absolute top-4 right-7">
                  {card.value === 1 ? "A" : card.value}
                </span>
                <span
                  className={
                    card.suit === "♥" || card.suit === "♦"
                      ? "absolute bottom-14 text-red-600"
                      : "absolute bottom-14 text-black"
                  }
                >
                  {card.suit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={!play ? "hidden" : "font-semibold text-xl  my-14 ml-20"}>
        <span>Your hand total: {getHandValue(playerHand)}</span>
      </div>

      <div
        className={
          play
            ? "hidden"
            : " ml-16  mb-5 mt-16 flex justify-center items-center"
        }
      >
        <div>
          <h1 className="font-semibold text-2xl ">
            Place Your Bet to start the Game
          </h1>
        </div>
      </div>
    </div>
  );
}
