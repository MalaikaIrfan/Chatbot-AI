# Overview

This is a modern AI assistant web application that provides multiple AI-powered features including chat conversations, image analysis, and content generation. The application is built with a React frontend using TypeScript and a Node.js/Express backend, featuring Google's Gemini AI integration for natural language processing and computer vision capabilities.

The application serves as a comprehensive AI toolkit allowing users to:
- Have conversational interactions with AI
- Analyze images using computer vision
- Generate various types of content (blog posts, social media, emails)
- Manage and organize projects
- Track usage analytics and performance metrics

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 using TypeScript and follows a component-based architecture with shadcn/ui components for consistent design. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching. Styling is handled by Tailwind CSS with a custom design system supporting both light and dark themes.

The frontend follows a modular structure with:
- Page components for main application views
- Reusable UI components built on Radix UI primitives
- Custom hooks for shared logic (mobile detection, theme management)
- Centralized query client configuration for API interactions

## Backend Architecture
The server uses Express.js with TypeScript in ESM format, implementing a RESTful API design. The application follows a service-oriented architecture with clear separation between route handlers, business logic, and data access layers.

Key architectural decisions:
- **Storage Abstraction**: Implements an IStorage interface allowing for flexible data persistence strategies (currently using in-memory storage with planned database migration)
- **Service Layer**: Dedicated Gemini service module for AI operations, encapsulating chat session management and API interactions
- **Middleware Pattern**: Custom logging and error handling middleware for request/response lifecycle management

## Data Management
The application uses Drizzle ORM with PostgreSQL as the target database, though currently implements an in-memory storage solution for development. The schema defines four main entities:
- Users (authentication and user management)
- Projects (content organization and persistence)
- Chat Messages (conversation history)
- Analytics Data (usage tracking and metrics)

Database migrations are managed through Drizzle Kit with schema definitions shared between client and server for type safety.

## Authentication & Session Management
Session handling is configured for PostgreSQL with connect-pg-simple, preparing for production deployment. The current implementation includes user schema definitions but authentication logic is not yet fully implemented.

## Build System & Development
The application uses Vite for frontend development and building, with esbuild for server-side bundling. Development workflow includes:
- Hot module replacement in development
- TypeScript compilation checking
- Shared type definitions between frontend and backend
- Custom Vite plugins for enhanced development experience in Replit environment

# External Dependencies

## AI Services
- **Google Gemini AI**: Primary AI service using `@google/genai` for natural language processing, image analysis, and content generation
- **Model Configuration**: Uses `gemini-2.5-flash` model with configurable temperature and token limits

## Database & Storage
- **Neon Database**: PostgreSQL hosting service via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database operations and schema management
- **Session Storage**: PostgreSQL-based session management with `connect-pg-simple`

## UI Framework & Components
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library based on Radix UI and Tailwind

## Development Tools
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with Zod validation
- **Wouter**: Lightweight router for client-side navigation
- **date-fns**: Date manipulation and formatting utilities

## File Upload & Processing
- **Multer**: Middleware for handling multipart/form-data for image uploads
- **File Storage**: Memory-based storage with size limits for image processing