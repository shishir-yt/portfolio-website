import React from 'react';
import type { Player } from '../types/game';
import { PlayerChip } from './PlayerChip';

interface PlayerListProps {
  players: Player[];
  onRemove: (id: string) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, onRemove }) => {
  if (players.length === 0) return null;

  return (
    <ul className="w-full flex flex-col gap-3 mt-4 p-0 m-0 list-none">
      {players.map((player, index) => (
        <li 
          key={player.id}
          className="animate-in slide-in-from-bottom-2 fade-in duration-300 fill-mode-both"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <PlayerChip 
            name={player.name} 
            onRemove={() => onRemove(player.id)} 
            index={index}
          />
        </li>
      ))}
    </ul>
  );
};
