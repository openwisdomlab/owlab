# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

**OWL (Open Wisdom Lab)** is a modular knowledge base for building and operating innovation learning spaces. Our mission: **Spark curiosity, nurture future scientific innovators with the potential to change the world.**

OWL is not just a space—it's a journey from curiosity to creation. We believe curiosity is the starting point of all innovation. People who stay curious, dare to take risks, and keep creating are the ones who will generate real value in the AI era.

### Core Philosophy: 3E Framework

Every module in OWL embodies three dimensions:

| Dimension | Focus | Example |
|-----------|-------|---------|
| **Enlighten** | Spark curiosity, open horizons | "This problem hasn't been solved yet!" |
| **Empower** | Give methods, tools, and space | Scientific thinking, AI tools, failure-friendly environment |
| **Engage** | Enter the real world, create real impact | Mentor networks, publications, open source contributions |

### Target Learner Profile

We nurture students with:
- **Curiosity & wild ideas** — Ask questions about everything
- **Broad interests** — Cross disciplinary boundaries
- **Risk-taking spirit** — Not afraid of failure
- **Creativity & ideals** — Turn ideas into reality
- **Long-term thinking** — Sustained commitment
- **Research potential** — Capacity for genuine innovation

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
│       └── docs/          # Documentation pages
├── components/
│   ├── layout/            # Layout components
│   └── ui/                # Shared UI components
├── features/              # Feature-based components
│   ├── doc-viewer/        # Documentation rendering components
│   └── lab-editor/        # Floor plan editor components
├── data/                  # Strongly-typed static data
├── hooks/                 # React hooks
├── lib/
│   ├── ai/               # AI configuration, agents, prompts
│   ├── schemas/          # Zod validation schemas
│   └── utils/            # Utility functions
└── stores/               # Zustand stores

docs/tasks/                       # Auto Claude task specs
└── SPECS.md                      # Task list for Auto Claude

content/docs/zh/
├── core/                         # Core standards (核心标准)
│   ├── 01-foundations/           # M01 Philosophy & Theory
│   ├── 02-governance/            # M02 Governance & Network
│   ├── 03-space/                 # M03 Space & Environment
│   ├── 04-programs/              # M04 Programs & Projects
│   ├── 05-tools/                 # M05 Tools & Assets
│   ├── 06-safety/                # M06 Safety & Ethics
│   ├── 07-people/                # M07 People & Capability
│   ├── 08-operations/            # M08 Operations
│   ├── 09-assessment/            # M09 Assessment & Impact
│   ├── _meta/                    # Metadata definitions
│   └── _templates/               # Document templates
├── research/                     # Exploratory research (探索研究)
└── resources/                    # Resources & tools (资源工具)
```

## Knowledge Base Modules

Each module addresses a key aspect of building and operating innovation learning spaces, with all three 3E dimensions represented:

| Module | Tagline | Key 3E Contributions |
|--------|---------|---------------------|
| M01 | Why curiosity is the most precious ability | **E**: First principles of education; **E**: 4P learning theory; **E**: Global educator consensus |
| M02 | Connect global resources | **E**: See global innovations; **E**: Replicable governance; **E**: Mentor networks |
| M03 | Space speaks—let curiosity grow | **E**: "Want to tinker" atmosphere; **E**: 3-layer design framework; **E**: Showcase stage |
| M04 | From curiosity to creation | **E**: QFocus challenges; **E**: 101 foundation courses; **E**: Real-world output |
| M05 | AI-era creator's toolbox | **E**: Accessible technology; **E**: AI + open hardware; **E**: Open source community |
| M06 | Prerequisites for risk-taking | **E**: Risk as literacy; **E**: Safety systems; **E**: Community safety culture |
| M07 | Not teaching, but igniting | **E**: Facilitators as learners; **E**: Scaffolding methods; **E**: Expert mentors |
| M08 | Keep inquiry happening | **E**: Fresh discoveries; **E**: SOPs free creativity; **E**: Community relationships |
| M09 | See the traces of growth | **E**: Visible progress; **E**: Multi-modal evidence; **E**: Impact storytelling |

## Content Architecture

The knowledge base uses a **Core + Extend + Evidence** three-layer architecture:
- **Core**: Essential principles (≤2000 chars per module)
- **Extend**: Deep research, case studies, visualizations
- **Evidence**: Structured citations and verification records

### Documentation Structure

```
content/docs/zh/                 # Chinese documentation
├── core/                        # Core standards (核心标准) - /docs/core
│   ├── 01-foundations/          # M01-M09 modules
│   ├── ...
│   ├── _meta/                   # Metadata & schema definitions
│   └── _templates/              # Document templates
├── research/                    # Exploratory research (探索研究) - /docs/research
│   ├── 01-space-as-educator/    # L01-L04 living modules
│   ├── ...
│   └── tools/                   # Research tools
└── resources/                   # Resources & tools (资源工具) - /docs/resources
```

### URL Routing

| Content Path | URL Route |
|--------------|-----------|
| `content/docs/zh/core/` | `/zh/docs/core/` |
| `content/docs/zh/research/` | `/zh/docs/research/` |
| `content/docs/zh/resources/` | `/zh/docs/resources/` |

## Key Patterns

### Path Aliases
- `@/*` maps to `./src/*`
- `@/.source/*` maps to `./.source/*`

### i18n
- Uses `next-intl` with `[locale]` dynamic route
- Supported locales: `zh`, `en`

### Component Conventions
- Feature components in `src/features/` (doc-viewer, lab-editor)
- UI primitives in `src/components/ui/`
- Layout components in `src/components/layout/`
- Custom hooks in `src/hooks/`

### State Management
- Zustand for complex state (e.g., `multiverse-store.ts`)
- React hooks for local component state

### AI Integration
- API routes in `src/app/api/ai/`
- AI config and prompts in `src/lib/ai/`
- Uses Vercel AI SDK streaming responses

## Development Guidelines

1. **MDX Content**: Follow existing templates in `_templates/`
2. **Components**: Keep lab components focused and composable
3. **API Routes**: Use streaming for AI responses
4. **Types**: Maintain strict TypeScript, use Zod for runtime validation
5. **i18n**: Support both Chinese and English content
6. **3E Alignment**: Every feature should consider how it contributes to Enlighten, Empower, and Engage

## Documentation Maintenance

When adding or modifying documentation structure:

### Adding New Documents
1. Create MDX file in appropriate directory under `content/docs/zh/`
2. Update corresponding `meta.json` to include the new page
3. Use internal links format: `/docs/core/...` or `/docs/research/...`

### When Renaming Directories
Update all references in these locations:
- `content/docs/zh/*/meta.json` - Navigation configuration
- `content/docs/zh/**/*.mdx` - Internal links in documents
- `src/components/` - Any hardcoded paths in components
- `src/features/` - Feature component paths
- `src/lib/` - Utility functions with paths
- `CLAUDE.md`, `README.md`, `CONTRIBUTING.md` - Project documentation
- `public/manifest.json` - PWA shortcuts
- `next.config.ts` - Build configuration

### Internal Link Format
- Use relative URLs without locale prefix in MDX: `/docs/core/01-foundations`
- The routing system automatically adds locale prefix
- Cross-reference format: `[Link Text](/docs/core/module-name)`

### MDX Code Block Guidelines

**CRITICAL**: Turbopack (Next.js 16+) evaluates code blocks as JavaScript when no language specifier is provided. This causes build errors like:

```
Error evaluating Node.js code
index.mdx:52:52: Unexpected character `3` (U+0033) before name
```

#### Rule 1: ALWAYS Use Language Specifiers

Every fenced code block MUST have a language specifier. Use `text` for plain text, diagrams, and ASCII art:

```text
✅ CORRECT:
```text
┌────────────┐
│  Diagram   │
└────────────┘
```

❌ WRONG (will cause build error):
```
┌────────────┐
```
```

**Common language specifiers:**
- `text` - Plain text, ASCII art, Unicode diagrams, checklists
- `bash` - Shell commands
- `typescript` / `javascript` - Code examples
- `json` - JSON data
- `markdown` - Markdown examples

#### Rule 2: Check Code Blocks When Writing MDX

Before committing any MDX file, verify:
- [ ] Every ` ``` ` opening has a language specifier (e.g., ` ```text `)
- [ ] Opening and closing blocks are properly paired
- [ ] No bare ` ``` ` without language specifier

**Quick check command:**
```bash
grep -n '^```$' content/docs/zh/core/**/*.mdx
```
If this returns any results, those files need fixing.

#### Rule 3: Avoid JavaScript-like Patterns

Even with `text` specifier, avoid patterns that look like JS expressions:
- ❌ `(r=+0.72)` - looks like JS assignment
- ❌ `{value=123}` - looks like JSX expression
- ✅ `r = 0.72` or `相关系数: 0.72`

#### Rule 4: Run Lint Before Build

```bash
pnpm lint:mdx          # Check for MDX issues
pnpm build             # prebuild script runs lint-mdx.js automatically
```

#### Common Error Patterns

| Error Message | Cause | Fix |
|---------------|-------|-----|
| `Unexpected character before name` | Code block without language specifier | Add `text` or appropriate language |
| `Error evaluating Node.js code` | Turbopack treating content as JS | Add language specifier to code block |
| Position like `52:52` in error | Usually points to content after bare code block | Find and fix the bare ` ``` ` above that line |
