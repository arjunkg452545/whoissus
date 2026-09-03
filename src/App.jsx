import React, { useState } from 'react';
import Header from './components/Header';
import RulesModal from './components/RulesModal';
import LobbyScreen from './components/LobbyScreen';
import PassPhoneScreen from './components/PassPhoneScreen';
import ArenaScreen from './components/ArenaScreen';
import ResultModal from './components/ResultModal';
import { CATEGORIES } from './data/words';
import { sounds } from './utils/sound';

export default function App() {
  // Screen state: 'LOBBY' | 'PASS_PHONE' | 'ARENA'
  const [screen, setScreen] = useState('LOBBY');

  // Game configuration
  const [players, setPlayers] = useState([
    { id: '1', name: 'Andy', emoji: '🍕', bgColor: 'bg-[#fef08a]' },
    { id: '2', name: 'Sarah', emoji: '⚡', bgColor: 'bg-[#ffb1c4]' },
    { id: '3', name: 'Kabir', emoji: '🔥', bgColor: 'bg-[#fed7aa]' },
    { id: '4', name: 'Zoya', emoji: '👾', bgColor: 'bg-[#acedff]' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [imposterCount, setImposterCount] = useState(1);

  // App UI state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Active Round State
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [secretWordData, setSecretWordData] = useState(null);
  const [imposterIndices, setImposterIndices] = useState([]);
  const [accusedPlayer, setAccusedPlayer] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  // Setup and launch a round
  const startNewRound = (goToPassPhone = true) => {
    // 1. Pick a random word from the selected category
    const wordsList = selectedCategory.words;
    const randomWordObj = wordsList[Math.floor(Math.random() * wordsList.length)];

    // 2. Pick N random unique imposter indices
    const availableIndices = players.map((_, idx) => idx);
    const chosenImposters = [];
    for (let i = 0; i < imposterCount; i++) {
      if (availableIndices.length === 0) break;
      const randIdx = Math.floor(Math.random() * availableIndices.length);
      chosenImposters.push(availableIndices[randIdx]);
      availableIndices.splice(randIdx, 1);
    }

    setSecretWordData({
      word: randomWordObj.word,
      hint: randomWordObj.hint,
      decoys: randomWordObj.decoys,
      categoryName: selectedCategory.name,
      categoryEmoji: selectedCategory.emoji
    });
    setImposterIndices(chosenImposters);
    setCurrentPlayerIndex(0);
    setAccusedPlayer(null);
    setResultModalOpen(false);

    if (goToPassPhone) {
      setScreen('PASS_PHONE');
    }
  };

  const handleStartGame = () => {
    startNewRound(true);
  };

  const handleNextPlayer = () => {
    setCurrentPlayerIndex(prev => prev + 1);
  };

  const handleFinishPassRound = () => {
    setScreen('ARENA');
  };

  const handleRevealImposter = (player) => {
    setAccusedPlayer(player);
    setResultModalOpen(true);
  };

  const handlePlayAgain = () => {
    startNewRound(true);
  };

  const handleBackToLobby = () => {
    setResultModalOpen(false);
    setScreen('LOBBY');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex justify-center items-start selection:bg-primary-container selection:text-surface-container-lowest">
      {/* Mobile Device Simulation Frame (strictly max-w-[480px]) */}
      <div className="w-full max-w-[480px] min-h-screen bg-surface flex flex-col relative border-x-4 border-surface-container-lowest shadow-2xl">
        {/* Global Header */}
        <Header
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onOpenRules={() => setRulesOpen(true)}
          onResetGame={handleBackToLobby}
          currentScreen={screen}
        />

        {/* Screen Switching */}
        {screen === 'LOBBY' && (
          <LobbyScreen
            players={players}
            setPlayers={setPlayers}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            imposterCount={imposterCount}
            setImposterCount={setImposterCount}
            onStartGame={handleStartGame}
          />
        )}

        {screen === 'PASS_PHONE' && secretWordData && (
          <PassPhoneScreen
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            secretWordData={secretWordData}
            imposterIndices={imposterIndices}
            onNextPlayer={handleNextPlayer}
            onFinishPassRound={handleFinishPassRound}
          />
        )}

        {screen === 'ARENA' && secretWordData && (
          <ArenaScreen
            players={players}
            secretWordData={secretWordData}
            imposterIndices={imposterIndices}
            onRevealImposter={handleRevealImposter}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {/* Rules Modal */}
        <RulesModal
          isOpen={rulesOpen}
          onClose={() => setRulesOpen(false)}
        />

        {/* Verdict & Imposter's Last Stand Modal */}
        <ResultModal
          isOpen={resultModalOpen}
          accusedPlayer={accusedPlayer}
          players={players}
          imposterIndices={imposterIndices}
          secretWordData={secretWordData}
          onPlayAgain={handlePlayAgain}
          onBackToLobby={handleBackToLobby}
        />
      </div>
    </div>
  );
}
