import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RulesModal from './components/RulesModal';
import LobbyScreen from './components/LobbyScreen';
import PassPhoneScreen from './components/PassPhoneScreen';
import ArenaScreen from './components/ArenaScreen';
import ResultModal from './components/ResultModal';
import CustomPackModal from './components/CustomPackModal';
import FIRReportModal from './components/FIRReportModal';
import { CATEGORIES, CHAOS_MODIFIERS } from './data/words';
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

  // Custom Categories from localStorage
  const [customPacks, setCustomPacks] = useState(() => {
    try {
      const saved = localStorage.getItem('whoissus_custom_packs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allCategories = [...CATEGORIES, ...customPacks];
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [imposterCount, setImposterCount] = useState(1);

  // Advanced Game Mode Toggles
  const [undercoverEnabled, setUndercoverEnabled] = useState(false);
  const [chaosEnabled, setChaosEnabled] = useState(false);

  // App UI state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [customPackModalOpen, setCustomPackModalOpen] = useState(false);
  const [firModalOpen, setFirModalOpen] = useState(false);

  // Active Round State
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [secretWordData, setSecretWordData] = useState(null);
  const [imposterIndices, setImposterIndices] = useState([]);
  const [undercoverIndex, setUndercoverIndex] = useState(null);
  const [activeChaosModifier, setActiveChaosModifier] = useState(null);
  const [accusedPlayer, setAccusedPlayer] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const handleSaveCustomPack = (newPack) => {
    const updated = [...customPacks, newPack];
    setCustomPacks(updated);
    try {
      localStorage.setItem('whoissus_custom_packs', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
    setSelectedCategory(newPack);
  };

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

    // 3. Pick Undercover player (if enabled and players >= 4)
    let chosenUndercover = null;
    if (undercoverEnabled && availableIndices.length > 0) {
      const randUndercoverIdx = Math.floor(Math.random() * availableIndices.length);
      chosenUndercover = availableIndices[randUndercoverIdx];
      availableIndices.splice(randUndercoverIdx, 1);
    }

    // 4. Pick Chaos Modifier (if enabled)
    let modifier = null;
    if (chaosEnabled) {
      modifier = CHAOS_MODIFIERS[Math.floor(Math.random() * CHAOS_MODIFIERS.length)];
    }

    setSecretWordData({
      word: randomWordObj.word,
      hint: randomWordObj.hint,
      decoys: randomWordObj.decoys,
      undercoverWord: randomWordObj.undercoverWord || randomWordObj.word,
      categoryName: selectedCategory.name,
      categoryEmoji: selectedCategory.emoji
    });
    setImposterIndices(chosenImposters);
    setUndercoverIndex(chosenUndercover);
    setActiveChaosModifier(modifier);

    setCurrentPlayerIndex(0);
    setAccusedPlayer(null);
    setResultModalOpen(false);
    setFirModalOpen(false);

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
    sounds.stopSuspenseBGM();
    setResultModalOpen(false);
    setFirModalOpen(false);
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
            categories={allCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            imposterCount={imposterCount}
            setImposterCount={setImposterCount}
            undercoverEnabled={undercoverEnabled}
            setUndercoverEnabled={setUndercoverEnabled}
            chaosEnabled={chaosEnabled}
            setChaosEnabled={setChaosEnabled}
            onOpenCustomPack={() => setCustomPackModalOpen(true)}
            onStartGame={handleStartGame}
          />
        )}

        {screen === 'PASS_PHONE' && secretWordData && (
          <PassPhoneScreen
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            secretWordData={secretWordData}
            imposterIndices={imposterIndices}
            undercoverIndex={undercoverIndex}
            chaosModifier={activeChaosModifier}
            onNextPlayer={handleNextPlayer}
            onFinishPassRound={handleFinishPassRound}
          />
        )}

        {screen === 'ARENA' && secretWordData && (
          <ArenaScreen
            players={players}
            secretWordData={secretWordData}
            imposterIndices={imposterIndices}
            undercoverIndex={undercoverIndex}
            chaosModifier={activeChaosModifier}
            onRevealImposter={handleRevealImposter}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {/* Rules Modal */}
        <RulesModal
          isOpen={rulesOpen}
          onClose={() => setRulesOpen(false)}
        />

        {/* Custom Pack Creator Modal */}
        <CustomPackModal
          isOpen={customPackModalOpen}
          onClose={() => setCustomPackModalOpen(false)}
          onSave={handleSaveCustomPack}
        />

        {/* Verdict & The Sus's Last Stand Modal */}
        <ResultModal
          isOpen={resultModalOpen}
          accusedPlayer={accusedPlayer}
          players={players}
          imposterIndices={imposterIndices}
          undercoverIndex={undercoverIndex}
          secretWordData={secretWordData}
          onPlayAgain={handlePlayAgain}
          onBackToLobby={handleBackToLobby}
          onOpenFIR={() => setFirModalOpen(true)}
        />

        {/* Social Shareable FIR / Arrest Warrant Modal */}
        <FIRReportModal
          isOpen={firModalOpen}
          onClose={() => setFirModalOpen(false)}
          accusedPlayer={accusedPlayer}
          players={players}
          imposterIndices={imposterIndices}
          secretWordData={secretWordData}
        />
      </div>
    </div>
  );
}
