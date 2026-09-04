import React, { useState, useEffect } from 'react';
import { Flame, Skull, RotateCcw, Check, Sparkles, AlertTriangle, Dice5, Volume2, VolumeX, Mic } from 'lucide-react';
import { PARTY_DARES } from '../data/words';
import { sounds } from '../utils/sound';
import { speech } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';

export default function DareModal({ isOpen, onClose, punishedPlayer }) {
  if (!isOpen) return null;

  const [currentDareIndex, setCurrentDareIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Auto spin once on modal open
  useEffect(() => {
    spinRoulette();
    return () => {
      speech.stop();
    };
  }, []);

  const handleSpeakCurrentDare = (dareToSpeak = PARTY_DARES[currentDareIndex]) => {
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
      return;
    }

    triggerHaptic('light');
    speech.speakDare({
      playerName: punishedPlayer?.name,
      dareText: dareToSpeak.text,
      ttsText: dareToSpeak.ttsText,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };

  const spinRoulette = () => {
    if (isSpinning) return;
    speech.stop();
    setIsSpeaking(false);
    setIsSpinning(true);
    triggerHaptic('medium');

    let counter = 0;
    const totalTicks = 16;
    const interval = setInterval(() => {
      // Drumroll build-up
      if (counter % 2 === 0) {
        sounds.playDrumroll();
      } else {
        sounds.playWheelTick();
      }
      triggerHaptic('light');
      setCurrentDareIndex(prev => (prev + 1) % PARTY_DARES.length);
      counter++;

      if (counter >= totalTicks) {
        clearInterval(interval);
        // Random final pick
        const finalIdx = Math.floor(Math.random() * PARTY_DARES.length);
        setCurrentDareIndex(finalIdx);
        setIsSpinning(false);

        // Dramatic Fanfare & Vine Boom
        sounds.playFanfare();
        triggerHaptic('heavy');

        // Auto-speak dare in Indian Voice
        if (voiceEnabled) {
          setTimeout(() => {
            handleSpeakCurrentDare(PARTY_DARES[finalIdx]);
          }, 450);
        }
      }
    }, 90);
  };

  const handleCloseModal = () => {
    speech.stop();
    onClose();
  };

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (!newState) {
      speech.stop();
      setIsSpeaking(false);
    } else {
      sounds.playClick();
    }
  };

  const activeDare = PARTY_DARES[currentDareIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface-container border-4 border-surface-container-lowest rounded-3xl p-5 sm:p-6 brutal-shadow-lg max-h-[92vh] overflow-y-auto no-scrollbar text-center space-y-4">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-white border-2 border-surface-container-lowest rounded-full [box-shadow:2px_2px_0px_#0d0e12] font-syne text-[11px] font-extrabold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 animate-bounce" />
              <span>SAZAA ROULETTE • DESI DARE</span>
            </div>

            {/* Indian Voice Audio Toggle */}
            <button
              onClick={toggleVoice}
              title={voiceEnabled ? "Mute Voice Narration" : "Enable Indian Voice"}
              className={`px-2 py-1 rounded-full border-2 border-surface-container-lowest font-syne text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                voiceEnabled ? "bg-[#c3f400] text-black" : "bg-surface-container-high text-outline"
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>{voiceEnabled ? "VOICE ON" : "VOICE OFF"}</span>
            </button>
          </div>

          <h2 className="font-syne text-xl sm:text-2xl font-extrabold uppercase text-primary tracking-tight mt-1">
            PUNISHMENT FOR {punishedPlayer ? punishedPlayer.name.toUpperCase() : "THE GUILTY"}!
          </h2>
          <p className="text-xs text-on-surface-variant font-medium">
            Spin the wheel & complete the dare or pay 50k imaginary aura points! 💀
          </p>
        </div>

        {/* Dare Card Display */}
        <div className={`w-full p-4 sm:p-5 rounded-2xl border-4 border-surface-container-lowest bg-surface-container-lowest text-on-surface flex flex-col items-center justify-between min-h-[210px] transition-all relative overflow-hidden ${
          isSpinning ? "opacity-75 scale-95" : "scale-100 brutal-shadow-magenta animate-in zoom-in-95"
        }`}>
          <div className="absolute top-2 right-2">
            <span className="font-syne text-[9px] font-extrabold uppercase bg-secondary-container text-white px-2 py-0.5 rounded border border-surface-container-lowest">
              {activeDare.difficulty}
            </span>
          </div>

          <div className="text-5xl mt-1 animate-bounce">
            {activeDare.emoji}
          </div>

          <div className="py-2.5 px-2">
            <p className="font-syne text-base font-extrabold text-primary leading-snug tracking-tight">
              "{activeDare.text}"
            </p>
          </div>

          {/* Voice Speaking Indicator / Replay Button */}
          <div className="w-full flex items-center justify-between pt-1 border-t border-surface-container-high/40">
            <button
              onClick={() => handleSpeakCurrentDare(activeDare)}
              disabled={isSpinning}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-surface-container-lowest font-syne text-[11px] font-bold transition-all ${
                isSpeaking 
                  ? "bg-secondary-container text-white animate-pulse" 
                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isSpeaking ? "text-white animate-spin" : "text-[#c3f400]"}`} />
              <span>{isSpeaking ? "BOL RAHA HAI... 🗣️" : "BOL KE SUNAO 🎙️"}</span>
            </button>

            <span className="text-[9.5px] font-syne uppercase tracking-widest text-outline font-bold">
              NO BACKING OUT! 🤝
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={isSpinning}
            onClick={spinRoulette}
            className={`w-full py-3.5 bg-gradient-to-r from-warning-orange to-secondary-container text-white font-syne text-base font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2 ${
              isSpinning ? "opacity-60 cursor-not-allowed" : "hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5"
            }`}
          >
            <Dice5 className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
            <span>{isSpinning ? "SPINNING SAZAA..." : "REROLL DARE 🎲"}</span>
          </button>

          <button
            type="button"
            onClick={handleCloseModal}
            className="w-full py-3 bg-primary-container text-on-primary font-syne text-xs font-extrabold uppercase rounded-xl brutal-border brutal-shadow-sm brutal-btn flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>I ACCEPT MY SAZAA 🫡 (CLOSE)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
