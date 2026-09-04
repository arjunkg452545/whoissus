import React, { useState } from 'react';
import { Lock, Scan, Check } from 'lucide-react';
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
    <div className="h-full max-h-full flex-1 flex flex-col px-3.5 pt-[88px] pb-[max(0.75rem,env(safe-area-inset-bottom))] justify-between select-none overflow-hidden overscroll-none max-w-[480px] mx-auto w-full">
      {/* 1. Unified Pass & Player Banner (Merged for zero-scroll mobile fit) */}
      <section className="shrink-0">
        <div className="bg-primary-container text-surface-container-lowest border-3 border-surface-container-lowest p-2 rounded-xl [box-shadow:3px_3px_0px_#0d0e12] flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary-container flex items-center justify-center text-lg shrink-0 brutal-shadow-sm font-bold">
              {currentPlayer.emoji}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-syne font-extrabold uppercase bg-surface-container-lowest text-primary-container px-1.5 py-0.2 rounded leading-none">
                  {currentPlayerIndex + 1}/{players.length}
                </span>
                <span className="text-[9.5px] font-syne font-extrabold uppercase text-surface-container-lowest/80 tracking-wide truncate">
                  CONFIDENTIAL PEEK
                </span>
              </div>
              <div className="font-syne text-sm sm:text-base font-extrabold uppercase leading-tight tracking-tight mt-0.5 truncate">
                PASS TO {currentPlayer.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-lowest text-secondary-container px-2 py-1 rounded-lg border border-surface-container-lowest font-syne text-[10px] font-extrabold tracking-wider shrink-0">
            <Lock className="w-3 h-3" />
            <span>PEEK</span>
          </div>
        </div>
      </section>

      {/* 2. Center Secret Card View (Hidden vs Revealed) */}
      <section className="relative flex-1 flex flex-col justify-center my-auto max-h-[320px] w-full">
        {isPeeking ? (
          /* REVEAL STATE */
          isImposter ? (
            /* VARIANT B: THE SUS (IMPOSTOR) */
            <div className="w-full bg-secondary-container text-white border-3 border-surface-container-lowest rounded-2xl p-3.5 [box-shadow:4px_4px_0px_#0d0e12] flex flex-col justify-between relative transition-all duration-150 animate-in zoom-in-95">
              <div className="absolute -top-3 right-3 bg-surface-container-lowest text-primary-container px-2.5 py-0.5 rounded-full border-2 border-surface-container-lowest font-syne text-[10px] tracking-wider uppercase transform rotate-2 [box-shadow:2px_2px_0px_#0d0e12]">
                💀 TOP SECRET • SUS
              </div>

              <div>
                <div className="flex items-center justify-between border-b-2 border-surface-container-lowest/40 pb-1 mb-1.5">
                  <span className="font-syne text-[10px] uppercase font-extrabold tracking-wider bg-surface-container-lowest text-secondary-container px-2 py-0.5 rounded">
                    ROLE: THE SUS (IMPOSTOR)
                  </span>
                  <span className="text-base">🕵️‍♂️</span>
                </div>

                <div className="text-center py-1.5">
                  <h2 className="font-syne text-xl sm:text-2xl font-extrabold uppercase leading-tight tracking-wide text-white drop-shadow-md">
                    YOU ARE THE SUS! 💀👀
                  </h2>
                  <p className="mt-1 font-sans font-bold text-[11px] text-surface-container-lowest bg-white/90 px-2 py-0.5 rounded-md inline-block border border-surface-container-lowest">
                    You DO NOT know the word!
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest text-on-surface p-2 rounded-xl border-2 border-surface-container-lowest mt-1 space-y-1">
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
            <div className="w-full bg-[#f59e0b] text-surface-container-lowest border-3 border-surface-container-lowest rounded-2xl p-3.5 [box-shadow:4px_4px_0px_#0d0e12] flex flex-col justify-between relative transition-all duration-150 animate-in zoom-in-95">
              <div className="absolute -top-3 right-3 bg-surface-container-lowest text-[#f59e0b] px-2.5 py-0.5 rounded-full border-2 border-surface-container-lowest font-syne text-[10px] tracking-wider uppercase transform rotate-2 [box-shadow:2px_2px_0px_#0d0e12]">
                🎭 AADHA SUS • UNDERCOVER
              </div>

              <div>
                <div className="flex items-center justify-between border-b-2 border-surface-container-lowest pb-1 mb-1.5">
                  <span className="font-syne text-[10px] uppercase font-extrabold tracking-wider bg-surface-container-lowest text-[#f59e0b] px-2 py-0.5 rounded">
                    CATEGORY: {secretWordData.categoryName}
                  </span>
                  <span className="text-base">{secretWordData.categoryEmoji}</span>
                </div>

                <div className="text-center py-1.5">
                  <span className="text-[9.5px] font-syne font-extrabold uppercase text-surface-container-lowest/70 tracking-widest">
                    YOUR SECRET WORD IS
                  </span>
                  <h2 className="font-syne text-xl sm:text-2xl font-extrabold uppercase leading-tight tracking-wide text-surface-container-lowest mt-0.5">
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
            <div className="w-full bg-tertiary-fixed text-surface-container-lowest border-3 border-surface-container-lowest rounded-2xl p-3.5 [box-shadow:4px_4px_0px_#0d0e12] flex flex-col justify-between relative transition-all duration-150 animate-in zoom-in-95">
              <div className="absolute -top-3 right-3 bg-secondary-container text-white px-2.5 py-0.5 rounded-full border-2 border-surface-container-lowest font-syne text-[10px] tracking-wider uppercase transform rotate-2 [box-shadow:2px_2px_0px_#0d0e12]">
                CONFIDENTIAL • CIVILIAN
              </div>

              <div>
                <div className="flex items-center justify-between border-b-2 border-surface-container-lowest pb-1 mb-1.5">
                  <span className="font-syne text-[10px] uppercase font-extrabold tracking-wider bg-surface-container-lowest text-tertiary-fixed px-2 py-0.5 rounded">
                    CATEGORY: {secretWordData.categoryName}
                  </span>
                  <span className="text-base">{secretWordData.categoryEmoji}</span>
                </div>

                <div className="text-center py-1.5">
                  <span className="text-[9.5px] font-syne font-extrabold uppercase text-surface-container-lowest/70 tracking-widest">
                    THE SECRET WORD IS
                  </span>
                  <h2 className="font-syne text-xl sm:text-2xl font-extrabold uppercase leading-tight tracking-wide text-surface-container-lowest mt-0.5">
                    {secretWordData.word}
                  </h2>
                  <p className="text-[11px] font-semibold text-surface-container-lowest/80 mt-0.5 italic leading-tight">
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
          <div className="w-full bg-surface-container border-3 border-surface-container-lowest rounded-2xl p-3.5 [box-shadow:3px_3px_0px_#0d0e12] flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center brutal-shadow-sm rotate-[-3deg]">
              <Lock className="w-5 h-5 text-primary-container" />
            </div>

            <div>
              <h3 className="font-syne text-base font-extrabold text-primary uppercase">
                {currentPlayer.name}'s Turn
              </h3>
              <p className="text-[11px] text-on-surface-variant max-w-[240px] mx-auto mt-0.5 font-medium">
                Hold phone alone. Don't let anyone peek!
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
                onContextMenu={(e) => e.preventDefault()}
                className="w-full py-3 bg-tertiary-fixed text-surface-container-lowest font-syne text-sm font-extrabold uppercase rounded-xl border-2 border-surface-container-lowest brutal-shadow brutal-btn flex items-center justify-center gap-2 hover:bg-[#8ee7fc] select-none touch-none relative overflow-hidden"
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

      {/* 3. Action Bar (Next / Finish) */}
      <section className="shrink-0 pt-1">
        <button
          onClick={handlePassNext}
          disabled={!hasPeekingOccurred}
          className={`w-full py-3 sm:py-3.5 font-syne text-sm sm:text-base font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2 transition-all ${
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
      </section>
    </div>
  );
}
