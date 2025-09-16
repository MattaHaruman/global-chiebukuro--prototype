// DeepL API client for automatic translation
import axios from 'axios'

const DEEPL_API_BASE_URL = 'https://api-free.deepl.com/v2'

interface TranslationResponse {
  translations: Array<{
    detected_source_language?: string
    text: string
  }>
}

interface TranslateOptions {
  targetLang: string
  sourceLang?: string
}

export class TranslationClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async translateText(text: string, options: TranslateOptions): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_deepl_api_key') {
      // Return original text if no API key is configured
      return text
    }

    try {
      const params = new URLSearchParams({
        auth_key: this.apiKey,
        text: text,
        target_lang: options.targetLang.toUpperCase(),
      })

      if (options.sourceLang) {
        params.append('source_lang', options.sourceLang.toUpperCase())
      }

      const response = await axios.post<TranslationResponse>(
        `${DEEPL_API_BASE_URL}/translate`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data.translations[0]?.text || text
    } catch (error) {
      console.error('Translation error:', error)
      return text // Return original text on error
    }
  }
}

// Supported language mappings
export const LANGUAGE_MAPPINGS: Record<string, string> = {
  'ja': 'JA',
  'en': 'EN-US',
  'zh': 'ZH',
  'ko': 'KO',
  'es': 'ES',
  'fr': 'FR',
  'de': 'DE',
  'it': 'IT',
  'pt': 'PT-BR',
  'ru': 'RU',
}

// Detect browser language and map to DeepL format
export function detectTargetLanguage(): string {
  if (typeof window === 'undefined') {
    return 'EN-US' // Default for server-side
  }

  const browserLang = navigator.language.split('-')[0].toLowerCase()
  return LANGUAGE_MAPPINGS[browserLang] || 'EN-US'
}

// Helper function to determine if translation is needed
export function needsTranslation(contentLang: string, targetLang: string): boolean {
  const normalizedContent = contentLang.toUpperCase()
  const normalizedTarget = targetLang.toUpperCase()
  
  // Don't translate if same language or target is Japanese (original)
  return normalizedContent !== normalizedTarget && normalizedTarget !== 'JA'
}

// Create singleton instance
export const translationClient = new TranslationClient(process.env.DEEPL_API_KEY || '')