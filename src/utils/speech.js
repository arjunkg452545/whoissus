// Indian Voice Text-to-Speech (TTS) Service using native browser Web Speech API

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.voices = [];
    this.preferredVoice = null;
    this.enabled = true;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      this.preferredVoice = this.findIndianVoice(this.voices);
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  // Detect Indian voices (Hindi or Indian English)
  findIndianVoice(voices) {
    if (!voices || voices.length === 0) return null;

    // 1. Check for Hindi (hi-IN)
    const hindiVoice = voices.find(v => 
      v.lang?.toLowerCase().includes('hi-in') || 
      v.name?.toLowerCase().includes('hindi') || 
      v.name?.toLowerCase().includes('lekha') ||
      v.name?.toLowerCase().includes('swara')
    );
    if (hindiVoice) return hindiVoice;

    // 2. Check for Indian English (en-IN)
    const indianEnglish = voices.find(v => 
      v.lang?.toLowerCase().includes('en-in') || 
      v.name?.toLowerCase().includes('india') ||
      v.name?.toLowerCase().includes('rishi') ||
      v.name?.toLowerCase().includes('neerja') ||
      v.name?.toLowerCase().includes('madhav')
    );
    if (indianEnglish) return indianEnglish;

    // 3. Fallback to English (en-US / en-GB)
    return voices.find(v => v.lang?.toLowerCase().startsWith('en')) || voices[0];
  }

  // Strip emojis and punctuation artifacts for clean pronunciation
  cleanText(text) {
    if (!text) return '';
    return text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2388}\u{2B05}-\u{2B07}\u{2934}\u{2935}\u{1F004}\u{1F0CF}\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/["'“”‘’]/g, '')
      .replace(/[!]+/g, '.')
      .replace(/\s+/g, ' ')
      .trim();
  }

  speakDare({ playerName, dareText, ttsText, onStart, onEnd }) {
    if (!this.synth || !this.enabled) return;

    this.stop();

    const cleanBody = ttsText || this.cleanText(dareText);
    const intro = playerName ? `${playerName} ki sazaa hai:` : 'Aapki sazaa hai:';
    const fullText = `${intro} ${cleanBody}`;

    const utterance = new SpeechSynthesisUtterance(fullText);

    // Refresh voices if empty
    if (!this.preferredVoice) {
      this.voices = this.synth.getVoices();
      this.preferredVoice = this.findIndianVoice(this.voices);
    }

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    // Natural energetic conversational speed and pitch
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('TTS playback error:', err);
      if (onEnd) onEnd();
    }
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }

  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stop();
    return this.enabled;
  }
}

export const speech = new SpeechService();
