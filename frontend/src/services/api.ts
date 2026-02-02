import axios from 'axios';

// Vercel/Cloudflare/Nginx配下では同一オリジンの `/api` を叩くのが安全
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
}

export interface TranslationResponse {
  success: boolean;
  original_text: string;
  translated_text: string;
  source_lang: string;
  target_lang: string;
}

export const translationService = {
  // Translate text
  translate: async (data: TranslationRequest): Promise<TranslationResponse> => {
    try {
      const response = await api.post<TranslationResponse>('/translate', data);
      return response.data;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  },
};

export default api;
