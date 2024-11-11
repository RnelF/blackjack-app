"use client";
import { useState } from "react";
import HandDisplay from "./components/handDisplay";
export default function Home() {
  const [decision, setDecision] = useState("");
  function getDecision(): "hit" | "stand" {
    while (true) {
      if (decision === "stand" || decision === "hit") return decision;
    }
  }
  return (
    <div>
      <div className="flex flex-col justify-center items-center my-28">
        <h1 className="text-5xl font-serif text-">Blackjack</h1>
        <div className="my-10">
          <HandDisplay />
        </div>
      </div>
    </div>
  );
}
