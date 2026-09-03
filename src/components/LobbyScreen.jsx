import React, { useState } from 'react';
import { Plus, Trash2, Check, Copy, CheckCheck, Flame, Skull, Sparkles, Sliders, Dices, FolderPlus } from 'lucide-react';
import { CATEGORIES } from '../data/words';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

const FUN_EMOJIS = ["🍕", "⚡", "🔥", "👾", "🎀", "💀", "🎸", "🚀", "🍔", "🏏", "👑", "🌮", "🐱", "🐶"];

const CHIP_BG_COLORS = [
  "bg-[#fef08a]",
  "bg-[#ffb1c4]",
  "bg-[#fed7aa]",
  "bg-[#acedff]",
  "bg-[#fbcfe8]",
  "bg-[#c4c9ac]"
];

export default function LobbyScreen({
  players,
  setPlayers,
  categories,
  selectedCategory,
  setSelectedCategory,
  imposterCount,
  setImposterCount,
  undercoverEnabled,
  setUndercoverEnabled,
  chaosEnabled,
  setChaosEnabled,
  onOpenCustomPack,
  onStartGame
}) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roomCode = "#SUS-9021";

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopiedCode(true);
    sounds.playClick();
    triggerHaptic('light');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddPlayer = (e) => {
    e?.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;

    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage('Player already in lobby!');
      sounds.playBuzzer();
      triggerHaptic('warning');
      return;
    }

    if (players.length >= 12) {
      setErrorMessage('Max 12 players supported!');
      sounds.playBuzzer();
      return;
    }

    const randomEmoji = FUN_EMOJIS[players.length % FUN_EMOJIS.length];
    const newPlayer = {
      id: Date.now().toString(),
      name: trimmed,
      emoji: randomEmoji,
      bgColor: CHIP_BG_COLORS[players.length % CHIP_BG_COLORS.length]
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    setErrorMessage('');
    sounds.playClick();
    triggerHaptic('medium');
  };

  const handleRemovePlayer = (id) => {
    sounds.playClick();
    triggerHaptic('light');
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleSelectCategory = (cat) => {
    sounds.playClick();
    triggerHaptic('light');
    setSelectedCategory(cat);
  };

  const handleToggleImposter = (count) => {
    sounds.playClick();
    triggerHaptic('medium');
    setImposterCount(count);
  };

  const handleToggleUndercover = () => {
    sounds.playClick();
    triggerHaptic('medium');
    setUndercoverEnabled(!undercoverEnabled);
  };

  const handleToggleChaos = () => {
    sounds.playClick();
    triggerHaptic('medium');
    setChaosEnabled(!chaosEnabled);
  };

  const handleLaunch = () => {
    if (players.length < 3) {
      setErrorMessage('Add at least 3 players to start the chaos!');
      sounds.playBuzzer();
      triggerHaptic('warning');
      return;
    }
    if (imposterCount >= players.length) {
      setErrorMessage(`Need at least ${imposterCount + 2} players for ${imposterCount} Sus!`);
      sounds.playBuzzer();
      triggerHaptic('warning');
      return;
    }
    sounds.playVictory();
    triggerHaptic('heavy');
    onStartGame();
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-20 pb-36 space-y-6">
      {/* 1. Room Code Banner & Quick Status */}
      <div className="relative mt-2">
        <div className="bg-surface-container-low brutal-border brutal-shadow rounded-xl p-3 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-container via-secondary-container to-tertiary-fixed-dim"></div>
          <div className="flex flex-col">
            <span className="font-syne text-[10px] font-extrabold uppercase text-outline tracking-widest">
              ROOM CODE
            </span>
            <span className="font-syne text-xl text-tertiary-fixed-dim tracking-wider font-extrabold flex items-center gap-2">
              {roomCode}
              <button
                onClick={handleCopyCode}
                className="p-1 hover:text-white transition-colors"
                title="Copy Room Code"
              >
                {copiedCode ? <CheckCheck className="w-4 h-4 text-primary-container" /> : <Copy className="w-4 h-4" />}
              </button>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171923] brutal-border brutal-shadow-sm font-syne text-[11px] font-extrabold text-primary-container">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
              PASS & PLAY
            </span>
          </div>
        </div>
      </div>

      {/* 2. Player Roster Section */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-primary-container text-on-primary font-syne text-xs font-extrabold uppercase brutal-border brutal-shadow-sm rounded rotate-[-1deg]">
              ROSTER ({players.length} PLAYERS)
            </span>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            3 to 12 Players
          </span>
        </div>

        {/* Player Chips Grid */}
        <div className="grid grid-cols-2 gap-2.5" id="rosterChips">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between px-3 py-2 ${player.bgColor} text-surface-container-lowest brutal-border brutal-shadow-sm rounded-lg transform hover:-translate-y-0.5 transition-transform`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-xl">{player.emoji}</span>
                <span className="font-syne text-[15px] font-bold tracking-tight truncate">
                  {player.name}
                </span>
              </div>
              <button
                onClick={() => handleRemovePlayer(player.id)}
                className="w-6 h-6 shrink-0 rounded-full bg-surface-container-lowest text-white flex items-center justify-center text-xs font-bold hover:bg-error transition-colors leading-none ml-1"
                title={`Remove ${player.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleAddPlayer} className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Add friend's name..."
              maxLength={15}
              className="w-full bg-surface-container-lowest text-on-surface brutal-border rounded-lg px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:border-primary-container focus:ring-0 placeholder:text-outline brutal-shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-tertiary-fixed-dim text-surface-container-lowest brutal-border brutal-shadow-sm brutal-btn px-4 py-2.5 rounded-lg font-syne text-xs uppercase flex items-center gap-1 shrink-0 font-extrabold"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add</span>
          </button>
        </form>

        {errorMessage && (
          <p className="text-secondary-container text-xs font-bold animate-bounce mt-1">
            ⚠️ {errorMessage}
          </p>
        )}
      </section>

      {/* 3. Category Selection Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-syne text-sm font-extrabold uppercase tracking-wide text-primary">
              CHOOSE THE DRAMA 🎯
            </span>
          </div>
          <button
            onClick={onOpenCustomPack}
            className="font-syne text-[11px] font-extrabold bg-primary-container text-on-primary px-2 py-0.5 rounded border border-surface-container-lowest brutal-shadow-sm uppercase flex items-center gap-1 hover:bg-[#b0dc00]"
          >
            <FolderPlus className="w-3.5 h-3.5" /> + CUSTOM PACK
          </button>
        </div>

        {/* Category Cards Bento */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`relative p-3 rounded-xl brutal-border brutal-shadow cursor-pointer transition-all duration-100 ${
                  isSelected
                    ? "bg-surface-container-high ring-4 ring-primary-container -translate-y-0.5"
                    : "bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2.5 -right-2 bg-primary-container text-on-primary text-[10px] font-syne font-extrabold uppercase px-2 py-0.5 rounded brutal-border brutal-shadow-sm rotate-6 flex items-center gap-0.5 z-10">
                    <Check className="w-3 h-3" /> PICKED
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="font-syne text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-surface-container-lowest text-outline">
                      {cat.badge}
                    </span>
                  </div>
                  <h4 className="font-syne font-extrabold text-sm text-primary leading-tight mt-1 truncate">
                    {cat.name}
                  </h4>
                  <p className="text-on-surface-variant text-[11px] leading-snug">
                    {cat.words.length} secret words
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Game Modes & Advanced Party Modifiers */}
      <section className="space-y-3">
        <span className="font-syne text-sm font-extrabold uppercase text-primary flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-primary-container" />
          PARTY SETTINGS & ROLES ⚡
        </span>

        {/* Imposter Count Stepper */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleToggleImposter(1)}
            className={`p-3 rounded-xl brutal-border text-left transition-all ${
              imposterCount === 1
                ? "bg-secondary-container text-white brutal-shadow ring-2 ring-white"
                : "bg-surface-container text-on-surface brutal-shadow-sm hover:bg-surface-container-high"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-syne font-extrabold text-sm">1 SUS 🕵️‍♂️</span>
              {imposterCount === 1 && <Check className="w-4 h-4" />}
            </div>
            <p className="text-[10px] opacity-90 leading-tight">
              Classic Paranoia (3-6 players).
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleToggleImposter(2)}
            className={`p-3 rounded-xl brutal-border text-left transition-all ${
              imposterCount === 2
                ? "bg-secondary-container text-white brutal-shadow ring-2 ring-white"
                : "bg-surface-container text-on-surface brutal-shadow-sm hover:bg-surface-container-high"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-syne font-extrabold text-sm">2 SUS 💀💀</span>
              {imposterCount === 2 && <Check className="w-4 h-4" />}
            </div>
            <p className="text-[10px] opacity-90 leading-tight">
              Double Treason (Best for 6+).
            </p>
          </button>
        </div>

        {/* The Undercover Role Toggle (Aadha Sus) */}
        <div
          onClick={handleToggleUndercover}
          className={`p-3 rounded-xl brutal-border cursor-pointer transition-all flex items-center justify-between ${
            undercoverEnabled
              ? "bg-[#f59e0b]/20 border-[#f59e0b] brutal-shadow"
              : "bg-surface-container brutal-shadow-sm hover:bg-surface-container-high"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎭</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-syne font-extrabold text-sm text-primary uppercase">
                  THE UNDERCOVER (AADHA SUS)
                </h4>
                <span className="text-[9px] bg-[#f59e0b] text-black font-syne font-extrabold px-1.5 py-0.2 rounded">
                  CHAOS!
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                1 player gets a slightly different word (e.g. Pani Puri vs Dahi Puri)!
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 border-surface-container-lowest flex items-center justify-center font-bold text-xs ${
            undercoverEnabled ? "bg-[#f59e0b] text-black" : "bg-surface-container-high text-outline"
          }`}>
            {undercoverEnabled ? "✓" : ""}
          </div>
        </div>

        {/* Chaos Modifiers Toggle */}
        <div
          onClick={handleToggleChaos}
          className={`p-3 rounded-xl brutal-border cursor-pointer transition-all flex items-center justify-between ${
            chaosEnabled
              ? "bg-secondary-container/20 border-secondary-container brutal-shadow"
              : "bg-surface-container brutal-shadow-sm hover:bg-surface-container-high"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎲</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-syne font-extrabold text-sm text-primary uppercase">
                  CHAOS MODIFIER CARDS
                </h4>
                <span className="text-[9px] bg-secondary-container text-white font-syne font-extrabold px-1.5 py-0.2 rounded">
                  NEW
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                Random twist each round (One-Word Trap, Rapid Fire, Mukhbir)!
              </p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 border-surface-container-lowest flex items-center justify-center font-bold text-xs ${
            chaosEnabled ? "bg-secondary-container text-white" : "bg-surface-container-high text-outline"
          }`}>
            {chaosEnabled ? "✓" : ""}
          </div>
        </div>
      </section>

      {/* 5. Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-4 bg-surface/90 backdrop-blur-md border-t-4 border-surface-container-lowest z-40 [box-shadow:0px_-4px_0px_#0d0e12]">
        <button
          onClick={handleLaunch}
          className="w-full py-4 bg-primary-container text-on-primary font-syne text-lg font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn tracking-wider flex items-center justify-center gap-2 hover:bg-[#b0dc00] transition-colors"
        >
          <span>START THE CHAOS</span>
          <span className="text-xl animate-bounce">🚀</span>
        </button>
      </div>
    </div>
  );
}
