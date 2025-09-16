'use client'

import { useState, useEffect } from 'react'
import { detectTargetLanguage, needsTranslation } from '@/lib/translation'

interface TranslatedContent {
  original: string
  translated: string
  isTranslated: boolean
  isLoading: boolean
}

export function useTranslation(originalText: string, contentLang: string = 'ja'): TranslatedContent {
  const [translated, setTranslated] = useState(originalText)
  const [isLoading, setIsLoading] = useState(false)
  const [targetLang, setTargetLang] = useState<string>('')

  useEffect(() => {
    setTargetLang(detectTargetLanguage())
  }, [])

  useEffect(() => {
    async function translateContent() {
      if (!originalText || !targetLang || !needsTranslation(contentLang, targetLang)) {
        setTranslated(originalText)
        return
      }

      setIsLoading(true)
      
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: originalText,
            targetLang: targetLang,
            sourceLang: contentLang,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setTranslated(data.translatedText || originalText)
        } else {
          setTranslated(originalText)
        }
      } catch (error) {
        console.error('Translation failed:', error)
        setTranslated(originalText)
      } finally {
        setIsLoading(false)
      }
    }

    translateContent()
  }, [originalText, targetLang, contentLang])

  const isTranslated = needsTranslation(contentLang, targetLang) && translated !== originalText

  return {
    original: originalText,
    translated,
    isTranslated,
    isLoading,
  }
}