# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

OWL (Open Wisdom Lab) is a modular knowledge base for building and operating AI Spaces / Maker Spaces. It's a Next.js documentation site with interactive AI-powered design tools built with Fumadocs.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Documentation**: Fumadocs (MDX-based)
- **UI**: Radix UI, Tailwind CSS 4, Framer Motion
- **State Management**: Zustand
- **AI**: Vercel AI SDK with Anthropic/OpenAI/Google providers
- **3D/Canvas**: React Three Fiber, Konva (react-konva)
- **Language**: TypeScript (strict mode)

## Common Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/ai/            # AI API routes (chat, layout, safety analysis)
│   └── [locale]/          # i18n routes (zh/en)
│       ├── lab/           # AI Lab interactive tools
│       │   ├── floor-plan/    # Floor plan designer
│       │   ├── concepts/      # Concept explorer
│       │   └── case-studies/  # Case studies
│       └── docs/          # Documentation pages
├── components/
│   ├── lab/               # Lab-specific components (FloorPlanCanvas, etc.)
│   ├── layout/            # Layout components (Header, MobileNav)
│   └── ui/                # Shared UI components
├── hooks/                 # React hooks (useHistory, useLayers, etc.)
├── lib/
│   ├── ai/               # AI configuration, agents, prompts
│   ├── schemas/          # Zod validation schemas
│   └── utils/            # Utility functions
└── stores/               # Zustand stores (multiverse-store)

content/docs/zh/knowledge-base/   # Knowledge base MDX content
├── 01-foundations/               # M01 Philosophy & Theory
├── 02-governance/                # M02 Governance & Network
├── ...                           # M03-M09 modules
├── _meta/                        # Metadata definitions
└── _templates/                   # Document templates
```

## Key Patterns

### Path Aliases
- `@/*` maps to `./src/*`
- `@/.source/*` maps to `./.source/*`

### i18n
- Uses `next-intl` with `[locale]` dynamic route
- Supported locales: `zh`, `en`

### Component Conventions
- Lab components in `src/components/lab/`
- UI primitives in `src/components/ui/`
- Custom hooks in `src/hooks/`

### State Management
- Zustand for complex state (e.g., `multiverse-store.ts`)
- React hooks for local component state

### AI Integration
- API routes in `src/app/api/ai/`
- AI config and prompts in `src/lib/ai/`
- Uses Vercel AI SDK streaming responses

## Content Architecture

The knowledge base uses a **Core + Extend + Evidence** three-layer architecture:
- **Core**: Essential principles (≤2000 chars per module)
- **Extend**: Deep research, case studies, visualizations
- **Evidence**: Structured citations and verification records

## Development Guidelines

1. **MDX Content**: Follow existing templates in `_templates/`
2. **Components**: Keep lab components focused and composable
3. **API Routes**: Use streaming for AI responses
4. **Types**: Maintain strict TypeScript, use Zod for runtime validation
5. **i18n**: Support both Chinese and English content
