import React from 'react';

interface PlayerChipProps {
  name: string;
  onRemove?: () => void;
  index?: number;
}

export const PlayerChip: React.FC<PlayerChipProps> = ({ name, onRemove, index = 0 }) => {
  const initial = name.charAt(0).toUpperCase();
  
  // Array of soft background colors for the avatars to give a playful party vibe
  const bgColors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700'
  ];
  const avatarColor = bgColors[index % bgColors.length];

  return (
    <div className="flex items-center justify-between w-full p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${avatarColor}`}>
          {initial}
        </div>
        <span className="font-semibold text-game-text text-lg">{name}</span>
      </div>
      
      {onRemove && (
        <button
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-game-danger transition-colors focus:outline-none focus:ring-2 focus:ring-game-danger/50"
          aria-label={`Remove ${name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      )}
    </div>
  );
};
