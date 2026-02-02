// Vercel Serverless Function: /api/translate
// - Set env: DEEPL_API_KEY (required)
// - Optional: DEEPL_API_URL (default: https://api-free.deepl.com/v2/translate)

const DEFAULT_DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

function toDeepLLang(code) {
  if (!code) return undefined;
  const normalized = String(code).toLowerCase().slice(0, 2);
  const mapping = {
    ja: 'JA',
    en: 'EN',
    zh: 'ZH',
    de: 'DE',
    fr: 'FR',
    es: 'ES',
    it: 'IT',
    pt: 'PT',
    ru: 'RU',
    ko: 'KO',
  };
  return mapping[normalized] || normalized.toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL || DEFAULT_DEEPL_API_URL;

  if (!apiKey) {
    res.status(500).json({ success: false, message: 'DEEPL_API_KEY is not configured' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ success: false, message: 'Invalid JSON body' });
    return;
  }

  const text = body?.text;
  const sourceLang = body?.source_lang;
  const targetLang = body?.target_lang;

  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(422).json({ success: false, message: 'text is required' });
    return;
  }
  if (!targetLang || typeof targetLang !== 'string') {
    res.status(422).json({ success: false, message: 'target_lang is required' });
    return;
  }

  const deeplSource = toDeepLLang(sourceLang);
  const deeplTarget = toDeepLLang(targetLang);

  const params = new URLSearchParams();
  params.set('text', text);
  params.set('target_lang', deeplTarget);
  if (deeplSource) {
    // If omitted, DeepL auto-detects the source language
    params.set('source_lang', deeplSource);
  }

  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const raw = await resp.text();

    if (!resp.ok) {
      res.status(resp.status).json({
        success: false,
        message: 'DeepL API request failed',
        status: resp.status,
        body: raw,
      });
      return;
    }

    const data = JSON.parse(raw);
    const translatedText = data?.translations?.[0]?.text;

    if (!translatedText) {
      res.status(502).json({ success: false, message: 'Invalid DeepL response', body: data });
      return;
    }

    res.status(200).json({
      success: true,
      original_text: text,
      translated_text: translatedText,
      translated: translatedText,
      source_lang: sourceLang || '',
      target_lang: targetLang,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Translation failed', error: String(e?.message || e) });
  }
}
