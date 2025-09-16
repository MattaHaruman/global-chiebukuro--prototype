import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/questions/[id] - Get a specific question with answers
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    const { data: question, error: questionError } = await supabase
      .from('Question')
      .select(`
        *,
        user:User(id, name, image),
        answers:Answer(
          *,
          user:User(id, name, image)
        )
      `)
      .eq('id', id)
      .single()

    if (questionError || !question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    )
  }
}