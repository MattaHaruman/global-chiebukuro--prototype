// Database types (matching Supabase structure)
export type User = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  createdAt: string
  updatedAt: string
}

export type Question = {
  id: string
  title: string
  body: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type Answer = {
  id: string
  body: string
  questionId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type QuestionWithUser = Question & {
  user: User
  answers?: AnswerWithUser[]
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