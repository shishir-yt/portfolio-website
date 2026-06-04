export type Screen = 
  | 'HOME' 
  | 'HOW_TO_PLAY' 
  | 'PLAYER_SETUP' 
  | 'CATEGORY_SELECTION' 
  | 'READY' 
  | 'PLAYER_PRIVACY' 
  | 'REVEAL' 
  | 'ROUND_START';

export interface GameWord {
  word: string;
  hint: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  words: GameWord[];
}

export interface Player {
  id: string;
  name: string;
}

export interface GameState {
  players: Player[];
  selectedCategoryIds: string[];
  currentScreen: Screen;
  imposterHintEnabled: boolean;
  
  // Active game state
  shuffledPlayers: Player[];
  currentPlayerIndex: number;
  imposterId: string | null;
  selectedWord: string | null;
  selectedHint: string | null;
  firstGuesserId: string | null;
  guessDirection: 'left' | 'right' | null;
}
