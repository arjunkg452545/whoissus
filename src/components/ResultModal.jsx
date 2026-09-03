import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Skull, Trophy, AlertOctagon, RotateCcw, Home, Sparkles, CheckCircle2, Share2, Camera } from 'lucide-react';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function ResultModal({
  isOpen,
  accusedPlayer,
  players,
  imposterIndices,
  undercoverIndex,
  secretWordData,
  onPlayAgain,
  onBackToLobby,
  onOpenFIR
}) {
  if (!isOpen || !accusedPlayer) return null;

  const imposterPlayers = imposterIndices.map(idx => players[idx]);
  const isAccusedImposter = imposterIndices.some(idx => players[idx].id === accusedPlayer.id);
  const undercoverPlayer = (undercoverIndex !== null && undercoverIndex !== undefined) ? players[undercoverIndex] : null;

  // Imposter's Last Stand state
  const [phase, setPhase] = useState('verdict'); // 'verdict' | 'last-stand' | 'final-outcome'
  const [selectedGuess, setSelectedGuess] = useState(null);
  const [guessOutcome, setGuessOutcome] = useState(null); // 'correct' | 'wrong'

  // Prepare 4 choices for the Last Stand (The correct word + 3 decoys)
  const [wordChoices, setWordChoices] = useState([]);

  useEffect(() => {
    if (isAccusedImposter) {
      const allChoices = [secretWordData.word, ...(secretWordData.decoys || [])];
      // Shuffle choices
      const shuffled = allChoices.sort(() => 0.5 - Math.random());
      setWordChoices(shuffled);
    }
  }, [isAccusedImposter, secretWordData]);

  // Trigger sound & confetti
  useEffect(() => {
    if (isAccusedImposter) {
      sounds.playVoteStamp();
      triggerHaptic('heavy');
    } else {
      sounds.playBuzzer();
      triggerHaptic('warning');
    }
  }, [isAccusedImposter]);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleStartLastStand = () => {
    sounds.playClick();
    triggerHaptic('medium');
    setPhase('last-stand');
  };

  const handleImposterGuess = (word) => {
    setSelectedGuess(word);
    if (word === secretWordData.word) {
      setGuessOutcome('correct');
      sounds.playVictory();
      triggerHaptic('success');
      fireConfetti();
    } else {
      setGuessOutcome('wrong');
      sounds.playBuzzer();
      triggerHaptic('warning');
    }
    setPhase('final-outcome');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface-container border-4 border-surface-container-lowest rounded-3xl p-6 brutal-shadow-lg max-h-[92vh] overflow-y-auto no-scrollbar">

        {/* 1. INITIAL VERDICT PHASE */}
        {phase === 'verdict' && (
          <div className="flex flex-col items-center text-center space-y-4">
            {isAccusedImposter ? (
              <>
                <div className="w-20 h-20 rounded-2xl bg-secondary-container text-white border-3 border-surface-container-lowest flex items-center justify-center text-4xl brutal-shadow-magenta rotate-[-3deg]">
                  💀
                </div>
                <div>
                  <span className="font-syne text-[11px] bg-secondary-container text-white px-3 py-1 rounded-full uppercase font-extrabold tracking-wider border-2 border-surface-container-lowest [box-shadow:2px_2px_0px_#0d0e12]">
                    THE SUS BUSTED! 🎯
                  </span>
                  <h2 className="font-syne text-2xl font-extrabold uppercase text-primary mt-2">
                    {accusedPlayer.name} WAS THE SUS!
                  </h2>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    The squad spotted the suspicious player! But wait...
                  </p>
                </div>

                {/* The Chameleon Mechanic: The Sus's Last Stand Trigger */}
                <div className="w-full bg-warning-orange/15 border-2 border-warning-orange p-3.5 rounded-2xl brutal-shadow-sm text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <h4 className="font-syne text-sm font-extrabold text-warning-orange uppercase">
                      THE SUS'S LAST STAND!
                    </h4>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    <span className="text-white font-bold">{accusedPlayer.name}</span> has ONE chance to guess the secret word. If they guess right, they STEAL the win!
                  </p>
                </div>

                <button
                  onClick={handleStartLastStand}
                  className="w-full py-4 bg-warning-orange text-white font-syne text-base font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2"
                >
                  <span>LET {accusedPlayer.name.toUpperCase()} GUESS THE WORD 🎯</span>
                </button>
              </>
            ) : (
              /* INNOCENT KILLED */
              <>
                <div className="w-20 h-20 rounded-2xl bg-error-container text-white border-3 border-surface-container-lowest flex items-center justify-center text-4xl brutal-shadow rotate-[3deg]">
                  😱
                </div>
                <div>
                  <span className="font-syne text-[11px] bg-error-container text-white px-3 py-1 rounded-full uppercase font-extrabold tracking-wider border-2 border-surface-container-lowest [box-shadow:2px_2px_0px_#0d0e12]">
                    WRONG ACCUSATION! 💀
                  </span>
                  <h2 className="font-syne text-2xl font-extrabold uppercase text-primary mt-2">
                    {accusedPlayer.name} WAS INNOCENT!
                  </h2>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    You eliminated a civilian! The real Sus fooled everyone!
                  </p>
                </div>

                {/* Reveal Real Sus & Undercover */}
                <div className="w-full bg-surface-container-low border-3 border-secondary-container p-4 rounded-2xl brutal-shadow-magenta text-center space-y-2">
                  <div>
                    <span className="text-[10px] font-syne text-secondary-container font-extrabold uppercase tracking-widest">
                      THE REAL SUS WAS
                    </span>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-2xl">{imposterPlayers[0]?.emoji}</span>
                      <span className="font-syne text-xl font-extrabold text-white uppercase">
                        {imposterPlayers.map(p => p.name).join(", ")}
                      </span>
                    </div>
                  </div>

                  {undercoverPlayer && (
                    <div className="border-t border-surface-container-lowest/40 pt-2">
                      <span className="text-[10px] font-syne text-[#f59e0b] font-extrabold uppercase tracking-widest">
                        UNDERCOVER (AADHA SUS):
                      </span>
                      <p className="font-syne text-sm font-extrabold text-[#f59e0b]">
                        {undercoverPlayer.name} ({secretWordData.undercoverWord || secretWordData.word})
                      </p>
                    </div>
                  )}

                  <div className="text-xs bg-surface-container-lowest py-1 px-2 rounded font-syne text-primary-container font-bold">
                    Secret Word was: "{secretWordData.word}"
                  </div>
                </div>

                <div className="w-full space-y-2.5 pt-2">
                  <button
                    onClick={onOpenFIR}
                    className="w-full py-3.5 bg-gradient-to-r from-secondary-container to-[#f59e0b] text-white font-syne text-xs font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>DOWNLOAD ARREST REPORT / INSTA STORY 📸</span>
                  </button>

                  <button
                    onClick={onPlayAgain}
                    className="w-full py-3.5 bg-primary-container text-on-primary font-syne text-sm font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>PLAY AGAIN 🔄</span>
                  </button>
                  <button
                    onClick={onBackToLobby}
                    className="w-full py-3 bg-surface-container-high text-on-surface font-syne text-xs font-bold uppercase rounded-xl brutal-border brutal-shadow-sm brutal-btn flex items-center justify-center gap-1.5"
                  >
                    <Home className="w-4 h-4" />
                    <span>BACK TO LOBBY</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 2. LAST STAND GUESSING PHASE */}
        {phase === 'last-stand' && (
          <div className="flex flex-col text-center space-y-4">
            <div>
              <span className="font-syne text-[11px] bg-warning-orange text-white px-3 py-1 rounded-full uppercase font-extrabold tracking-wider border-2 border-surface-container-lowest">
                {accusedPlayer.name}'s LAST CHANCE ⚡
              </span>
              <h2 className="font-syne text-xl font-extrabold uppercase text-primary mt-2">
                WHAT WAS THE SECRET WORD?
              </h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                Category: <span className="text-primary font-bold">{secretWordData.categoryName}</span>
              </p>
            </div>

            {/* Choice Options */}
            <div className="space-y-2.5 pt-2">
              {wordChoices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleImposterGuess(choice)}
                  className="w-full py-3.5 px-4 bg-surface-container-low hover:bg-primary-container hover:text-on-primary border-3 border-surface-container-lowest rounded-xl font-syne text-sm font-extrabold uppercase tracking-wide brutal-shadow brutal-btn transition-all text-left flex items-center justify-between"
                >
                  <span>{choice}</span>
                  <span className="text-xs opacity-60">SELECT 👉</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. FINAL OUTCOME PHASE */}
        {phase === 'final-outcome' && (
          <div className="flex flex-col items-center text-center space-y-4">
            {guessOutcome === 'correct' ? (
              <>
                <div className="w-20 h-20 rounded-2xl bg-secondary-container text-white border-3 border-surface-container-lowest flex items-center justify-center text-4xl brutal-shadow-magenta rotate-[-3deg]">
                  👑
                </div>
                <div>
                  <span className="font-syne text-[11px] bg-secondary-container text-white px-3 py-1 rounded-full uppercase font-extrabold tracking-wider border-2 border-surface-container-lowest">
                    LEGENDARY STEAL! 😈
                  </span>
                  <h2 className="font-syne text-2xl font-extrabold uppercase text-primary mt-2">
                    {accusedPlayer.name} GUESSED IT!
                  </h2>
                  <p className="text-xs text-secondary-fixed font-bold mt-1">
                    THE SUS STEALS THE VICTORY! 😈🎉
                  </p>
                </div>
                <div className="p-3 bg-surface-container-lowest border-2 border-surface-container-lowest rounded-xl text-center w-full">
                  <p className="text-xs text-on-surface-variant">The secret word was indeed:</p>
                  <p className="font-syne text-lg font-extrabold text-primary-container uppercase mt-0.5">
                    "{secretWordData.word}"
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-2xl bg-primary-container text-on-primary border-3 border-surface-container-lowest flex items-center justify-center text-4xl brutal-shadow-lime rotate-[3deg]">
                  🏆
                </div>
                <div>
                  <span className="font-syne text-[11px] bg-primary-container text-on-primary px-3 py-1 rounded-full uppercase font-extrabold tracking-wider border-2 border-surface-container-lowest">
                    CIVILIANS WIN! 🚀
                  </span>
                  <h2 className="font-syne text-2xl font-extrabold uppercase text-primary mt-2">
                    THE SUS IS BUSTED! 🎯
                  </h2>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    {accusedPlayer.name} guessed <span className="text-secondary-container font-bold">"{selectedGuess}"</span>, which was wrong!
                  </p>
                </div>
                <div className="p-3 bg-surface-container-lowest border-2 border-surface-container-lowest rounded-xl text-center w-full">
                  <p className="text-xs text-on-surface-variant">Actual Secret Word:</p>
                  <p className="font-syne text-lg font-extrabold text-primary-container uppercase mt-0.5">
                    "{secretWordData.word}"
                  </p>
                </div>
              </>
            )}

            {/* Play Again and Social Share Buttons */}
            <div className="w-full space-y-2.5 pt-2">
              <button
                onClick={onOpenFIR}
                className="w-full py-3.5 bg-gradient-to-r from-secondary-container to-[#f59e0b] text-white font-syne text-xs font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>DOWNLOAD ARREST REPORT / INSTA STORY 📸</span>
              </button>

              <button
                onClick={onPlayAgain}
                className="w-full py-4 bg-primary-container text-on-primary font-syne text-sm font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY NEXT ROUND 🔄</span>
              </button>
              <button
                onClick={onBackToLobby}
                className="w-full py-3 bg-surface-container-high text-on-surface font-syne text-xs font-bold uppercase rounded-xl brutal-border brutal-shadow-sm brutal-btn flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>CHANGE PLAYERS / CATEGORY</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
