import React from 'react';
import { Volume2, VolumeX, BookOpen, Gamepad2 } from 'lucide-react';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function Header({ soundEnabled, setSoundEnabled, onOpenRules, onResetGame, currentScreen }) {
  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
    if (newState) sounds.playClick();
    triggerHaptic('light');
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-4 py-3 max-w-[480px] mx-auto bg-surface border-b-4 border-surface-container-lowest [box-shadow:0px_4px_0px_#0d0e12]">
      {/* Brand Cluster */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onResetGame}
          title="Home / New Game"
          className="w-10 h-10 rounded-lg brutal-border bg-primary-container flex items-center justify-center brutal-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform"
        >
          <Gamepad2 className="w-5 h-5 text-on-primary" />
        </button>

        <div 
          onClick={onResetGame}
          className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded brutal-border rotate-[-1.5deg] cursor-pointer"
        >
          <span className="font-syne text-[17px] font-extrabold uppercase tracking-wider text-primary-container">
            WHO IS SUS?
          </span>
          <span className="text-base animate-pulse">👀</span>
        </div>
      </div>

      {/* Trailing Cluster */}
      <div className="flex items-center gap-2">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="w-10 h-10 rounded-lg brutal-border bg-surface-container-high text-on-surface flex items-center justify-center brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all"
          title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-primary-container" />
          ) : (
            <VolumeX className="w-5 h-5 text-outline" />
          )}
        </button>

        {/* Rules Button */}
        <button
          onClick={() => {
            sounds.playClick();
            triggerHaptic('light');
            onOpenRules();
          }}
          className="flex items-center gap-1 bg-secondary-container text-white px-2.5 py-2 rounded-lg brutal-border brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all font-syne text-xs font-extrabold uppercase tracking-wide"
        >
          <BookOpen className="w-4 h-4" />
          <span>RULES</span>
        </button>
      </div>
    </header>
  );
}
