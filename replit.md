# GrindCTRL E-commerce Platform

## Overview

GrindCTRL is a modern e-commerce platform specializing in premium streetwear and urban fashion. The application features a single-page React frontend with a Node.js/Express backend, designed to deliver a high-performance shopping experience with cart functionality, product browsing, and order processing through webhook integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI components
- **State Management**: React Query (TanStack Query) for server state and local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Session-based cart functionality using browser-generated session IDs
- **API Design**: RESTful API endpoints for products, cart operations, and order processing
- **Development**: Hot reload with Vite integration in development mode

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle with migrations
- **Local Storage**: Browser localStorage for session persistence and wishlist functionality
- **Schema Design**: 
  - Products table with support for variants (colors, sizes), images, and metadata
  - Cart items with session-based association and product references
  - Orders table with comprehensive customer information and order details

### Authentication and Authorization
- **Session Management**: Anonymous session-based system using browser-generated unique identifiers
- **No Authentication**: Public e-commerce site with guest checkout functionality
- **Data Security**: Session isolation prevents cross-user data access

### Key Features Implementation
- **Product Management**: Multi-category product catalog with featured items support
- **Shopping Cart**: Persistent cart with quantity management and variant selection
- **Checkout Process**: Multi-step checkout modal with form validation
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Real-time UI**: Optimistic updates and loading states for better UX

## External Dependencies

### Third-party Services
- **Neon Database**: PostgreSQL hosting service (configured via DATABASE_URL)
- **n8n Webhook Integration**: Order processing automation through webhook endpoints
- **Google Fonts**: Typography using Inter and Poppins font families
- **Font Awesome**: Icon library for UI elements
- **Unsplash**: Product and lifestyle imagery

### Development Tools
- **Replit Integration**: Development environment support with runtime error overlay
- **GitHub Pages Deployment**: Static site deployment capability with CI/CD workflows
- **ESBuild**: Fast bundling for production builds
- **TypeScript**: Type safety across frontend and backend with shared schema definitions

### UI Component Libraries
- **Radix UI**: Headless UI primitives for accessible components
- **Shadcn/ui**: Pre-built component system built on Radix UI
- **Class Variance Authority**: Type-safe CSS class management
- **Tailwind Merge**: Intelligent CSS class merging for component customization

### Data Validation and Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management and validation
- **Drizzle Zod**: Database schema to Zod schema integration