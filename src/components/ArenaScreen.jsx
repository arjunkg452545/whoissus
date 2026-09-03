import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Flame, ShieldAlert, UserCheck, Play, RotateCcw, PlusCircle } from 'lucide-react';
import { TIPS } from '../data/words';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function ArenaScreen({
  players,
  secretWordData,
  imposterIndices,
  onRevealImposter,
  onPlayAgain
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [votes, setVotes] = useState({}); // { [playerId]: count }
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [randomTipIndex, setRandomTipIndex] = useState(0);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTimerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            sounds.playBuzzer();
            triggerHaptic('warning');
            return 0;
          }
          if (prev <= 10) {
            sounds.playHeartbeat();
            triggerHaptic('light');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, secondsRemaining]);

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // SVG circular progress calculation
  const totalDuration = 120;
  const strokeDashoffset = 213.6 - (213.6 * secondsRemaining) / totalDuration;
  const isPanic = secondsRemaining <= 15;

  const handleVote = (playerId) => {
    sounds.playVoteStamp();
    triggerHaptic('medium');
    setSelectedSuspectId(playerId);
    setVotes((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));
  };

  const handleAdd30Seconds = () => {
    sounds.playClick();
    triggerHaptic('light');
    setSecondsRemaining((prev) => prev + 30);
  };

  // Find leader
  const getLeadingPlayer = () => {
    let maxVotes = 0;
    let leader = null;
    Object.entries(votes).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        leader = players.find(p => p.id === id);
      }
    });
    return leader;
  };

  const leadingPlayer = getLeadingPlayer();

  const handleTriggerReveal = () => {
    sounds.playClick();
    triggerHaptic('heavy');
    // If no one voted yet, default to first or selected
    const chosenPlayer = leadingPlayer || (selectedSuspectId ? players.find(p => p.id === selectedSuspectId) : players[0]);
    onRevealImposter(chosenPlayer);
  };

  return (
    <div className="flex-1 flex flex-col pt-16 pb-28 space-y-4 max-w-[480px] mx-auto w-full">
      {/* 1. TOP MARQUEE TICKER RIBBON */}
      <section className="w-full bg-secondary-container border-b-2 border-surface-container-lowest overflow-hidden py-1.5 flex items-center relative z-20">
        <div className="animate-ticker whitespace-nowrap flex items-center">
          {TIPS.map((tip, idx) => (
            <span key={idx} className="font-syne text-[11px] text-white px-5 uppercase tracking-widest font-extrabold flex items-center gap-1">
              {tip}
            </span>
          ))}
        </div>
      </section>

      <div className="px-4 space-y-4">
        {/* 2. Round & Timer Banner Card */}
        <div className={`w-full bg-surface-container border-3 border-surface-container-lowest rounded-2xl p-4 flex items-center justify-between [box-shadow:4px_4px_0px_#0d0e12] relative overflow-hidden ${
          isPanic ? 'hazard-stripes text-white' : ''
        }`}>
          {!isPanic && (
            <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-primary-container opacity-10 rounded-full blur-xl pointer-events-none"></div>
          )}

          <div className="flex flex-col gap-1.5 max-w-[62%]">
            {/* Phase Badge */}
            <div className="inline-flex items-center gap-1.5 bg-surface-container-high border-2 border-surface-container-lowest px-2.5 py-1 rounded-full w-fit [box-shadow:2px_2px_0px_#0d0e12]">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
              <span className="font-syne text-[10px] text-tertiary-container uppercase tracking-wider font-extrabold">
                BLUFF & ACCUSE ROUND 🗣️
              </span>
            </div>

            {/* Category Pill */}
            <div className="inline-flex items-center bg-primary-container border-2 border-surface-container-lowest px-2.5 py-0.5 rounded-md w-fit [box-shadow:2px_2px_0px_#0d0e12]">
              <span className="font-syne text-xs text-on-primary font-extrabold">
                Category: {secretWordData.categoryName} {secretWordData.categoryEmoji}
              </span>
            </div>

            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              Ask tricky questions & spot who is nervous!
            </p>
          </div>

          {/* Giant Neon Circular Countdown Timer */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#292a2e"
                strokeWidth="7"
                fill="#121317"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke={isPanic ? "#ff4a8d" : "#c3f400"}
                strokeWidth="7"
                strokeDasharray="213.6"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-syne text-sm font-extrabold tracking-tighter leading-none ${
                isPanic ? "text-secondary-container animate-pulse" : "text-primary-container"
              }`}>
                {formatTime(secondsRemaining)}
              </span>
              <span className="font-syne text-[9px] text-on-surface-variant uppercase mt-0.5 font-bold">
                LEFT
              </span>
            </div>
          </div>
        </div>

        {/* 3. Accusation Heading */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="font-syne text-sm text-primary uppercase font-extrabold tracking-wide">
              WHO LOOKS SUSPECT?
            </span>
            <span className="text-lg">🕵️‍♂️</span>
          </div>
          <span className="font-syne text-[10px] bg-surface-container-highest text-primary-container border-2 border-surface-container-lowest px-2 py-0.5 rounded-full [box-shadow:1px_1px_0px_#0d0e12] uppercase font-extrabold">
            TAP TO ACCUSE
          </span>
        </div>

        {/* 4. Voting Arena: Player Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {players.map((player, idx) => {
            const voteCount = votes[player.id] || 0;
            const isSelected = selectedSuspectId === player.id;
            const isLeader = leadingPlayer && leadingPlayer.id === player.id;

            return (
              <div
                key={player.id}
                className={`relative p-3.5 rounded-2xl brutal-border bg-surface-container flex flex-col justify-between transition-all duration-100 ${
                  isLeader ? "ring-4 ring-secondary-container brutal-shadow-magenta" : "brutal-shadow"
                }`}
              >
                {/* Voted Stamp Effect */}
                {voteCount > 0 && (
                  <div className="absolute -top-2.5 -right-2 bg-secondary-container text-white text-[10px] font-syne font-extrabold uppercase px-2 py-0.5 rounded brutal-border brutal-shadow-sm rotate-6 flex items-center gap-1 z-10 animate-in zoom-in-75">
                    <span>SUSPECT</span>
                    <span className="bg-surface-container-lowest text-primary-container px-1 rounded-full text-[9px]">
                      {voteCount}
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-3 border-surface-container-lowest ${player.bgColor} brutal-shadow-sm mb-2`}>
                    {player.emoji}
                  </div>
                  <h3 className="font-syne font-extrabold text-base text-primary leading-tight truncate w-full">
                    {player.name}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant italic mt-0.5">
                    Player #{idx + 1}
                  </span>
                </div>

                {/* Vote CTA Button */}
                <button
                  type="button"
                  onClick={() => handleVote(player.id)}
                  className={`w-full mt-3 py-2 px-1 border-2 border-surface-container-lowest rounded-xl font-syne text-xs font-extrabold uppercase flex items-center justify-center gap-1 [box-shadow:2px_2px_0px_#0d0e12] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                    isSelected
                      ? "bg-secondary-container text-white"
                      : "bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary"
                  }`}
                >
                  <span>SUS?</span>
                  <span className="text-sm">👉</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* 5. Sudden Death / Leading Suspect Alert */}
        {leadingPlayer && (
          <div className="w-full bg-secondary-container/20 border-2 border-secondary-container rounded-xl p-3 flex items-center gap-2.5 [box-shadow:3px_3px_0px_#0d0e12] animate-in fade-in">
            <span className="w-8 h-8 rounded-lg bg-secondary-container text-white flex items-center justify-center shrink-0 border-2 border-surface-container-lowest font-bold text-sm">
              ⚡
            </span>
            <p className="font-syne text-xs text-secondary-fixed tracking-tight leading-snug">
              <span className="font-extrabold text-white uppercase">{leadingPlayer.name}</span> is leading the accusations! Are they bluffing or truly clueless?
            </p>
          </div>
        )}
      </div>

      {/* 6. BOTTOM ACTION BAR (Sticky CTA) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-4 bg-surface/90 backdrop-blur-md border-t-4 border-surface-container-lowest z-40 [box-shadow:0px_-4px_0px_#0d0e12] flex items-center gap-3">
        {/* Add 30s Ghost Button */}
        <button
          onClick={handleAdd30Seconds}
          className="w-2/5 py-3.5 px-2 bg-surface-container-low border-3 border-outline-variant hover:border-primary-container text-on-surface rounded-xl font-syne text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 [box-shadow:3px_3px_0px_#0d0e12] active:translate-x-0.5 active:translate-y-0.5"
          title="Add 30 Seconds for discussion"
        >
          <span>+30 SECS</span>
          <span>⏱️</span>
        </button>

        {/* High-Voltage Primary CTA: Reveal The Sus */}
        <button
          onClick={handleTriggerReveal}
          className="w-3/5 py-3.5 px-2 bg-primary-container border-4 border-surface-container-lowest text-on-primary rounded-xl font-syne text-sm font-extrabold uppercase tracking-wide flex items-center justify-center gap-1.5 [box-shadow:4px_4px_0px_#0d0e12] active:translate-x-0.5 active:translate-y-0.5 hover:bg-[#b0dc00] transition-colors"
        >
          <span>REVEAL THE SUS</span>
          <span className="text-base animate-pulse">💥</span>
        </button>
      </div>
    </div>
  );
}
