import React, { useState } from "react";
import { Player } from "../types";
import { optimizeLineup } from "../utils/optimizer";

interface Props {
  players: Player[];
}

export default function SetLineup({ players }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [optimized, setOptimized] = useState<Player[] | null>(null);

  function togglePlayer(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function runOptimization() {
    const chosen = players.filter((p) => selected.includes(p.id));
    const result = optimizeLineup(chosen);
    setOptimized(result);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-bold">Pick Players</h2>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => togglePlayer(player.id)}
            className={`p-3 border rounded ${
              selected.includes(player.id)
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>

      <button
        onClick={runOptimization}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        Optimize & Set Lineup
      </button>

      {optimized && (
        <div>
          <h3 className="text-lg font-bold mb-2">Optimized Lineup</h3>
          <ul className="list-disc ml-6">
            {optimized.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
