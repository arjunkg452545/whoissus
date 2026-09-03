import React from 'react';
import { X, ShieldAlert, Sparkles, HelpCircle, Flame } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-surface-container border-4 border-surface-container-lowest rounded-2xl p-5 brutal-shadow-lg max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b-2 border-surface-container-lowest pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-secondary-container text-white rounded-lg brutal-border brutal-shadow-sm rotate-[-2deg]">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="font-syne text-xl font-extrabold uppercase text-primary tracking-wide">
              HOW TO PLAY 🔥
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-surface-container-lowest text-white font-extrabold flex items-center justify-center hover:bg-error transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="space-y-4 pt-4 font-sans text-sm">
          {/* Step 1 */}
          <div className="p-3 bg-surface-container-low rounded-xl brutal-border brutal-shadow-sm flex gap-3 items-start">
            <span className="w-7 h-7 shrink-0 rounded-lg bg-primary-container text-surface-container-lowest font-syne font-extrabold flex items-center justify-center text-sm">
              1
            </span>
            <div>
              <h3 className="font-syne font-bold text-primary text-base">📱 Pass The Phone</h3>
              <p className="text-on-surface-variant text-xs mt-0.5">
                Pass the phone around. Each player holds down the screen to discreetly peek at their secret card.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-[#acedff]/10 rounded-xl border-2 border-tertiary-fixed-dim brutal-shadow-sm flex gap-3 items-start">
            <span className="w-7 h-7 shrink-0 rounded-lg bg-tertiary-fixed text-surface-container-lowest font-syne font-extrabold flex items-center justify-center text-sm">
              2
            </span>
            <div>
              <h3 className="font-syne font-bold text-tertiary-fixed-dim text-base">🥟 Civilians (Innocent)</h3>
              <p className="text-on-surface-variant text-xs mt-0.5">
                You receive the exact Secret Word (e.g. <span className="text-primary-container font-bold">PANI PURI</span>). Give clever, subtle clues without making it too obvious!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-secondary-container/10 rounded-xl border-2 border-secondary-container brutal-shadow-sm flex gap-3 items-start">
            <span className="w-7 h-7 shrink-0 rounded-lg bg-secondary-container text-white font-syne font-extrabold flex items-center justify-center text-sm">
              3
            </span>
            <div>
              <h3 className="font-syne font-bold text-secondary-container text-base">💀 The Sus (Suspicious)</h3>
              <p className="text-on-surface-variant text-xs mt-0.5">
                You are The Sus! You do <span className="font-bold text-white">NOT</span> know the word! Listen to others, blend in, and fake your clue like a true actor!
              </p>
            </div>
          </div>

          {/* Step 4: The Twist */}
          <div className="p-3 bg-warning-orange/15 rounded-xl border-2 border-warning-orange brutal-shadow-sm flex gap-3 items-start">
            <span className="w-7 h-7 shrink-0 rounded-lg bg-warning-orange text-white font-syne font-extrabold flex items-center justify-center text-sm">
              4
            </span>
            <div>
              <h3 className="font-syne font-bold text-warning-orange text-base">⚡ The Sus's Last Stand!</h3>
              <p className="text-on-surface-variant text-xs mt-0.5">
                Even if the squad catches The Sus, the game isn't over! The Sus gets <span className="font-bold text-white">ONE chance</span> to guess the secret word. Guess right = <span className="text-primary-container font-bold">THE SUS STEALS THE WIN!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Dismiss CTA */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="w-full mt-5 py-3 bg-primary-container text-surface-container-lowest font-syne font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn tracking-wider"
        >
          GOT IT, LET'S PLAY 🚀
        </button>
      </div>
    </div>
  );
}
