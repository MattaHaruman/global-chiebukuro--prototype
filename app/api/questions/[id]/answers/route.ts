import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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
    const questionExists = await prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true },
    })

    if (!questionExists) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    const answer = await prisma.answer.create({
      data: {
        body: validatedData.body,
        questionId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

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