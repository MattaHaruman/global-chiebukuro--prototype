import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

// Schema for creating a question
const createQuestionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  body: z.string().min(1, 'Body is required').max(10000, 'Body must be less than 10000 characters'),
})

// GET /api/questions - Get all questions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const { data: questions, error: questionsError } = await supabase
      .from('Question')
      .select(`
        *,
        user:User(id, name, image),
        answers:Answer(count)
      `)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (questionsError) {
      throw questionsError
    }

    const { count: totalQuestions } = await supabase
      .from('Question')
      .select('*', { count: 'exact', head: true })

    const totalPages = Math.ceil((totalQuestions || 0) / limit)

    return NextResponse.json({
      questions: questions || [],
      pagination: {
        page,
        limit,
        totalPages,
        totalQuestions: totalQuestions || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

// POST /api/questions - Create a new question
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createQuestionSchema.parse(body)

    const { data: question, error: questionError } = await supabase
      .from('Question')
      .insert({
        title: validatedData.title,
        body: validatedData.body,
        userId: session.user.id,
      })
      .select(`
        *,
        user:User(id, name, image)
      `)
      .single()

    if (questionError) {
      throw questionError
    }

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}