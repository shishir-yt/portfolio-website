import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ProgressDots } from '../components/ProgressDots';
import type { Player } from '../types/game';

interface RevealScreenProps {
  player: Player;
  isImposter: boolean;
  word: string;
  hint: string;
  imposterHintEnabled: boolean;
  currentIndex: number;
  totalPlayers: number;
  onDone: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({
  player,
  isImposter,
  word,
  hint,
  imposterHintEnabled,
  currentIndex,
  totalPlayers,
  onDone
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsRevealed(true);
  };

  const handlePointerUp = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsRevealed(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 min-h-screen relative overflow-hidden">
      <div className="absolute top-6 left-6 z-20">
        <ProgressDots current={currentIndex} total={totalPlayers} />
      </div>

      {/* Dynamic background shapes based on state */}
      {isRevealed && isImposter && (
        <div className="absolute inset-0 z-0 bg-game-danger/5 animate-in fade-in duration-300" />
      )}
      {isRevealed && !isImposter && (
        <div className="absolute inset-0 z-0 bg-game-primary/5 animate-in fade-in duration-300" />
      )}

      <div className="flex-1 w-full flex flex-col justify-center items-center z-10">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full mb-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-game-text m-0">
            {player.name}'s Card
          </h2>
        </div>

        <div 
          className={`w-full aspect-[4/5] max-w-[320px] rounded-[2.5rem] shadow-lg border-2 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer select-none relative overflow-hidden ${
            isRevealed 
              ? isImposter 
                ? 'bg-white border-game-danger shadow-game-danger/20 scale-105' 
                : 'bg-white border-game-primary shadow-game-primary/20 scale-105'
              : 'bg-white border-gray-200 hover:border-gray-300 shadow-md active:scale-95'
          }`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          style={{ touchAction: 'none', WebkitTapHighlightColor: 'transparent' }}
        >
          {/* Subtle background pattern when revealed */}
          {isRevealed && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          )}

          {!isRevealed ? (
            <div className="flex flex-col items-center animate-in fade-in duration-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner border border-gray-100 animate-pulse-soft">
                👆
              </div>
              <h3 className="text-2xl font-bold text-game-text m-0">Hold to reveal</h3>
            </div>
          ) : isImposter ? (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 z-10 w-full">
              <div className="text-6xl mb-4 animate-float" style={{ animationDuration: '3s' }}>👀</div>
              <h3 className="text-3xl font-extrabold text-game-danger mb-4">You are the Imposter</h3>
              
              {imposterHintEnabled ? (
                <div className="w-full mt-2">
                  <div className="bg-game-danger/5 border border-game-danger/20 p-4 rounded-2xl mb-3 shadow-sm">
                    <p className="text-xs font-bold text-game-danger uppercase tracking-wider mb-1">Hint</p>
                    <p className="text-base text-game-text font-semibold">{hint}</p>
                  </div>
                  <p className="text-sm text-gray-500 font-medium px-2">Use this carefully. Don't make it obvious.</p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl mt-2 w-full">
                  <p className="text-lg text-game-text font-semibold m-0">Blend in. Try to guess the word.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 z-10 w-full h-full">
              <h3 className="text-5xl font-extrabold text-game-primary mb-8 break-words px-2 leading-tight">{word}</h3>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl w-full">
                <p className="text-gray-600 font-medium m-0 text-sm">Yo shabda yaad garnuhos</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full pb-8 z-10 pt-6">
        <Button 
          fullWidth 
          size="lg" 
          onClick={onDone}
          className="shadow-md"
        >
          Done, pass phone
        </Button>
      </div>
    </div>
  );
};
