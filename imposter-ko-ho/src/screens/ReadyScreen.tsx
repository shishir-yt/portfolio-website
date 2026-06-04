import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { CATEGORIES } from '../data/categories';

interface ReadyScreenProps {
  playerCount: number;
  categoryIds: string[];
  imposterHintEnabled: boolean;
  onStart: () => void;
  onBack: () => void;
}

export const ReadyScreen: React.FC<ReadyScreenProps> = ({ 
  playerCount, 
  categoryIds, 
  imposterHintEnabled,
  onStart,
  onBack
}) => {
  const selectedCategories = CATEGORIES.filter(c => categoryIds.includes(c.id));
  const categoryText = selectedCategories.length === 1 
    ? selectedCategories[0].name 
    : `${selectedCategories.length} Categories`;
  const categoryIcon = selectedCategories.length === 1
    ? selectedCategories[0].icon
    : '📚';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 min-h-screen text-center">
      <div className="flex-1 w-full flex flex-col justify-center items-center">
        <div className="text-6xl mb-6 animate-float" style={{ animationDuration: '4s' }}>🚀</div>
        <h2 className="text-4xl font-extrabold text-game-text mb-8">Ready to start?</h2>
        
        <Card className="w-full mb-8 flex flex-col items-center gap-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Game Settings</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="neutral" icon="👥">
              {playerCount} Players
            </Badge>
            <Badge variant="primary" icon={categoryIcon}>
              {categoryText}
            </Badge>
            {imposterHintEnabled ? (
              <Badge variant="danger" icon="💡">Hint On</Badge>
            ) : (
              <Badge variant="neutral" icon="🔒">Hint Off</Badge>
            )}
          </div>
        </Card>
      </div>

      <div className="w-full space-y-4 pb-8">
        <Button fullWidth size="lg" onClick={onStart}>
          Start Passing
        </Button>
        <Button fullWidth variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
};
