import { useState, useEffect, useRef } from 'react';
import { translationService } from './services/api';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import './App.css';

interface LanguageConfig {
  code: string;
  name: string;
  speechCode: string;
}

const LANGUAGES: Record<string, LanguageConfig> = {
  ja: { code: 'ja', name: '日本語', speechCode: 'ja-JP' },
  en: { code: 'en', name: '英語', speechCode: 'en-US' },
  de: { code: 'de', name: 'ドイツ語', speechCode: 'de-DE' },
  fr: { code: 'fr', name: 'フランス語', speechCode: 'fr-FR' },
  es: { code: 'es', name: 'スペイン語', speechCode: 'es-ES' },
  it: { code: 'it', name: 'イタリア語', speechCode: 'it-IT' },
  pt: { code: 'pt', name: 'ポルトガル語', speechCode: 'pt-PT' },
  ru: { code: 'ru', name: 'ロシア語', speechCode: 'ru-RU' },
  ko: { code: 'ko', name: '韓国語', speechCode: 'ko-KR' },
  zh: { code: 'zh', name: '中国語', speechCode: 'zh-CN' },
};

const LANGUAGE_OPTIONS = Object.values(LANGUAGES);

const AUTO_SPEAK_DELAY_MS = 700;
const INPUT_IDLE_MS = 900;

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLang, setSourceLang] = useState<keyof typeof LANGUAGES>('ja');
  const [targetLang, setTargetLang] = useState<keyof typeof LANGUAGES>('en');
  const [error, setError] = useState<string | null>(null);
  const lastInputChangeAtRef = useRef<number>(Date.now());
  const translateRequestIdRef = useRef<number>(0);
  const pendingAutoSpeakTimerRef = useRef<number | null>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechRecognitionSupported,
    error: speechRecognitionError,
  } = useSpeechRecognition(LANGUAGES[sourceLang].speechCode);

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: isSpeechSynthesisSupported,
  } = useSpeechSynthesis();

  // Update input text when transcript changes
  useEffect(() => {
    if (transcript) {
      lastInputChangeAtRef.current = Date.now();
      setInputText(transcript);
    }
  }, [transcript]);

  // Cancel any pending auto-speak while listening / changing input
  useEffect(() => {
    if (isListening && pendingAutoSpeakTimerRef.current !== null) {
      window.clearTimeout(pendingAutoSpeakTimerRef.current);
      pendingAutoSpeakTimerRef.current = null;
    }
  }, [isListening]);

  // Auto-translate when input text changes (with debounce)
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    const timeoutId = setTimeout(() => {
      handleTranslate(inputText);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [inputText, sourceLang, targetLang]);

  const handleSwapLanguages = () => {
    const nextSource = targetLang;
    const nextTarget = sourceLang;
    setSourceLang(nextSource);
    setTargetLang(nextTarget);
    stopListening();
    stopSpeaking();
  };

  const handleSetSourceLang = (lang: keyof typeof LANGUAGES) => {
    stopListening();
    stopSpeaking();
    setSourceLang(lang);
  };

  const handleSetTargetLang = (lang: keyof typeof LANGUAGES) => {
    stopListening();
    stopSpeaking();
    setTargetLang(lang);
  };

  const handleTranslate = async (text: string) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    setError(null);

    translateRequestIdRef.current += 1;
    const requestId = translateRequestIdRef.current;

    try {
      const result = await translationService.translate({
        text: text,
        source_lang: sourceLang,
        target_lang: targetLang,
      });

      // Ignore out-of-order responses
      if (requestId !== translateRequestIdRef.current) {
        return;
      }

      setTranslatedText(result.translated_text);

      // Auto-speak after translation completes, but only when input has settled.
      if (pendingAutoSpeakTimerRef.current !== null) {
        window.clearTimeout(pendingAutoSpeakTimerRef.current);
      }
      pendingAutoSpeakTimerRef.current = window.setTimeout(() => {
        pendingAutoSpeakTimerRef.current = null;

        // If a newer translation started, or we're still listening, do not auto-speak.
        if (requestId !== translateRequestIdRef.current) return;
        if (isListening) return;
        if (isSpeaking) return;

        const idleMs = Date.now() - lastInputChangeAtRef.current;
        if (idleMs < INPUT_IDLE_MS) {
          // User is still typing / input is still updating.
          return;
        }

        speak(result.translated_text, LANGUAGES[targetLang].speechCode);
      }, AUTO_SPEAK_DELAY_MS);
    } catch (err) {
      setError('翻訳に失敗しました');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      resetTranscript();
      setInputText('');
      lastInputChangeAtRef.current = Date.now();
      startListening();
    }
  };

  const handleSpeakTranslation = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (translatedText) {
      // Stop listening while speaking to avoid audio feedback
      if (isListening) {
        stopListening();
      }
      speak(translatedText, LANGUAGES[targetLang].speechCode);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    resetTranscript();
    setError(null);
    if (pendingAutoSpeakTimerRef.current !== null) {
      window.clearTimeout(pendingAutoSpeakTimerRef.current);
      pendingAutoSpeakTimerRef.current = null;
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>リアルタイム翻訳</h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={sourceLang}
              onChange={(e) => handleSetSourceLang(e.target.value as keyof typeof LANGUAGES)}
              style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.45)', fontSize: 14 }}
              aria-label="翻訳元言語"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              className="lang-toggle"
              onClick={handleSwapLanguages}
              style={{ minWidth: 90 }}
              title="言語を入れ替え"
            >
              ⇄ 入れ替え
            </button>

            <select
              value={targetLang}
              onChange={(e) => handleSetTargetLang(e.target.value as keyof typeof LANGUAGES)}
              style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.45)', fontSize: 14 }}
              aria-label="翻訳先言語"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <p className="subtitle">
            {LANGUAGES[sourceLang].name} → {LANGUAGES[targetLang].name}
          </p>
        </header>

        {(error || speechRecognitionError) && (
          <div className="error-banner">
            {error || speechRecognitionError}
          </div>
        )}

        <main className="main-content">
          {/* Input Section */}
          <section className="input-section">
            <div className="section-header">
              <h2>{LANGUAGES[sourceLang].name}</h2>
              {!isSpeechRecognitionSupported && (
                <span className="warning">音声認識非対応</span>
              )}
            </div>

            <div className="input-container">
              <textarea
                className="text-input"
                value={inputText}
                onChange={(e) => {
                  lastInputChangeAtRef.current = Date.now();
                  setInputText(e.target.value);
                }}
                placeholder="ここに入力するか、マイクボタンで話してください..."
                rows={6}
              />

              <div className="input-controls">
                <button
                  className={`mic-button ${isListening ? 'listening' : ''}`}
                  onClick={handleMicClick}
                  disabled={!isSpeechRecognitionSupported}
                  title={isListening ? '録音停止' : '録音開始'}
                >
                  {isListening ? '⏸停止' : 'マイク'}
                </button>

                <button
                  className="clear-button"
                  onClick={handleClear}
                  title="クリア"
                >
                  クリア
                </button>
              </div>
            </div>
          </section>

          {/* Translation Indicator */}
          {isTranslating && (
            <div className="translation-indicator">
              <div className="spinner"></div>
              <span>翻訳中...</span>
            </div>
          )}

          {/* Output Section */}
          <section className="output-section">
            <div className="section-header">
              <h2>{LANGUAGES[targetLang].name}</h2>
              {!isSpeechSynthesisSupported && (
                <span className="warning">音声再生非対応</span>
              )}
            </div>

            <div className="output-container">
              <div className="text-output">
                {translatedText || (
                  <span className="placeholder">翻訳結果がここに表示されます</span>
                )}
              </div>

              {translatedText && (
                <div className="output-controls">
                  <button
                    className={`speak-button ${isSpeaking ? 'speaking' : ''}`}
                    onClick={handleSpeakTranslation}
                    disabled={!isSpeechSynthesisSupported}
                    title={isSpeaking ? '停止' : '音声で読み上げ'}
                  >
                    {isSpeaking ? '⏸停止' : '再生'}
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="app-footer">
          <p>音声入力とリアルタイム翻訳を体験してください</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
