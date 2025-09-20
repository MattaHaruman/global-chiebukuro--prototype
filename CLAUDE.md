# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Global知恵袋 - Q&A Platform

A Yahoo!知恵袋-style Q&A platform prototype built with modern web technologies. Features GitHub OAuth authentication, automatic translation via DeepL API, and a responsive design.

## Architecture Overview

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: Prisma
- **Authentication**: NextAuth.js with GitHub OAuth
- **Translation**: DeepL API for multilingual support
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Package Manager**: Yarn (migrated from npm)
- **Deployment**: Vercel

## Development Commands

```bash
# Development server
yarn dev                 # Start development server at http://localhost:3000

# Database operations
yarn db:push            # Push Prisma schema to database
yarn db:seed            # Seed database with sample data
yarn db:studio          # Open Prisma Studio
yarn db:migrate:deploy  # Deploy migrations (production)

# Build and deployment
yarn build              # Production build (includes Prisma generate)
yarn start              # Start production server
yarn lint               # Run ESLint

# Package management
yarn add package-name   # Add dependency
yarn add -D package-name # Add dev dependency
yarn remove package-name # Remove dependency
```

## Search Functionality

### Phase 1: Basic Full-text Search (Implemented)
- Supabase PostgreSQL `ilike` operator for partial matching
- Searches both question titles and bodies
- Real-time search with TanStack Query integration
- Pagination support for search results
- Search state management with React hooks

**API Implementation**: `/api/questions` accepts `q` parameter for search queries
**Components**: `QuestionSearch` component with debounced input, `QuestionList` with search integration

### Future Search Enhancements (Planned)
- **Phase 2**: Enhanced UX with real-time filtering and autocomplete
- **Phase 3**: Backend separation with Elasticsearch for advanced search
- **Phase 4**: Semantic search using embedding vectors for meaning-based queries

## Database Schema

### Core Models
- **User**: GitHub OAuth user data with id, name, email, image
- **Question**: User-generated questions with title, body, timestamps, search functionality
- **Answer**: Responses to questions linked to users and questions
- **Account/Session**: NextAuth.js authentication tables
- **VerificationToken**: NextAuth.js email verification

### Key Relationships
- User → Questions (1:many)
- User → Answers (1:many)
- Question → Answers (1:many)
- All relations use CASCADE delete for data consistency

## API Structure

### Questions API (`/api/questions`)
- **GET**: Fetch all questions with user data and answer counts
  - Query parameters: `page`, `limit`, `q` (search query)
  - Search implementation: PostgreSQL `ilike` on title and body fields
- **POST**: Create new question (authenticated users only)

### Question Details API (`/api/questions/[id]`)
- **GET**: Fetch specific question with answers and user data
- **POST**: Add answer to question (authenticated users only)

### Translation API (`/api/translate`)
- **POST**: Translate text using DeepL API based on browser language

### Authentication API (`/api/auth/[...nextauth]`)
- NextAuth.js dynamic route handling GitHub OAuth flow

## Authentication Flow

1. **Provider**: GitHub OAuth only
2. **Strategy**: JWT-based sessions
3. **Custom Callbacks**:
   - Automatic user creation in Supabase on first sign-in
   - User ID injection into session tokens
4. **Custom Pages**: Custom sign-in page at `/auth/signin`

## Environment Variables

### Required
```env
DATABASE_URL=postgresql://...          # PostgreSQL connection string
NEXTAUTH_URL=http://localhost:3000     # Base URL for NextAuth
NEXTAUTH_SECRET=your-secret-key        # JWT signing secret
GITHUB_ID=your-github-oauth-id         # GitHub OAuth App ID
GITHUB_SECRET=your-github-oauth-secret # GitHub OAuth App Secret
```

### Optional
```env
DEEPL_API_KEY=your-deepl-key          # DeepL translation API
SUPABASE_URL=https://...              # Supabase project URL
SUPABASE_ANON_KEY=eyJhbGciOi...       # Supabase anonymous key
```

## Translation System

### Supported Languages
- Japanese (JA) - Original content language
- English (EN-US), Chinese (ZH), Korean (KO)
- Spanish (ES), French (FR), German (DE)
- Italian (IT), Portuguese (PT-BR), Russian (RU)

### Translation Logic
- Automatic detection of browser language
- Translation triggered client-side for non-Japanese content
- Graceful fallback to original text if API unavailable
- No translation needed for same language or Japanese content

## Key Components

### UI Components (`/components`)
- **Header.tsx**: Navigation with authentication controls
- **QuestionList.tsx**: Questions feed with TanStack Query and search integration
- **QuestionCard.tsx**: Individual question display with translation
- **QuestionForm.tsx**: Question creation form with validation
- **QuestionSearch.tsx**: Search input component with real-time functionality
- **AnswerCard.tsx**: Answer display with user info
- **AnswerForm.tsx**: Answer submission form
- **SessionProvider.tsx**: NextAuth session wrapper

### Core Utilities (`/lib`)
- **auth.ts**: NextAuth configuration with GitHub provider
- **supabase.ts**: Supabase client configuration
- **translation.ts**: DeepL API client with language detection

## Directory Structure

```
app/
├── api/                    # API routes
│   ├── auth/[...nextauth]/ # NextAuth dynamic routes
│   ├── questions/          # Question CRUD operations with search
│   │   └── [id]/          # Individual question operations
│   └── translate/          # DeepL translation endpoint
├── auth/signin/           # Custom sign-in page
├── questions/             # Question-related pages
│   ├── new/              # Question creation
│   └── [id]/             # Question detail view
├── layout.tsx            # Root layout with providers
└── page.tsx              # Home page with question feed and search

components/               # Reusable UI components
lib/                     # Utility functions and configurations
types/                   # TypeScript type definitions
yarn.lock               # Yarn dependency lock file
```

## Data Flow

### Question Creation
1. User authenticated via GitHub OAuth
2. Form submission to `/api/questions` POST
3. Prisma creates question record with user ID
4. TanStack Query invalidates question list cache
5. Redirect to question detail page

### Search Flow
1. User enters search query in QuestionSearch component
2. Search state managed in parent component (HomePage)
3. QuestionList receives searchQuery prop and triggers API call
4. API `/api/questions?q=query` filters using PostgreSQL `ilike`
5. Results displayed with pagination support

### Answer Submission
1. Form submission to `/api/questions/[id]/answers` POST
2. Prisma creates answer linked to question and user
3. Cache invalidation triggers UI refresh
4. New answer appears in question detail view

### Translation Flow
1. Client detects browser language
2. If content language differs from browser language
3. POST request to `/api/translate` with text and target language
4. DeepL API translates content
5. Translated text replaces original in UI

## Configuration Notes

### Package Management
- **Migrated from npm to Yarn**: Use `yarn` commands instead of `npm`
- Lock file: `yarn.lock` (committed), `package-lock.json` removed
- All scripts in package.json work with both npm and yarn

### NextAuth Configuration
- JWT strategy for serverless compatibility
- Custom sign-in callback creates users in database
- Session callback injects user ID for API operations

### Vercel Deployment
- `vercel.json` configured for Next.js framework detection
- Build command includes Prisma generation step
- Environment variables configured in Vercel dashboard

## Development Notes

- Uses App Router (stable in Next.js 14)
- TypeScript with strict type checking
- Tailwind CSS for responsive design with colorful, animated styling
- TanStack Query for server state management
- Error boundaries and loading states implemented
- SEO-friendly with proper metadata
- Search functionality uses real-time updates with debouncing

## Security Considerations

- GitHub OAuth provides secure authentication
- CSRF protection via NextAuth.js
- Database queries use Prisma's built-in SQL injection protection
- Environment variables properly isolated
- API routes validate authentication before operations
- Search queries are sanitized through Supabase client

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.