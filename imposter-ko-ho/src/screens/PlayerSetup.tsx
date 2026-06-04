import React, { useState } from 'react';
import { Button } from '../components/Button';
import { PlayerList } from '../components/PlayerList';
import type { Player } from '../types/game';

interface PlayerSetupProps {
  players: Player[];
  imposterHintEnabled: boolean;
  setPlayers: (players: Player[]) => void;
  onToggleHint: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({ 
  players, 
  imposterHintEnabled,
  setPlayers, 
  onToggleHint,
  onContinue,
  onBack
}) => {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Name already added');
      return;
    }

    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 9),
      name: trimmedName,
    };

    setPlayers([...players, newPlayer]);
    setNameInput('');
    setError('');
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    setError('');
  };

  const isValid = players.length >= 3;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-6 min-h-screen">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h2 className="text-2xl font-bold m-0">Who's playing?</h2>
        </div>

        <form onSubmit={handleAddPlayer} className="mb-6 relative">
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setError('');
                }}
                placeholder="Enter player name"
                className="w-full h-14 pl-5 pr-20 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-game-primary focus:ring-4 focus:ring-game-primary/10 text-lg transition-all shadow-sm"
              />
              <button 
                type="submit" 
                disabled={!nameInput.trim()}
                className="absolute right-2 h-10 px-4 rounded-xl bg-game-primary text-white font-bold disabled:opacity-50 disabled:bg-gray-300 transition-all active:scale-95"
              >
                Add
              </button>
            </div>
          </div>
          {error && <p className="text-game-danger text-sm mt-2 font-medium ml-2">{error}</p>}
        </form>

        <div className="mt-8 mb-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider pl-1 mb-2">
            Players ({players.length}) {isValid && '- Ready!'}
          </p>
          <PlayerList players={players} onRemove={handleRemovePlayer} />
        </div>

        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 w-full text-left">
          <div>
            <p className="font-bold text-game-text text-lg m-0">Imposter Hint</p>
            <p className="text-sm text-gray-500 m-0">Give the imposter a vague clue</p>
          </div>
          <button 
            onClick={onToggleHint}
            aria-pressed={imposterHintEnabled}
            className={`w-14 h-8 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${imposterHintEnabled ? 'bg-game-primary' : 'bg-gray-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${imposterHintEnabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="w-full pb-8 pt-4 sticky bottom-0 bg-gradient-to-t from-game-bg via-game-bg to-transparent">
        <Button 
          fullWidth 
          size="lg" 
          onClick={onContinue}
          disabled={!isValid}
          className="shadow-md"
        >
          Choose Category
        </Button>
      </div>
    </div>
  );
};
