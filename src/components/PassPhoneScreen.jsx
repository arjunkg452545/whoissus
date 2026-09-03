import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldAlert, Sparkles, Fingerprint, ArrowRight, AlertTriangle, Utensils } from 'lucide-react';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function PassPhoneScreen({
  players,
  currentPlayerIndex,
  secretWordData,
  imposterIndices,
  onNextPlayer,
  onFinishPassRound
}) {
  const [isPeeking, setIsPeeking] = useState(false);
  const [hasPeekingOccurred, setHasPeekingOccurred] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const isImposter = imposterIndices.includes(currentPlayerIndex);
  const isLastPlayer = currentPlayerIndex === players.length - 1;

  const handleStartPeek = () => {
    setIsPeeking(true);
    setHasPeekingOccurred(true);
    // Identical sound & haptic for ALL players so no one sitting nearby can guess who is Sus!
    sounds.playPeek();
    triggerHaptic('light');
  };

  const handleEndPeek = () => {
    setIsPeeking(false);
  };

  const handlePassNext = () => {
    sounds.playClick();
    triggerHaptic('light');
    setIsPeeking(false);
    setHasPeekingOccurred(false);

    if (isLastPlayer) {
      onFinishPassRound();
    } else {
      onNextPlayer();
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-20 pb-10 space-y-4 max-w-[480px] mx-auto w-full">
      {/* 1. Top Progress Banner */}
      <section className="flex flex-col items-center gap-1.5 w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high border-2 border-surface-container-lowest rounded-full [box-shadow:2px_2px_0px_#0d0e12]">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
          <span className="font-syne text-[11px] uppercase text-primary-container font-extrabold tracking-wider">
            PLAYER {currentPlayerIndex + 1} OF {players.length} • PASS & PLAY 📱
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-on-surface-variant font-syne text-xs tracking-wider uppercase">
          <Lock className="w-3.5 h-3.5 text-secondary-container" />
          <span>CONFIDENTIAL PEEK MODE</span>
          <span className="inline-block w-1.5 h-1.5 bg-secondary-container rounded-full"></span>
          <span className="text-secondary-fixed-dim">ROUND 1</span>
        </div>
      </section>

      {/* 2. Step 1: Pass Phone Card */}
      <section className="relative">
        <div className="bg-primary-container text-surface-container-lowest border-4 border-surface-container-lowest p-3.5 rounded-xl [box-shadow:4px_4px_0px_#0d0e12] transform -rotate-1 relative overflow-hidden">
          <div className="absolute -right-3 -bottom-5 opacity-15 font-syne text-6xl font-extrabold select-none pointer-events-none">
            {currentPlayerIndex + 1}/{players.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-surface-container-lowest text-primary-container w-8 h-8 rounded-lg font-syne text-base font-extrabold">
              {currentPlayer.emoji}
            </span>
            <div className="font-syne text-lg font-extrabold tracking-tight uppercase leading-none">
              PASS PHONE TO {currentPlayer.name}
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 bg-surface-container-lowest text-on-surface text-xs px-2.5 py-1.5 rounded-lg border-2 border-surface-container-lowest">
            <span className="text-secondary-container font-extrabold text-sm">⚠️</span>
            <span className="font-semibold text-xs leading-snug">
              Don't let anyone else peek over your shoulder!
            </span>
          </div>
        </div>
      </section>

      {/* 3. The Secret Card View (Changes when peeking) */}
      <section className="relative flex-1 flex flex-col justify-center min-h-[310px]">
        {isPeeking ? (
          /* REVEAL STATE */
          isImposter ? (
            /* VARIANT B: THE IMPOSTER (SUS) */
            <div className="w-full bg-secondary-container text-white border-4 border-surface-container-lowest rounded-2xl p-5 [box-shadow:6px_6px_0px_#0d0e12] flex flex-col justify-between relative transition-all duration-150 animate-in zoom-in-95">
              {/* Tilted Badge */}
              <div className="absolute -top-3.5 right-3 bg-surface-container-lowest text-primary-container px-3 py-1 rounded-full border-2 border-surface-container-lowest font-syne text-[11px] tracking-wider uppercase transform rotate-3 [box-shadow:2px_2px_0px_#0d0e12]">
                💀 TOP SECRET • SUS
              </div>

              <div>
                <div className="flex items-center justify-between border-b-2 border-surface-container-lowest/40 pb-2 mb-3">
                  <span className="font-syne text-[11px] uppercase font-extrabold tracking-wider bg-surface-container-lowest text-secondary-container px-2 py-0.5 rounded">
                    ROLE: THE SUS (SUSPICIOUS)
                  </span>
                  <span className="text-xl">🕵️‍♂️</span>
                </div>

                <div className="text-center py-4">
                  <h2 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase leading-tight tracking-wide text-white drop-shadow-md">
                    YOU ARE THE SUS! 💀👀
                  </h2>
                  <p className="mt-2 font-sans font-bold text-sm text-surface-container-lowest bg-white/90 px-2.5 py-1 rounded-lg inline-block border-2 border-surface-container-lowest">
                    You DO NOT know the word!
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest text-on-surface p-3 rounded-xl border-2 border-surface-container-lowest mt-2">
                <p className="text-xs font-semibold text-secondary-fixed">
                  🎭 <span className="font-bold text-white">Your Mission:</span> You are the Suspicious one! Listen to their clues and fake it so no one votes for you!
                </p>
              </div>
            </div>
          ) : (
            /* VARIANT A: CIVILIAN (INNOCENT) */
            <div className="w-full bg-tertiary-fixed text-surface-container-lowest border-4 border-surface-container-lowest rounded-2xl p-5 [box-shadow:6px_6px_0px_#0d0e12] flex flex-col justify-between relative transition-all duration-150 animate-in zoom-in-95">
              {/* Tilted Badge */}
              <div className="absolute -top-3.5 right-3 bg-secondary-container text-white px-3 py-1 rounded-full border-2 border-surface-container-lowest font-syne text-[11px] tracking-wider uppercase transform rotate-3 [box-shadow:2px_2px_0px_#0d0e12]">
                CONFIDENTIAL • CIVILIAN
              </div>

              <div>
                <div className="flex items-center justify-between border-b-2 border-surface-container-lowest pb-2 mb-3">
                  <span className="font-syne text-[11px] uppercase font-extrabold tracking-wider bg-surface-container-lowest text-tertiary-fixed px-2 py-0.5 rounded">
                    CATEGORY: {secretWordData.categoryName}
                  </span>
                  <span className="text-lg">{secretWordData.categoryEmoji}</span>
                </div>

                <div className="text-center py-3">
                  <span className="text-xs font-syne font-extrabold uppercase text-surface-container-lowest/70 tracking-widest">
                    THE SECRET WORD IS
                  </span>
                  <h2 className="font-syne text-3xl font-extrabold uppercase leading-tight tracking-wide text-surface-container-lowest mt-1">
                    {secretWordData.word}
                  </h2>
                  <p className="text-xs font-semibold text-surface-container-lowest/80 mt-1 italic">
                    "{secretWordData.hint}"
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest text-on-surface p-2.5 rounded-xl border-2 border-surface-container-lowest mt-2 text-center">
                <p className="text-xs font-bold text-primary-container">
                  🤫 Act normal. Give a subtle clue. Don't be sus!
                </p>
              </div>
            </div>
          )
        ) : (
          /* HIDDEN STATE (DEFAULT) */
          <div className="w-full bg-surface-container border-4 border-surface-container-lowest rounded-2xl p-6 [box-shadow:4px_4px_0px_#0d0e12] flex flex-col items-center justify-center text-center gap-4 min-h-[290px]">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high border-3 border-surface-container-lowest flex items-center justify-center brutal-shadow-sm rotate-[-3deg]">
              <Lock className="w-8 h-8 text-primary-container" />
            </div>
            <div>
              <h3 className="font-syne text-lg font-extrabold text-primary uppercase">
                {currentPlayer.name}'s Turn
              </h3>
              <p className="text-xs text-on-surface-variant max-w-[240px] mx-auto mt-1">
                Make sure you are holding the phone alone before peeking.
              </p>
            </div>

            {/* Tap & Hold Peek Trigger */}
            <div className="w-full pt-2">
              <button
                type="button"
                onMouseDown={handleStartPeek}
                onMouseUp={handleEndPeek}
                onTouchStart={handleStartPeek}
                onTouchEnd={handleEndPeek}
                className="w-full py-4 bg-tertiary-fixed text-surface-container-lowest font-syne text-base font-extrabold uppercase rounded-xl border-3 border-surface-container-lowest brutal-shadow brutal-btn flex items-center justify-center gap-2 hover:bg-[#8ee7fc] select-none"
              >
                <Fingerprint className="w-6 h-6 animate-pulse" />
                <span>PRESS & HOLD TO PEEK 🤫</span>
              </button>
              <span className="text-[10px] text-outline block mt-1.5 uppercase font-syne font-bold">
                (Hold down to see • Release to hide)
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 4. Action Bar (Next / Finish) */}
      <div className="pt-2">
        <button
          onClick={handlePassNext}
          disabled={!hasPeekingOccurred}
          className={`w-full py-4 font-syne text-base font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2 transition-all ${
            hasPeekingOccurred
              ? "bg-primary-container text-on-primary hover:bg-[#b0dc00]"
              : "bg-surface-container-high text-outline opacity-60 cursor-not-allowed"
          }`}
        >
          <span>{isLastPlayer ? "ALL PLAYERS READY (START VOTE) 🚀" : "I'VE SEEN IT (HIDE & PASS) ➡️"}</span>
        </button>
        {!hasPeekingOccurred && (
          <p className="text-center text-[11px] text-outline mt-1 font-sans">
            * Please peek at your role first before passing!
          </p>
        )}
      </div>
    </div>
  );
}
