-- Create User table for NextAuth
CREATE TABLE "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create Account table for NextAuth
CREATE TABLE "Account" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
  UNIQUE(provider, "providerAccountId")
);

-- Create Session table for NextAuth
CREATE TABLE "Session" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create VerificationToken table for NextAuth
CREATE TABLE "VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE(identifier, token)
);

-- Create Question table
CREATE TABLE "Question" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  "userId" TEXT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create Answer table
CREATE TABLE "Answer" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  body TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  "questionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  FOREIGN KEY ("questionId") REFERENCES "Question"(id) ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Answer" ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Questions are viewable by everyone" ON "Question"
  FOR SELECT USING (true);

CREATE POLICY "Answers are viewable by everyone" ON "Answer"
  FOR SELECT USING (true);

CREATE POLICY "User profiles are viewable by everyone" ON "User"
  FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Users can insert questions" ON "Question"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own questions" ON "Question"
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own questions" ON "Question"
  FOR DELETE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert answers" ON "Answer"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own answers" ON "Answer"
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own answers" ON "Answer"
  FOR DELETE USING (auth.uid()::text = "userId");