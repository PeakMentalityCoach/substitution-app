import React, { useState } from 'react';
import { Player, PlayerPosition, POSITIONS } from '../types';
import { optimizePositions, calculateLineupScore } from '../utils/optimizer';

interface SubstitutionPanelProps {
  lineup: PlayerPosition[];
  bench: string[];
  players: Player[];
  onSubstitute: (newLineup: PlayerPosition[], newBench: string[]) => void;
}

export const SubstitutionPanel: React.FC<SubstitutionPanelProps> = ({
  lineup,
  bench,
  players,
  onSubstitute
}) => {
  const [playerOut, setPlayerOut] = useState<string>('');
  const [playerIn, setPlayerIn] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewLineup, setPreviewLineup] = useState<PlayerPosition[]>([]);

  const playersOnPitch = lineup.map(l => players.find(p => p.id === l.playerId)!).filter(Boolean);
  const playersOnBench = bench.map(id => players.find(p => p.id === id)!).filter(Boolean);

  const handlePreview = () => {
    if (!playerOut || !playerIn) {
      alert('Please select both players');
      return;
    }

    const updatedPlayers = playersOnPitch
      .filter(p => p.id !== playerOut)
      .concat(players.find(p => p.id === playerIn)!);

    const newLineup = optimizePositions(updatedPlayers, [...POSITIONS]);

    setPreviewLineup(newLineup);
    setShowPreview(true);
  };

  const handleConfirmSubstitution = () => {
    if (!playerOut || !playerIn || previewLineup.length === 0) return;

    const newBench = bench
      .filter(id => id !== playerIn)
      .concat(playerOut);

    onSubstitute(previewLineup, newBench);

    setPlayerOut('');
    setPlayerIn('');
    setShowPreview(false);
    setPreviewLineup([]);
  };

  const handleCancel = () => {
    setShowPreview(false);
    setPreviewLineup([]);
  };

  const getPlayerPosition = (playerId: string): string | null => {
    const assignment = lineup.find(l => l.playerId === playerId);
    return assignment ? assignment.position : null;
  };

  const getPlayerInfo = (playerId: string) => {
    return players.find(p => p.id === playerId);
  };

  const currentScore = calculateLineupScore(lineup, players);
  const previewScore = showPreview ? calculateLineupScore(previewLineup, players) : 0;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* CONTENT OMITTED — IDENTICAL TO YOUR FILE */}
      {/* ... */}
      {/* ... */}
    </div>
  );
};

export { SubstitutionPanel };
