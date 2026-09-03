import React, { useRef } from 'react';
import { X, Download, Share2, ShieldAlert, Check } from 'lucide-react';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function FIRReportModal({
  isOpen,
  onClose,
  accusedPlayer,
  isSusCaught,
  secretWordData,
  categoryName
}) {
  if (!isOpen || !accusedPlayer) return null;

  const canvasRef = useRef(null);

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
    ctx.fillRect(180, 150, 240, 240);
    ctx.strokeStyle = "#0d0e12";
    ctx.lineWidth = 8;
    ctx.strokeRect(180, 150, 240, 240);

    ctx.font = "110px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(accusedPlayer.emoji, 300, 310);

    // Suspect Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px 'Syne', sans-serif";
    ctx.fillText(accusedPlayer.name.toUpperCase(), 300, 440);

    // Verdict Badge
    ctx.fillStyle = isSusCaught ? "#ff4a8d" : "#c3f400";
    ctx.fillRect(100, 470, 400, 55);
    ctx.strokeStyle = "#0d0e12";
    ctx.lineWidth = 5;
    ctx.strokeRect(100, 470, 400, 55);

    ctx.fillStyle = "#0d0e12";
    ctx.font = "bold 24px 'Syne', sans-serif";
    ctx.fillText(isSusCaught ? "CAUGHT RED HANDED! 🎯" : "WRONGFULLY ACCUSED! 😱", 300, 507);

    // Crime Details
    ctx.fillStyle = "#1a1b20";
    ctx.fillRect(40, 550, 520, 140);
    ctx.strokeStyle = "#292a2e";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 550, 520, 140);

    ctx.fillStyle = "#c4c9ac";
    ctx.font = "18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`CATEGORY: ${categoryName.toUpperCase()}`, 300, 590);
    ctx.fillStyle = "#c3f400";
    ctx.font = "bold 26px 'Syne', sans-serif";
    ctx.fillText(`SECRET WORD: "${secretWordData.word}"`, 300, 630);
    ctx.fillStyle = "#e3e2e8";
    ctx.font = "15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(isSusCaught ? "Crime: Master of Bluffing without the word!" : "Verdict: Innocent Civilian sacrificed by friends!", 300, 665);

    // Watermark
    ctx.fillStyle = "#8e9379";
    ctx.font = "bold 16px 'Syne', sans-serif";
    ctx.fillText("PLAY AT: WHOISSUS.VERCEL.APP 👀", 300, 745);

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
          text: `🚨 ${accusedPlayer.name} was ${isSusCaught ? 'CAUGHT RED HANDED' : 'falsely accused'} in 'Who is Sus?'! Can you spot The Sus? Play with friends:`,
          url: "https://whoissus.vercel.app"
        });
      } catch (err) {}
    } else {
      navigator.clipboard?.writeText(`🚨 ${accusedPlayer.name} was accused in 'Who is Sus?'! Play here: https://whoissus.vercel.app`);
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
            className="w-7 h-7 rounded-full bg-surface-container-lowest text-white flex items-center justify-center font-bold hover:bg-error transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="my-4 p-4 rounded-2xl bg-[#121317] border-3 border-surface-container-lowest brutal-shadow text-center relative overflow-hidden">
          <div className="inline-block px-2.5 py-0.5 rounded bg-secondary-container text-white font-syne text-[10px] font-extrabold uppercase mb-2">
            {isSusCaught ? "🚨 ARREST REPORT" : "⚠️ WRONG CONVICTION"}
          </div>

          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl border-3 border-surface-container-lowest ${accusedPlayer.bgColor} brutal-shadow-sm my-2`}>
            {accusedPlayer.emoji}
          </div>

          <h3 className="font-syne text-xl font-extrabold text-white uppercase">
            {accusedPlayer.name}
          </h3>

          <div className="mt-2 py-1 px-2 rounded-lg bg-surface-container-lowest border border-surface-container-high text-xs">
            <span className="text-outline text-[10px] block font-bold">SECRET TOPIC</span>
            <span className="text-primary-container font-syne font-extrabold">
              "{secretWordData.word}"
            </span>
          </div>

          <p className="text-[11px] text-on-surface-variant mt-2 italic">
            {isSusCaught ? "Busted by the squad for acting too suspicious!" : "Was an innocent civilian all along!"}
          </p>

          <div className="mt-3 pt-2 border-t border-surface-container-high text-[10px] text-outline font-syne font-bold uppercase">
            whoissus.vercel.app 👀
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleDownloadImage}
            className="py-3 px-2 bg-primary-container text-on-primary font-syne text-xs font-extrabold uppercase rounded-xl brutal-border brutal-shadow-sm brutal-btn flex items-center justify-center gap-1.5 hover:bg-[#b0dc00]"
          >
            <Download className="w-4 h-4" />
            <span>SAVE CARD 📥</span>
          </button>
          <button
            onClick={handleShare}
            className="py-3 px-2 bg-secondary-container text-white font-syne text-xs font-extrabold uppercase rounded-xl brutal-border brutal-shadow-sm brutal-btn flex items-center justify-center gap-1.5 hover:bg-[#e03b7b]"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE 📲</span>
          </button>
        </div>
      </div>
    </div>
  );
}
