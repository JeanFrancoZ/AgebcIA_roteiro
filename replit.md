# RoteirIA - AI Script Writing Platform

## Overview

RoteirIA is a Brazilian Portuguese AI-powered script writing platform that helps users create professional scripts for various content types including TikTok/Reels, YouTube videos, marketing content, and short films. The application uses OpenAI's GPT models to provide intelligent script analysis, guided questioning, structure generation, and final script creation through an interactive wizard interface.

## System Architecture

The application follows a full-stack TypeScript architecture with a clean separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI and Tailwind CSS
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with CSS custom properties for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **AI Integration**: OpenAI API for script analysis and generation
- **Development**: Hot reloading with Vite middleware integration

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Centralized schema definition in `/shared/schema.ts`
- **Tables**: Users, Scripts, AI Sessions for conversation tracking
- **Storage**: In-memory storage for development (MemStorage class)
- **Migration**: Drizzle Kit for schema migrations

## Key Components

### AI Agent System
- **ScriptingAgent**: State machine-based agent that manages the script creation workflow
- **Workflow Steps**: Input → Analysis → Questions → Structure → Generation → Completion
- **OpenAI Integration**: GPT-4o for intelligent script analysis and content generation
- **Conversation Tracking**: AI sessions stored to maintain context across interactions

### Script Wizard Interface
- **Multi-step Process**: Progressive disclosure of script creation steps
- **Type Selection**: TikTok/Reels, YouTube, Marketing, Short Film templates
- **Interactive Q&A**: AI-generated questions for script refinement
- **Structure Review**: Visual timeline of script sections with approval workflow
- **Final Output**: Complete script with export capabilities

### UI Component System
- **Design System**: Shadcn/ui with "new-york" style variant
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: CSS custom properties with theme switching
- **Accessibility**: Radix UI primitives ensure WCAG compliance

## Data Flow

1. **Script Initiation**: User selects script type and provides initial idea
2. **AI Analysis**: OpenAI analyzes the idea and identifies strengths/weaknesses
3. **Dynamic Questioning**: AI generates contextual questions for refinement
4. **Structure Generation**: AI creates detailed script structure with sections
5. **Final Script Creation**: AI generates complete script content
6. **Export Options**: Users can copy, download, or share final scripts

## External Dependencies

### Core Dependencies
- **OpenAI API**: GPT-4o model for AI-powered script generation
- **Neon Database**: PostgreSQL database service (configured but using in-memory for dev)
- **Radix UI**: Accessible component primitives for the UI system
- **TanStack Query**: Server state management and caching

### Development Tools
- **Vite**: Development server and build tool
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Production bundling for server code
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Replit Configuration
- **Environment**: Node.js 20, Web, PostgreSQL 16 modules
- **Development Command**: `npm run dev` (runs server with Vite middleware)
- **Build Process**: Vite build for client, ESBuild for server
- **Production Command**: `npm run start` (serves built application)
- **Port Configuration**: Internal port 5000, external port 80

### Build Process
1. **Client Build**: Vite compiles React app to `dist/public`
2. **Server Build**: ESBuild bundles server to `dist/index.js`
3. **Static Assets**: Client build output served by Express in production
4. **Environment Variables**: DATABASE_URL and OPENAI_API_KEY required

### Database Setup
- **Development**: In-memory storage with demo user
- **Production**: PostgreSQL via DATABASE_URL environment variable
- **Migrations**: `npm run db:push` applies schema changes

## Changelog

Changelog:
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.