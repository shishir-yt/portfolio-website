import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface HowToPlayProps {
  onBack: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 min-h-screen">
      <div className="flex-1 w-full flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-6 text-center">How to Play</h2>
        
        <Card className="space-y-4 text-left">
          <ol className="list-decimal pl-5 space-y-3 text-lg">
            <li>Player names halnuhos.</li>
            <li>Category choose garnuhos.</li>
            <li>Phone pass gardai aafno card hernuhos.</li>
            <li>Sabai le herisakepachi phone side ma rakhnuhos.</li>
            <li>Offline hint, discussion, ani voting garnuhos.</li>
          </ol>
        </Card>
      </div>

      <div className="w-full pb-8">
        <Button fullWidth size="lg" onClick={onBack}>
          Got it
        </Button>
      </div>
    </div>
  );
};
