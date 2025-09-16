import type { User, Question, Answer } from '@prisma/client'

export type QuestionWithUser = Question & {
  user: User
  answers: AnswerWithUser[]
  _count: {
    answers: number
  }
}

export type AnswerWithUser = Answer & {
  user: User
}

export type CreateQuestionData = {
  title: string
  body: string
}

export type CreateAnswerData = {
  body: string
}