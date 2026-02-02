<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TranslationController extends Controller
{
    /**
     * Translate text from source language to target language
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function translate(Request $request)
    {
        try {
            $request->validate([
                'text' => 'required|string|max:5000',
                'source_lang' => 'sometimes|string|max:10',
                'target_lang' => 'sometimes|string|max:10',
            ]);

            $text = $request->input('text');
            $sourceLang = $request->input('source_lang', 'ja');
            $targetLang = $request->input('target_lang', 'en');

            // Dictionary is only valid for JA -> EN fixed phrases
            $dictionaryTranslation = null;
            if (strtolower($sourceLang) === 'ja' && strtolower($targetLang) === 'en') {
                $dictionaryTranslation = $this->checkDictionary($text);
            }

            if ($dictionaryTranslation !== null) {
                $translatedText = $dictionaryTranslation;
                Log::info('Translation from dictionary', ['text' => $text]);
            } else {
                $translatedText = $this->translateWithDeepL($text, $sourceLang, $targetLang);
                Log::info('Translation from DeepL API', ['text' => $text]);
            }

            return response()->json([
                'success' => true,
                'original_text' => $text,
                'translated_text' => $translatedText,
                'translated' => $translatedText, // For compatibility
                'source_lang' => $sourceLang,
                'target_lang' => $targetLang,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Translation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Translation failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check dictionary for exact translation match
     *
     * @param string $text
     * @return string|null
     */
    private function checkDictionary($text)
    {
        // Japanese to English dictionary
        $dictionary = [
            'こんにちは' => 'Hello',
            'ありがとう' => 'Thank you',
            'ありがとうございます' => 'Thank you very much',
            'さようなら' => 'Goodbye',
            'おはよう' => 'Good morning',
            'おはようございます' => 'Good morning',
            'こんばんは' => 'Good evening',
            'はい' => 'Yes',
            'いいえ' => 'No',
            'おやすみなさい' => 'Good night',
            'すみません' => 'Excuse me',
            'ごめんなさい' => 'I am sorry',
            'お願いします' => 'Please',
            'いただきます' => 'Let\'s eat',
            'ごちそうさまでした' => 'Thank you for the meal',
            'これはペンです' => 'This is a pen',
            'これはペンです。' => 'This is a pen.',
            '私は学生です' => 'I am a student',
            '私は学生です。' => 'I am a student.',
            '今日はいい天気ですね' => 'It\'s nice weather today',
            '元気ですか' => 'How are you?',
            '元気ですか？' => 'How are you?',
            'お元気ですか' => 'How are you?',
            'お元気ですか？' => 'How are you?',
        ];

        $normalizedText = trim($text);
        
        return $dictionary[$normalizedText] ?? null;
    }

    /**
     * Translate text using DeepL API
     *
     * @param string $text
     * @param string $sourceLang
     * @param string $targetLang
     * @return string
     * @throws \Exception
     */
    private function translateWithDeepL($text, $sourceLang, $targetLang)
    {
        $apiKey = env('DEEPL_API_KEY');
        $apiUrl = env('DEEPL_API_URL', 'https://api-free.deepl.com/v2/translate');

        if (empty($apiKey) || $apiKey === 'your_deepl_api_key_here') {
            throw new \Exception('DeepL API key is not configured. Please set DEEPL_API_KEY in .env file');
        }

        // DeepL language codes (convert if needed)
        $deeplSourceLang = $this->convertToDeepLLangCode($sourceLang);
        $deeplTargetLang = $this->convertToDeepLLangCode($targetLang);

        try {
            // DeepL: 2025/11以降、auth_keyのフォーム送信は廃止。ヘッダー認証を使用。
            $response = Http::timeout(10)
                ->withHeaders([
                    'Authorization' => 'DeepL-Auth-Key ' . $apiKey,
                ])
                ->asForm()
                ->post($apiUrl, [
                    'text' => $text,
                    'source_lang' => strtoupper($deeplSourceLang),
                    'target_lang' => strtoupper($deeplTargetLang),
                ]);

            if ($response->failed()) {
                Log::error('DeepL API error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('DeepL API request failed: ' . $response->body());
            }

            $data = $response->json();

            if (!isset($data['translations'][0]['text'])) {
                throw new \Exception('Invalid response from DeepL API');
            }

            return $data['translations'][0]['text'];
        } catch (\Illuminate\Http\Client\RequestException $e) {
            Log::error('DeepL HTTP request error: ' . $e->getMessage());
            throw new \Exception('Failed to connect to DeepL API: ' . $e->getMessage());
        }
    }

    /**
     * Convert language code to DeepL format
     *
     * @param string $langCode
     * @return string
     */
    private function convertToDeepLLangCode($langCode)
    {
        $mapping = [
            'ja' => 'JA',
            'en' => 'EN',
            'zh' => 'ZH',
            'de' => 'DE',
            'fr' => 'FR',
            'es' => 'ES',
            'it' => 'IT',
            'pt' => 'PT',
            'ru' => 'RU',
            'ko' => 'KO',
        ];

        $normalizedCode = strtolower(substr($langCode, 0, 2));
        
        return $mapping[$normalizedCode] ?? 'EN';
    }

    /**
     * Text-to-speech conversion
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function textToSpeech(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:5000',
            'lang' => 'required|string|max:10',
        ]);

        $text = $request->input('text');
        $lang = $request->input('lang');

        // For now, return success - frontend will use Web Speech API
        // You can integrate with Google Cloud Text-to-Speech API here if needed
        
        return response()->json([
            'success' => true,
            'message' => 'Text-to-speech will be handled by browser',
            'text' => $text,
            'lang' => $lang,
        ]);
    }
}
