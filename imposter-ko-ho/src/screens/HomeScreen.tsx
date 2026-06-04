import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface HomeScreenProps {
  onStart: () => void;
  onHowToPlay: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onHowToPlay }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 min-h-screen text-center relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-20 -left-10 w-32 h-32 bg-game-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-40 -right-10 w-40 h-40 bg-game-danger/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="flex-1 w-full flex flex-col justify-center items-center z-10 pt-12">
        <div className="relative mb-8">
          <div className="text-8xl animate-float" style={{ animationDuration: '4s' }}>🕵️‍♂️</div>
          <div className="absolute -bottom-2 -right-2 text-4xl bg-white rounded-full shadow-sm">👀</div>
        </div>
        
        <h1 className="text-5xl font-extrabold text-game-primary tracking-tight mb-6 leading-tight">
          Imposter<br/>Ko Ho?
        </h1>
        
        <Card className="w-full mb-12 shadow-md">
          <p className="text-xl font-medium text-gray-700 m-0">
            Word thaha cha? <br/>
            <span className="text-game-danger">Ki guff handai chau?</span>
          </p>
        </Card>
      </div>

      <div className="w-full space-y-4 pb-8 z-10">
        <Button fullWidth size="lg" onClick={onStart} className="text-lg py-5 shadow-game-primary/25">
          Start Game
        </Button>
        <Button fullWidth variant="ghost" onClick={onHowToPlay}>
          How to Play
        </Button>
      </div>
    </div>
  );
};
