import { useState, useEffect } from 'react';
import type { GameState, Screen, Player } from './types/game';
import { CATEGORIES } from './data/categories';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { HowToPlay } from './screens/HowToPlay';
import { PlayerSetup } from './screens/PlayerSetup';
import { CategorySelection } from './screens/CategorySelection';
import { ReadyScreen } from './screens/ReadyScreen';
import { PlayerPrivacyScreen } from './screens/PlayerPrivacyScreen';
import { RevealScreen } from './screens/RevealScreen';
import { RoundStartScreen } from './screens/RoundStartScreen';

const loadSavedPlayers = (): Player[] => {
  try {
    const saved = localStorage.getItem('imposterPlayers');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
};

const INITIAL_STATE: GameState = {
  players: loadSavedPlayers(),
  selectedCategoryIds: [],
  currentScreen: 'HOME',
  imposterHintEnabled: false,
  shuffledPlayers: [],
  currentPlayerIndex: 0,
  imposterId: null,
  selectedWord: null,
  selectedHint: null,
  firstGuesserId: null,
  guessDirection: null,
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem('imposterPlayers', JSON.stringify(state.players));
  }, [state.players]);

  const endGame = () => {
    updateState({ currentScreen: 'HOME' });
  };

  const updateState = (updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const navigateTo = (screen: Screen) => {
    updateState({ currentScreen: screen });
  };

  const startGameLogic = () => {
    if (state.players.length < 3 || state.selectedCategoryIds.length === 0) return;

    const categories = CATEGORIES.filter(c => state.selectedCategoryIds.includes(c.id));
    const allWords = categories.flatMap(c => c.words);
    if (allWords.length === 0) return;

    // 1. Shuffle players
    const shuffledPlayers = shuffleArray(state.players);

    // 2. Pick random imposter
    const imposterIndex = Math.floor(Math.random() * shuffledPlayers.length);
    const imposterId = shuffledPlayers[imposterIndex].id;

    // 3. Pick random word
    const wordIndex = Math.floor(Math.random() * allWords.length);
    const selectedWordObj = allWords[wordIndex];

    // 4. Pick starting guesser and direction
    const firstGuesserIndex = Math.floor(Math.random() * shuffledPlayers.length);
    const guessDirection = Math.random() > 0.5 ? 'left' : 'right';

    updateState({
      shuffledPlayers,
      imposterId,
      selectedWord: selectedWordObj.word,
      selectedHint: selectedWordObj.hint,
      firstGuesserId: shuffledPlayers[firstGuesserIndex].id,
      guessDirection,
      currentPlayerIndex: 0,
      currentScreen: 'PLAYER_PRIVACY'
    });
  };

  const nextPlayer = () => {
    if (state.currentPlayerIndex < state.shuffledPlayers.length - 1) {
      updateState({
        currentPlayerIndex: state.currentPlayerIndex + 1,
        currentScreen: 'PLAYER_PRIVACY'
      });
    } else {
      // Everyone has seen their card
      navigateTo('ROUND_START');
    }
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'HOME':
        return (
          <HomeScreen 
            onStart={() => navigateTo('PLAYER_SETUP')}
            onHowToPlay={() => navigateTo('HOW_TO_PLAY')}
          />
        );
      
      case 'HOW_TO_PLAY':
        return <HowToPlay onBack={() => navigateTo('HOME')} />;
      
      case 'PLAYER_SETUP':
        return (
          <PlayerSetup 
            players={state.players}
            imposterHintEnabled={state.imposterHintEnabled}
            setPlayers={(players) => updateState({ players })}
            onToggleHint={() => updateState({ imposterHintEnabled: !state.imposterHintEnabled })}
            onContinue={() => navigateTo('CATEGORY_SELECTION')}
            onBack={() => navigateTo('HOME')}
          />
        );
      
      case 'CATEGORY_SELECTION':
        return (
          <CategorySelection 
            selectedCategoryIds={state.selectedCategoryIds}
            onSelectCategory={(id) => {
              const ids = state.selectedCategoryIds.includes(id) 
                ? state.selectedCategoryIds.filter(x => x !== id) 
                : [...state.selectedCategoryIds, id];
              updateState({ selectedCategoryIds: ids });
            }}
            onContinue={() => navigateTo('READY')}
            onBack={() => navigateTo('PLAYER_SETUP')}
          />
        );

      case 'READY':
        return (
          <ReadyScreen 
            playerCount={state.players.length}
            categoryIds={state.selectedCategoryIds}
            imposterHintEnabled={state.imposterHintEnabled}
            onStart={startGameLogic}
            onBack={() => navigateTo('CATEGORY_SELECTION')}
          />
        );

      case 'PLAYER_PRIVACY':
        return (
          <PlayerPrivacyScreen 
            player={state.shuffledPlayers[state.currentPlayerIndex]}
            currentIndex={state.currentPlayerIndex}
            totalPlayers={state.players.length}
            onReady={() => navigateTo('REVEAL')}
          />
        );

      case 'REVEAL':
        const currentPlayer = state.shuffledPlayers[state.currentPlayerIndex];
        return (
          <RevealScreen 
            player={currentPlayer}
            isImposter={currentPlayer.id === state.imposterId}
            word={state.selectedWord!}
            hint={state.selectedHint!}
            imposterHintEnabled={state.imposterHintEnabled}
            currentIndex={state.currentPlayerIndex}
            totalPlayers={state.players.length}
            onDone={nextPlayer}
          />
        );

      case 'ROUND_START':
        const firstGuesser = state.players.find(p => p.id === state.firstGuesserId);
        return (
          <RoundStartScreen 
            firstGuesser={firstGuesser!}
            guessDirection={state.guessDirection!}
            onPlayAgain={startGameLogic}
            onChangeCategory={() => navigateTo('CATEGORY_SELECTION')}
            onNewPlayers={() => {
              updateState({ selectedCategoryIds: [] });
              navigateTo('PLAYER_SETUP');
            }}
          />
        );

      default:
        return <HomeScreen onStart={() => navigateTo('PLAYER_SETUP')} onHowToPlay={() => navigateTo('HOW_TO_PLAY')} />;
    }
  };

  const isGameActive = state.currentScreen === 'PLAYER_PRIVACY' || state.currentScreen === 'REVEAL';

  return (
    <main className="w-full min-h-screen bg-game-bg relative">
      {isGameActive && (
        <button 
          onClick={endGame}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-500 hover:text-game-danger hover:bg-red-50 z-50 border border-gray-200"
          aria-label="End Game"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      )}
      {renderScreen()}
    </main>
  );
}

export default App;
