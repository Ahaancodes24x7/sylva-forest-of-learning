# SYLVA Developer & Agent Guidelines

Guidelines for contributors and AI agents working on the SYLVA codebase.

## Project Overview
SYLVA is an interactive web application that turns course syllabi into a living, visual 3D forest representing knowledge mastery, retention decay, and adaptive scheduling.

## Tech Stack
- **Framework**: TanStack Start with Vite
- **UI & Styling**: React 19, Tailwind CSS v4, Radix UI primitives, Lucide icons
- **3D Engine**: Three.js, React Three Fiber, React Three Drei
- **Motion**: Framer Motion
- **Charts**: Recharts

## Codebase Structure
- `src/routes/`: File-based routes for TanStack Start (e.g. `index.tsx`, `forest.tsx`, `timeline.tsx`, `knowledge.tsx`, `schedule.tsx`, `onboarding.tsx`, `profile.tsx`, `settings.tsx`, `auth.tsx`)
- `src/components/forest/`: 3D forest canvas, scene rendering, and shaders
- `src/components/sylva/`: SYLVA core components (micro-lessons, decay charts, document upload, modals, drawers)
- `src/components/landing/`: Landing page visualizations and interactive components
- `src/data/`: Mock data schemas and curriculum trees
- `src/lib/`: Client and server utilities (auth session, document parsing, error handling)
