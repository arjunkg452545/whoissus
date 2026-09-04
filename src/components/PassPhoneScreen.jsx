import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldAlert, Sparkles, Fingerprint, ArrowRight, AlertTriangle, Scan } from 'lucide-react';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function PassPhoneScreen({
  players,
  currentPlayerIndex,
  secretWordData,
  imposterIndices,
  undercoverIndex,
  chaosModifier,
  onNextPlayer,
  onFinishPassRound
}) {
  const [isPeeking, setIsPeeking] = useState(false);
  const [hasPeekingOccurred, setHasPeekingOccurred] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const isImposter = imposterIndices.includes(currentPlayerIndex);
  const isUndercover = undercoverIndex === currentPlayerIndex;
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
    <div className="flex-1 flex flex-col px-4 pt-[70px] pb-3 space-y-2.5 max-w-[480px] mx-auto w-full justify-between select-none">
      {/* 1. Top Progress Banner */}
      <section className="flex flex-col items-center gap-1 w-full shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-surface-container-high border-2 border-surface-container-lowest rounded-full [box-shadow:2px_2px_0px_#0d0e12]">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
          <span className="font-syne text-[10px] uppercase text-primary-container font-extrabold tracking-wider">
            PLAYER {currentPlayerIndex + 1} OF {players.length} • PASS & PLAY 📱
          </span>
        </div>

        <div className="flex items-center gap-1 text-on-surface-variant font-syne text-[11px] tracking-wider uppercase">
          <Lock className="w-3 h-3 text-secondary-container" />
          <span>CONFIDENTIAL PEEK MODE</span>
          <span className="inline-block w-1.5 h-1.5 bg-secondary-container rounded-full"></span>
          <span className="text-secondary-fixed-dim">ROUND 1</span>
        </div>
      </section>

      {/* 2. Step 1: Pass Phone Card */}
      <section className="relative shrink-0">
        <div className="bg-primary-container text-surface-container-lowest border-3 border-surface-container-lowest p-2.5 sm:p-3 rounded-xl [box-shadow:3px_3px_0px_#0d0e12] transform -rotate-1 relative overflow-hidden">
          <div className="absolute -right-2 -bottom-4 opacity-15 font-syne text-5xl font-extrabold select-none pointer-events-none">
            {currentPlayerIndex + 1}/{players.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-surface-container-lowest text-primary-container w-7 h-7 rounded-lg font-syne text-sm font-extrabold">
              {currentPlayer.emoji}
            </span>
            <div className="font-syne text-base font-extrabold tracking-tight uppercase leading-none">
              PASS PHONE TO {currentPlayer.name}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 bg-surface-container-lowest text-on-surface text-[11px] px-2 py-1 rounded-lg border border-surface-container-lowest">
            <span className="text-secondary-container font-extrabold text-xs">⚠️</span>
            <span className="font-semibold text-[11px] leading-tight">
              Don't let anyone else peek over your shoulder!
            </span>
          </div>
        </div>
      </section>

      {/* 3. The Secret Card View (Changes when peeking) */}
      <section className="relative flex-1 flex flex-col justify-center min-h-[220px]">
        {isPeeking ? (
          /* REVEAL STATE */
          isImposter ? (
            /* VARIANT B: THE SUS (SUSPICIOUS) */
            <div className="w-full bg-secondary-container text-white border-3 border-surface-container-lowest rounded-2xl p-4 [box-shadow:4px_4px_0px_#0d0e12] flex flex-col justify-between relative transition-all duration-150 animate-in zoom-in-95">
              <div className="absolute -top-3 right-3 bg-surface-container-lowest text-primary-container px-2.5 py-0.5 rounded-full border-2 border-surface-container-lowest font-syne text-[10px] tracking-wider uppercase transform rotate-2 [box-shadow:2px_2px_0px_#0d0e12]">
                💀 TOP SECRET • SUS
              </div>

              <div>
                <div className="flex items-center justify-between border-b-2 border-surface-container-lowest/40 pb-1.5 mb-2">
                  <span className="font-syne text-[10px] uppercase font-extrabold tracking-wider bg-surface-container-lowest text-secondary-container px-2 py-0.5 rounded">
                    ROLE: THE SUS (IMPOSTOR)
                  </span>
                  <span className="text-lg">🕵️‍♂️</span>
                </div>

                <div className="text-center py-2">
                  <h2 className="font-syne text-2xl font-extrabold uppercase leading-tight tracking-wide text-white drop-shadow-md">
                    YOU ARE THE SUS! 💀👀
                  </h2>
                  <p className="mt-1.5 font-sans font-bold text-xs text-surface-container-lowest bg-white/90 px-2 py-0.5 rounded-md inline-block border border-surface-container-lowest">
                    You DO NOT know the word!
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest text-on-surface p-2.5 rounded-xl border-2 border-surface-container-lowest mt-1 space-y-1">
                <p className="text-[11px] font-semibold text-secondary-fixed leading-snug">
                  🎭 <span className="font-bold text-white">Your Mission:</span> Listen carefully to others' clues and fake it so no one votes for you!
                </p>
                {chaosModifier?.id === 'mukhbir' && (
                  <p className="text-[10px] bg-warning-orange/20 text-warning-orange border border-warning-orange/40 px-2 py-0.5 rounded font-syne font-extrabold">
                    🕵️ MUKHBIR INTEL: Word starts with "{secretWordData.word[0]}"!
                  </p>
                )}
              </div>
            </div>
          ) : isUndercover ? (
            /* VARIANT C: THE UNDERCOVER (AADHA SUS) */
            <div className="w-full bg-[#f59e0b] text-surface-container-lowest border-3 border-surface-container-lowest rounded-2xl p-4 [box-shadow:4px_4px_0px_#0d0e12] flex flex-col justify-between relative transition-all duration-150 animate-in zoom-in-95">
              <div className="absolute -top-3 right-3 bg-surface-container-lowest text-[#f59e0b] px-2.5 py-0.5 rounded-full border-2 border-surface-container-lowest font-syne text-[10px] tracking-wider uppercase transform rotate-2 [box-shadow:2px_2px_0px_#0d0e12]">
                🎭 AADHA SUS • UNDERCOVER
              </div>

              <div>
                <div className="flex items-center justify-between border-b-2 border-surface-container-lowest pb-1.5 mb-2">
                  <span className="font-syne text-[10px] uppercase font-extrabold tracking-wider bg-surface-container-lowest text-[#f59e0b] px-2 py-0.5 rounded">
                    CATEGORY: {secretWordData.categoryName}
                  </span>
                  <span className="text-base">{secretWordData.categoryEmoji}</span>
                </div>

                <div className="text-center py-2">
                  <span className="text-[10px] font-syne font-extrabold uppercase text-surface-container-lowest/70 tracking-widest">
                    YOUR SECRET WORD IS
                  </span>
                  <h2 className="font-syne text-2xl font-extrabold uppercase leading-tight tracking-wide text-surface-container-lowest mt-0.5">
                    {secretWordData.undercoverWord || secretWordData.word}
                  </h2>
                </div>
              </div>

              <div className="bg-surface-container-lowest text-on-surface p-2 rounded-xl border-2 border-surface-container-lowest mt-1 text-center">
                <p className="text-[11px] font-bold text-[#f59e0b] leading-tight">
                  ⚠️ You might be Undercover with a slightly different word! Act natural!
                </p>
              </div>
            </div>
          ) : (
            /* VARIANT A: CIVILIAN (INNOCENT) */
            <div className="w-full bg-tertiary-fixed text-surface-container-lowest border-3 border-surface-container-lowest rounded-2xl p-4 [box-shadow:4px_4px_0px_#0d0e12] flex flex-col justify-between relative transition-all duration-150 animate-in zoom-in-95">
              <div className="absolute -top-3 right-3 bg-secondary-container text-white px-2.5 py-0.5 rounded-full border-2 border-surface-container-lowest font-syne text-[10px] tracking-wider uppercase transform rotate-2 [box-shadow:2px_2px_0px_#0d0e12]">
                CONFIDENTIAL • CIVILIAN
              </div>

              <div>
                <div className="flex items-center justify-between border-b-2 border-surface-container-lowest pb-1.5 mb-2">
                  <span className="font-syne text-[10px] uppercase font-extrabold tracking-wider bg-surface-container-lowest text-tertiary-fixed px-2 py-0.5 rounded">
                    CATEGORY: {secretWordData.categoryName}
                  </span>
                  <span className="text-base">{secretWordData.categoryEmoji}</span>
                </div>

                <div className="text-center py-2">
                  <span className="text-[10px] font-syne font-extrabold uppercase text-surface-container-lowest/70 tracking-widest">
                    THE SECRET WORD IS
                  </span>
                  <h2 className="font-syne text-2xl font-extrabold uppercase leading-tight tracking-wide text-surface-container-lowest mt-0.5">
                    {secretWordData.word}
                  </h2>
                  <p className="text-[11px] font-semibold text-surface-container-lowest/80 mt-1 italic leading-tight">
                    "{secretWordData.hint}"
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest text-on-surface p-2 rounded-xl border-2 border-surface-container-lowest mt-1 text-center">
                <p className="text-[11px] font-bold text-primary-container leading-tight">
                  🤫 Act normal. Give a subtle clue. Don't be sus!
                </p>
              </div>
            </div>
          )
        ) : (
          /* HIDDEN STATE: HOLOGRAPHIC BIOMETRIC SCANNER */
          <div className="w-full bg-surface-container border-3 border-surface-container-lowest rounded-2xl p-4 [box-shadow:3px_3px_0px_#0d0e12] flex flex-col items-center justify-center text-center gap-2.5 min-h-[220px] relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center brutal-shadow-sm rotate-[-3deg]">
              <Lock className="w-6 h-6 text-primary-container" />
            </div>
            <div>
              <h3 className="font-syne text-base font-extrabold text-primary uppercase">
                {currentPlayer.name}'s Turn
              </h3>
              <p className="text-[11px] text-on-surface-variant max-w-[240px] mx-auto mt-0.5">
                Make sure you are holding the phone alone before peeking.
              </p>
            </div>

            {/* Holographic Biometric Scanner Button */}
            <div className="w-full pt-1">
              <button
                type="button"
                onMouseDown={handleStartPeek}
                onMouseUp={handleEndPeek}
                onTouchStart={handleStartPeek}
                onTouchEnd={handleEndPeek}
                className="w-full py-3 bg-tertiary-fixed text-surface-container-lowest font-syne text-sm font-extrabold uppercase rounded-xl border-2 border-surface-container-lowest brutal-shadow brutal-btn flex items-center justify-center gap-2 hover:bg-[#8ee7fc] select-none relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                <Scan className="w-5 h-5 animate-pulse text-surface-container-lowest" />
                <span>PRESS & HOLD TO SCAN 🤫</span>
              </button>
              <span className="text-[9.5px] text-outline block mt-1 uppercase font-syne font-bold">
                (Hold down to scan • Release to hide)
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 4. Action Bar (Next / Finish) */}
      <div className="pt-1 shrink-0">
        <button
          onClick={handlePassNext}
          disabled={!hasPeekingOccurred}
          className={`w-full py-3.5 font-syne text-sm sm:text-base font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2 transition-all ${
            hasPeekingOccurred
              ? "bg-primary-container text-on-primary hover:bg-[#b0dc00]"
              : "bg-surface-container-high text-outline opacity-60 cursor-not-allowed"
          }`}
        >
          <span>{isLastPlayer ? "ALL PLAYERS READY (START VOTE) 🚀" : "I'VE SEEN IT (HIDE & PASS) ➡️"}</span>
        </button>
        {!hasPeekingOccurred && (
          <p className="text-center text-[10px] text-outline mt-1 font-sans">
            * Please scan your secret card before passing!
          </p>
        )}
      </div>
    </div>
  );
}
