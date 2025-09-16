import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

interface RouteParams {
  params: {
    id: string
  }
}

// Schema for creating an answer
const createAnswerSchema = z.object({
  body: z.string().min(1, 'Answer body is required').max(10000, 'Answer must be less than 10000 characters'),
})

// POST /api/questions/[id]/answers - Create a new answer for a question
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id: questionId } = params
    const body = await request.json()
    const validatedData = createAnswerSchema.parse(body)

    // Check if question exists
    const { data: questionExists } = await supabase
      .from('Question')
      .select('id')
      .eq('id', questionId)
      .single()

    if (!questionExists) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Ensure user exists in database (same logic as question creation)
    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!existingUser) {
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
    }

    const { data: answer, error: answerError } = await supabase
      .from('Answer')
      .insert({
        body: validatedData.body,
        questionId,
        userId: session.user.id,
      })
      .select(`
        *,
        user:User(id, name, image)
      `)
      .single()

    if (answerError) {
      throw answerError
    }

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating answer:', error)
    return NextResponse.json(
      { error: 'Failed to create answer' },
      { status: 500 }
    )
  }
}