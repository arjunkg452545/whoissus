import React, { useRef } from 'react';
import { X, Download, Share2, ShieldAlert, Check } from 'lucide-react';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function FIRReportModal({
  isOpen,
  onClose,
  accusedPlayer,
  players,
  imposterIndices,
  secretWordData,
  auraOutcome
}) {
  if (!isOpen || !accusedPlayer) return null;

  const isSusCaught = imposterIndices?.some(idx => players[idx]?.id === accusedPlayer?.id);
  const categoryName = secretWordData?.categoryName || "DESI DRAMA";
  const fileId = `#SUS-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleDownloadImage = () => {
    sounds.playClick();
    triggerHaptic('success');

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = "#0d0e12";
    ctx.fillRect(0, 0, 600, 800);

    // Outer Brutal Border
    ctx.strokeStyle = "#c3f400";
    ctx.lineWidth = 12;
    ctx.strokeRect(16, 16, 568, 768);

    // Inner Header Card
    ctx.fillStyle = isSusCaught ? "#ff4a8d" : "#c3f400";
    ctx.fillRect(28, 28, 544, 90);
    ctx.strokeStyle = "#0d0e12";
    ctx.lineWidth = 6;
    ctx.strokeRect(28, 28, 544, 90);

    ctx.fillStyle = "#0d0e12";
    ctx.font = "bold 32px 'Syne', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🚨 ARREST WARRANT / FIR", 300, 70);
    ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`DOSSIER ${fileId} • ${dateStr}`, 300, 100);

    // Avatar Circle / Box
    ctx.fillStyle = "#1f1f24";
    ctx.fillRect(180, 140, 240, 210);
    ctx.strokeStyle = "#0d0e12";
    ctx.lineWidth = 8;
    ctx.strokeRect(180, 140, 240, 210);

    ctx.font = "100px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(accusedPlayer.emoji, 300, 280);

    // Suspect Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'Syne', sans-serif";
    ctx.fillText(accusedPlayer.name.toUpperCase(), 300, 395);

    // Verdict Badge
    ctx.fillStyle = isSusCaught ? "#ff4a8d" : "#c3f400";
    ctx.fillRect(100, 420, 400, 50);
    ctx.strokeStyle = "#0d0e12";
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 420, 400, 50);

    ctx.fillStyle = "#0d0e12";
    ctx.font = "bold 22px 'Syne', sans-serif";
    ctx.fillText(isSusCaught ? "CAUGHT RED HANDED! 🎯" : "WRONGFULLY ACCUSED! 😱", 300, 453);

    // Aura Rating Badge on Canvas
    ctx.fillStyle = auraOutcome?.status === 'positive' ? "#c3f400" : "#ff4a8d";
    ctx.font = "bold 22px 'Syne', sans-serif";
    ctx.fillText(auraOutcome?.title || "AURA: -10,000 💀 BRO IS COOKED", 300, 505);

    // Crime Details
    ctx.fillStyle = "#1a1b20";
    ctx.fillRect(40, 530, 520, 150);
    ctx.strokeStyle = "#292a2e";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 530, 520, 150);

    ctx.fillStyle = "#c4c9ac";
    ctx.font = "16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`CATEGORY: ${categoryName.toUpperCase()}`, 300, 565);
    ctx.fillStyle = "#c3f400";
    ctx.font = "bold 24px 'Syne', sans-serif";
    ctx.fillText(`SECRET WORD: "${secretWordData.word}"`, 300, 605);
    ctx.fillStyle = "#e3e2e8";
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(isSusCaught ? "Crime: Master of Bluffing without the word!" : "Verdict: Innocent Civilian sacrificed by friends!", 300, 645);

    // Watermark
    ctx.fillStyle = "#8e9379";
    ctx.font = "bold 15px 'Syne', sans-serif";
    ctx.fillText("PLAY AT: WHOISSUS.VERCEL.APP 👀", 300, 740);

    const link = document.createElement('a');
    link.download = `who-is-sus-${accusedPlayer.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    sounds.playClick();
    triggerHaptic('light');
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Who is Sus? Arrest Report",
          text: `🚨 ${accusedPlayer.name} was ${isSusCaught ? 'CAUGHT RED HANDED' : 'falsely accused'} in 'Who is Sus?'! Aura: ${auraOutcome?.title || 'BRO IS COOKED'}! Play with friends:`,
          url: "https://whoissus.vercel.app"
        });
      } catch (err) {}
    } else {
      navigator.clipboard?.writeText(`🚨 ${accusedPlayer.name} was accused in 'Who is Sus?'! Aura: ${auraOutcome?.title || 'BRO IS COOKED'}! Play here: https://whoissus.vercel.app`);
      alert("Link copied! Share it on WhatsApp or Instagram Stories!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm bg-surface-container border-4 border-surface-container-lowest rounded-3xl p-5 brutal-shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-surface-container-lowest pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-secondary-container text-white rounded brutal-border">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="font-syne text-sm font-extrabold text-primary uppercase">
              SUSPECT DOSSIER {fileId}
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-surface-container-lowest text-white flex items-center justify-center text-xs font-bold hover:bg-error"
          >
            ✕
          </button>
        </div>

        {/* Story Card Preview Frame */}
        <div className="mt-4 p-4 rounded-2xl bg-surface-container-lowest border-3 border-surface-container-lowest text-center flex flex-col items-center gap-2 relative overflow-hidden brutal-shadow">
          <span className="font-syne text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary-container text-on-primary">
            STORY PREVIEW • 9:16 FORMAT
          </span>

          <div className="w-20 h-20 rounded-2xl bg-surface-container-high border-3 border-surface-container-lowest flex items-center justify-center text-4xl brutal-shadow-sm mt-1">
            {accusedPlayer.emoji}
          </div>

          <h3 className="font-syne text-xl font-extrabold uppercase text-white">
            {accusedPlayer.name}
          </h3>

          <div className={`px-3 py-1 rounded-full font-syne text-xs font-extrabold uppercase border-2 border-surface-container-lowest ${
            isSusCaught ? "bg-secondary-container text-white" : "bg-primary-container text-on-primary"
          }`}>
            {isSusCaught ? "GUILTY / BUSTED 🎯" : "FALSELY ACCUSED 😱"}
          </div>

          {/* Aura Score Stamp */}
          <div className="w-full bg-surface-container-low border border-surface-container-lowest p-2 rounded-xl text-center">
            <span className="font-syne text-xs font-extrabold text-primary-container block">
              {auraOutcome?.title || "AURA: -10,000 💀 BRO IS COOKED"}
            </span>
          </div>

          <p className="text-[11px] text-on-surface-variant italic">
            Secret Word: "{secretWordData.word}" ({categoryName})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleDownloadImage}
            className="w-full py-3.5 bg-primary-container text-on-primary font-syne text-sm font-extrabold uppercase rounded-xl brutal-border brutal-shadow brutal-btn flex items-center justify-center gap-2 hover:bg-[#b0dc00]"
          >
            <Download className="w-4 h-4" />
            <span>SAVE IMAGE FOR STORY 📥</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full py-3 bg-surface-container-high text-on-surface font-syne text-xs font-bold uppercase rounded-xl brutal-border brutal-shadow-sm brutal-btn flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE TO WHATSAPP / INSTA 📲</span>
          </button>
        </div>
      </div>
    </div>
  );
}
