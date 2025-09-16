import { NextRequest, NextResponse } from 'next/server'
import { translationClient } from '@/lib/translation'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (!targetLang) {
      return NextResponse.json(
        { error: 'Target language is required' },
        { status: 400 }
      )
    }

    const translatedText = await translationClient.translateText(text, {
      targetLang,
      sourceLang,
    })

    return NextResponse.json({
      translatedText,
      originalText: text,
      targetLang,
      sourceLang,
    })

  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}