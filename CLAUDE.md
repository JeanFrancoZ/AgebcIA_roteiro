# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reloading (runs Express server with Vite middleware)
- `npm run build` - Build both client (Vite) and server (ESBuild) for production
- `npm run start` - Run production server (requires build first)
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Apply database schema changes using Drizzle Kit

## Architecture Overview

RoteirIA is a Brazilian Portuguese AI-powered script writing platform with a full-stack TypeScript architecture:

### Client-Server Structure
- **Client**: React 18 + TypeScript in `/client/` directory, built with Vite
- **Server**: Express.js + TypeScript in `/server/` directory, bundled with ESBuild
- **Shared**: Common schemas and types in `/shared/` directory used by both client and server

### Key Architecture Patterns
- **Monorepo**: Single repository with client/server/shared structure
- **Path Aliases**: `@` points to `client/src`, `@shared` points to `shared/`, `@assets` points to `attached_assets/`
- **API Design**: RESTful endpoints under `/api/` prefix with JSON responses
- **State Management**: TanStack Query for server state, React hooks for local state

### AI Agent System
The core feature is a stateful AI agent (`ScriptingAgent` in `/server/services/langgraph.ts`) that manages script creation workflow:
1. **Analysis**: Analyze user's script idea
2. **Questions**: Generate contextual questions for refinement  
3. **Structure**: Create detailed script structure
4. **Generation**: Generate final script content
5. **Session Management**: Agents stored in-memory Map with `script_{id}` keys

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL
- **Schema**: Centralized in `/shared/schema.ts` with tables for users, scripts, and AI sessions
- **Development**: Uses in-memory storage (`MemStorage` class) with demo user ID 1
- **Production**: PostgreSQL via `DATABASE_URL` environment variable

## Component Structure

### UI Components
- **Design System**: Shadcn/ui components in `/client/src/components/ui/`
- **Feature Components**: Main app components in `/client/src/components/`
- **Key Component**: `script-wizard.tsx` orchestrates the multi-step script creation flow

### Server Services
- **OpenAI Service**: `/server/services/openai.ts` - AI integration for script analysis and generation
- **LangGraph Service**: `/server/services/langgraph.ts` - State machine agent for workflow management
- **Storage Service**: `/server/storage.ts` - Database abstraction layer

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for GPT-4o model
- `NODE_ENV` - Set to 'development' or 'production'

### Key Integrations
- **OpenAI API**: Uses GPT-4o model for script analysis and generation
- **Neon Database**: PostgreSQL database service (configured but dev uses in-memory)
- **Replit Environment**: Configured for port 5000 internal, port 80 external

## Development Workflow

### Adding New Features
1. Update shared schema in `/shared/schema.ts` if database changes needed
2. Add server routes in `/server/routes.ts` following RESTful patterns
3. Update AI agent workflow in `/server/services/langgraph.ts` if needed
4. Add client components and API calls using TanStack Query patterns
5. Run `npm run check` to verify TypeScript compliance

### Script Types Supported
- TikTok/Reels (short vertical videos)
- YouTube (longer form content)
- Marketing (promotional content)
- Short Film (narrative content)

Each type has specific duration targets and formatting rules handled by the AI system.

## Important Notes

- All user-facing text should be in Brazilian Portuguese
- Demo user ID is hardcoded as `1` in development
- AI agents are stored in server memory and cleaned up after script completion
- The application serves both API and static files from single port 5000
- Client builds to `dist/public`, server builds to `dist/index.js`