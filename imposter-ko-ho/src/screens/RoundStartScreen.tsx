import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import type { Player } from '../types/game';

interface RoundStartScreenProps {
  firstGuesser: Player;
  guessDirection: 'left' | 'right';
  onPlayAgain: () => void;
  onChangeCategory: () => void;
  onNewPlayers: () => void;
}

export const RoundStartScreen: React.FC<RoundStartScreenProps> = ({
  firstGuesser,
  guessDirection,
  onPlayAgain,
  onChangeCategory,
  onNewPlayers
}) => {
  // Simple CSS confetti array
  const confetti = Array.from({ length: 15 });

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 min-h-screen text-center relative overflow-hidden">
      {/* Confetti Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {confetti.map((_, i) => (
          <div 
            key={i}
            className={`absolute w-3 h-3 rounded-sm animate-confetti ${
              ['bg-game-primary', 'bg-game-danger', 'bg-game-success', 'bg-yellow-400'][i % 4]
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: '-5%',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="flex-1 w-full flex flex-col justify-center items-center z-10 pt-8">
        <div className="text-7xl mb-6 animate-float">🎉</div>
        <h2 className="text-3xl font-extrabold text-game-text text-center px-4 mb-6 leading-tight">
          Aba phone side ma<br/>rakhnuhos.
        </h2>
        
        <Card className="w-full mb-8 flex flex-col items-center gap-5 shadow-md animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-full flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start with</p>
            <Badge variant="primary" className="text-lg px-4 py-1.5" icon="👤">
              {firstGuesser.name}
            </Badge>
          </div>
          
          <div className="w-12 h-px bg-gray-200"></div>
          
          <div className="w-full flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Direction</p>
            <Badge variant="neutral" className="text-lg px-4 py-1.5 capitalize" icon={guessDirection === 'left' ? '⬅️' : '➡️'}>
              Go to the {guessDirection}
            </Badge>
          </div>
        </Card>

        <p className="text-gray-500 font-medium mb-4 bg-white/50 px-4 py-2 rounded-full text-sm">
          Discussion ani voting offline garnuhos.
        </p>
      </div>

      <div className="w-full space-y-3 pb-6 z-10">
        <Button fullWidth size="lg" onClick={onPlayAgain} className="shadow-md">
          Play Again
        </Button>
        <div className="flex gap-3">
          <Button fullWidth variant="secondary" onClick={onChangeCategory}>
            Category
          </Button>
          <Button fullWidth variant="secondary" onClick={onNewPlayers}>
            Players
          </Button>
        </div>
      </div>
    </div>
  );
};
