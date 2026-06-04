import React from 'react';
import { Button } from '../components/Button';
import { ProgressDots } from '../components/ProgressDots';
import { Card } from '../components/Card';
import type { Player } from '../types/game';

interface PlayerPrivacyScreenProps {
  player: Player;
  currentIndex: number;
  totalPlayers: number;
  onReady: () => void;
}

export const PlayerPrivacyScreen: React.FC<PlayerPrivacyScreenProps> = ({ 
  player, 
  currentIndex,
  totalPlayers,
  onReady 
}) => {
  return (
    <div className="flex flex-col items-center justify-between w-full max-w-md mx-auto p-6 min-h-screen text-center relative">
      <div className="absolute top-6 left-6 z-20">
        <ProgressDots current={currentIndex} total={totalPlayers} />
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 fade-in duration-300">
        <Card className="w-full mb-8 shadow-md">
          <p className="text-xl text-gray-500 mb-3 font-medium">Yo phone aba</p>
          <h2 className="text-5xl font-extrabold text-game-primary mb-3 break-all px-2">
            {player.name}
          </h2>
          <p className="text-xl text-gray-500 font-medium">lai dinuhos</p>
        </Card>

        <div className="bg-game-danger/10 border border-game-danger/20 text-game-danger py-3 px-6 rounded-2xl font-medium text-lg flex items-center gap-3 shadow-sm">
          <span className="text-2xl animate-pulse-soft">👀</span>
          <span>Arule nahernuhos</span>
        </div>
      </div>

      <div className="w-full pb-8 pt-4">
        <Button fullWidth size="lg" onClick={onReady} className="shadow-game-primary/25">
          I am {player.name}
        </Button>
      </div>
    </div>
  );
};
