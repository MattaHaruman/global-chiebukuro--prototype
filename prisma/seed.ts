import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: '田中太郎',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: '佐藤花子',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612db47?w=32&h=32&fit=crop&crop=face'
    }
  })

  // Create sample questions
  const question1 = await prisma.question.create({
    data: {
      title: 'Next.jsでAPIルートを作成する方法を教えてください',
      body: 'Next.jsのApp Routerを使用してAPIエンドポイントを作成したいのですが、どのようにすればよいでしょうか？具体的なコード例があると助かります。',
      userId: user1.id
    }
  })

  const question2 = await prisma.question.create({
    data: {
      title: 'React Hooksの使い方について',
      body: 'useStateとuseEffectの基本的な使い方を知りたいです。初心者でも理解できるように説明していただけませんか？',
      userId: user2.id
    }
  })

  // Create sample answers
  await prisma.answer.create({
    data: {
      body: 'Next.jsのApp Routerでは、app/apiディレクトリ内にroute.tsファイルを作成することでAPIエンドポイントを定義できます。\n\n例えば、app/api/hello/route.tsファイルを作成し、以下のようにエクスポートします：\n\n```typescript\nexport async function GET() {\n  return Response.json({ message: "Hello World" })\n}\n```\n\nこれで/api/helloエンドポイントが作成されます。',
      questionId: question1.id,
      userId: user2.id
    }
  })

  await prisma.answer.create({
    data: {
      body: 'useStateは状態を管理するためのフックです：\n\n```typescript\nconst [count, setCount] = useState(0)\n```\n\nuseEffectは副作用を実行するためのフックです：\n\n```typescript\nuseEffect(() => {\n  console.log("コンポーネントがマウントされました")\n}, [])\n```\n\n第二引数の配列は依存配列と呼ばれ、空配列の場合は初回のみ実行されます。',
      questionId: question2.id,
      userId: user1.id
    }
  })

  console.log('Database has been seeded!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })