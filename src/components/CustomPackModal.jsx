import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, FolderPlus } from 'lucide-react';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function CustomPackModal({ isOpen, onClose, onSaveCustomPack }) {
  const [packName, setPackName] = useState('');
  const [emoji, setEmoji] = useState('🔥');
  const [words, setWords] = useState(['', '', '']);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddWordField = () => {
    sounds.playClick();
    if (words.length >= 15) return;
    setWords([...words, '']);
  };

  const handleWordChange = (idx, val) => {
    const next = [...words];
    next[idx] = val;
    setWords(next);
  };

  const handleRemoveWord = (idx) => {
    sounds.playClick();
    if (words.length <= 2) return;
    setWords(words.filter((_, i) => i !== idx));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!packName.trim()) {
      setError('Please enter a pack name!');
      sounds.playBuzzer();
      return;
    }
    const filteredWords = words.map(w => w.trim()).filter(Boolean);
    if (filteredWords.length < 3) {
      setError('Add at least 3 secret words!');
      sounds.playBuzzer();
      return;
    }

    const newCategory = {
      id: `custom-${Date.now()}`,
      name: packName.trim(),
      emoji: emoji || '🎯',
      badge: 'CUSTOM PARTY PACK',
      color: 'bg-[#fbcfe8]',
      accent: '#ff4a8d',
      words: filteredWords.map((w, i) => ({
        word: w.toUpperCase(),
        undercoverWord: filteredWords[(i + 1) % filteredWords.length].toUpperCase(),
        hint: `Custom word from ${packName}`,
        decoys: filteredWords.filter(other => other !== w).slice(0, 3).map(o => o.toUpperCase())
      }))
    };

    sounds.playVictory();
    triggerHaptic('success');
    onSaveCustomPack(newCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-surface-container border-4 border-surface-container-lowest rounded-3xl p-5 brutal-shadow-lg max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between border-b-2 border-surface-container-lowest pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-primary-container text-on-primary rounded-lg brutal-border">
              <FolderPlus className="w-5 h-5" />
            </span>
            <h2 className="font-syne text-lg font-extrabold uppercase text-primary">
              CREATE CUSTOM PACK ✍️
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-surface-container-lowest text-white flex items-center justify-center font-bold hover:bg-error transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 text-sm font-sans">
          {/* Pack Name & Emoji */}
          <div className="flex gap-2">
            <div className="w-16">
              <label className="text-[11px] font-syne font-bold uppercase text-outline block mb-1">EMOJI</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                className="w-full text-center text-xl bg-surface-container-lowest text-on-surface brutal-border rounded-lg p-2 focus:border-primary-container focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-syne font-bold uppercase text-outline block mb-1">PACK NAME</label>
              <input
                type="text"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                placeholder="e.g. Hostel Room Inside Jokes"
                maxLength={25}
                className="w-full bg-surface-container-lowest text-on-surface brutal-border rounded-lg p-2.5 text-sm focus:border-primary-container focus:outline-none placeholder:text-outline"
              />
            </div>
          </div>

          {/* Words List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-syne font-bold uppercase text-outline">
                SECRET WORDS (MIN 3)
              </label>
              <button
                type="button"
                onClick={handleAddWordField}
                className="text-xs text-primary-container font-syne font-extrabold uppercase flex items-center gap-0.5 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> ADD WORD
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {words.map((w, idx) => (
                <div key={idx} className="flex gap-1.5 items-center">
                  <span className="text-xs font-syne font-bold text-outline w-5 text-center">#{idx + 1}</span>
                  <input
                    type="text"
                    value={w}
                    onChange={(e) => handleWordChange(idx, e.target.value)}
                    placeholder={`Secret word #${idx + 1}...`}
                    className="flex-1 bg-surface-container-lowest text-on-surface brutal-border rounded-lg px-3 py-1.5 text-sm focus:border-primary-container focus:outline-none placeholder:text-outline"
                  />
                  {words.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWord(idx)}
                      className="w-7 h-7 rounded-lg bg-surface-container-high text-outline hover:text-error flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-secondary-container text-xs font-bold animate-bounce">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-primary-container text-on-primary font-syne font-extrabold text-sm uppercase rounded-xl brutal-border brutal-shadow brutal-btn tracking-wider"
          >
            SAVE & PLAY THIS PACK 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
