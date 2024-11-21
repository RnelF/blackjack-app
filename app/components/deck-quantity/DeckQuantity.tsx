import { useState } from "react";
import Deck from "../../deck";

interface DeckProps {
  deckQuantity: number;
}

export default function DeckQuantity({ deckQuantity }: DeckProps) {
  return (
    <>
      <div>
        <div
          className="absolute bg-blue-500 w-9 h-14 shadow-lg flex justify-center items-center rounded border-2 border-black border-double"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #1d4ed8 0, #1d4ed8 10px, #3b82f6 10px, #3b82f6 20px)`,
            backgroundSize: "cover",
          }}
        >
          <div className=" relativebg-white w-4 h-4 rounded-full border border-black flex justify-center items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full">
              <span className="absolute top-4 left-2 text-sm font-bold text-white">
                {deckQuantity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
