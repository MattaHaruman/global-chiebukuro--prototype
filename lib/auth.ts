import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    signIn: async ({ user, profile }) => {
      console.log('SignIn callback triggered for user:', user?.id, user?.name)

      // Create or update user in our database when they sign in
      if (user && profile) {
        try {
          const { supabase } = await import('./supabase')

          console.log('Attempting to upsert user to database:', user.id)
          const { data, error } = await supabase
            .from('User')
            .upsert({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            }, {
              onConflict: 'id'
            })

          if (error) {
            console.error('Supabase upsert error:', error)
            return false
          }

          console.log('User upserted successfully:', data)
        } catch (error) {
          console.error('Error creating user:', error)
          return false
        }
      }
      return true
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
}