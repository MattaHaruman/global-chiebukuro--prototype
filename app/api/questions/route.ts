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
        answers:Answer(id)
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
    console.log('Session:', session)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Request body:', body)
    const validatedData = createQuestionSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Ensure user exists in database before creating question
    console.log('Checking if user exists in database:', session.user.id)
    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!existingUser) {
      console.log('User not found, creating user:', session.user)
      const { error: userError } = await supabase
        .from('User')
        .insert({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        })

      if (userError) {
        console.error('Error creating user:', userError)
        throw new Error('Failed to create user')
      }
      console.log('User created successfully')
    } else {
      console.log('User already exists in database')
    }

    // Insert question directly - RLS needs to be configured properly in Supabase
    console.log('Inserting question with userId:', session.user.id)
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
      console.error('Supabase error details:', questionError)
      console.error('Error code:', questionError.code)
      console.error('Error message:', questionError.message)
      throw questionError
    }

    console.log('Question created successfully:', question)
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