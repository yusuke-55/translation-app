import { useState, useRef } from 'react';

export interface UseSpeechSynthesisReturn {
  speak: (text: string, lang?: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  error: string | null;
}

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if browser supports Web Speech Synthesis API
  const isSupported = 'speechSynthesis' in window;

  const speak = (text: string, lang: string = 'en-US') => {
    if (!isSupported) {
      setError('お使いのブラウザは音声合成に対応していません');
      return;
    }

    if (!text.trim()) {
      return;
    }

    try {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      // Wait for voices to load
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        console.warn('音声がまだ読み込まれていません');
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Speaking rate (0.1 to 10)
      utterance.pitch = 1; // Voice pitch (0 to 2)
      utterance.volume = 1; // Volume (0 to 1)

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event.error);
        // Don't show error to user, just log it
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Failed to speak:', err);
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    error,
  };
};
