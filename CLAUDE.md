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
├── SPECS.md                      # Active task list (001-NNN)
└── COMPLETED.md                  # Completed task archive (C001-CNNN)

### Task Management

- **Active tasks** (SPECS.md): Sequential numbering 001-NNN, reset when reorganized
- **Completed tasks** (COMPLETED.md): Prefix `C` + original number (C001, C002...)
- **Workflow**: Task complete → Move details to COMPLETED.md → Keep summary in SPECS.md

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
- **Core**: Essential principles per module. Hard cap: **≤6000 字符** for the module `index.mdx`. Anything longer must be extracted into `extend/`.
- **Extend**: Deep research, case studies, visualizations, methods, taxonomies, full prose treatments. No length cap.
- **Evidence**: Structured citations (`evidence/refs.json`), verification records, and the `<References scope="module" />` view.

### Core Index Four-Block Scaffold (mandatory)

Every Core module `index.mdx` MUST follow this skeleton, in order:

1. **`## Core 论断`** — 3-7 first-principle propositions that define the module. State each as a single sentence + one-line warrant. No tables, no SOPs, no case detail. This is the "if a reader only reads one section, what must they take away."
2. **`## 3E 映射`** — Explicit mapping to Enlighten / Empower / Engage. One row per dimension, ≤2 sentences each. Use the existing `<ModuleSummary />` or a 3-row table.
3. **`## 关键证据`** — 3-8 citation-anchored claims. Each claim is one paragraph that ends with `<Cite id="..."/>` or `<Cite ids="a,b"/>`. Prefer E2/E3 sources from 2024-2026 where available.
4. **`## Extend 索引`** — `<ExtendCards />` listing every `extend/*.mdx`, `cases/*.mdx`, and `evidence/*.mdx` page that belongs to this module. This is the navigation entry into depth.

End with `<References scope="page" />` so the page renders its own bibliography.

### Citation System

- Per-module bibliographies: `content/docs/zh/core/0X-*\/evidence/refs.json` and `content/docs/zh/research/0X-*\/extend/refs.json`.
- Global aggregated index (generated): `src/data/bibliography.generated.json`, produced by `scripts/build-bibliography.mjs` and consumed by `<Cite>` / `<References>`.
- Use `<Cite id="M03-2024-CRJ-Allen" />` inline; the page-bottom `<References scope="page" />` auto-numbers and renders the list.
- Citation id slug convention for new entries: `<MODULE>-<YEAR>-<VENUE-ABBR>-<FirstAuthor>` (e.g., `M05-2025-AERA-Lee`). Legacy IDs like `M03-001` remain valid; if you need to rename, add the old ID to `aliases: []`.
- Evidence tiers (E0-E3) defined in `content/docs/zh/core/_meta/evidence-levels.mdx`. Every citation must carry `evidence_tier` (preferred) or legacy `evidence_level`.

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

#### Rule 4: JSX 字符串属性内不要直接嵌入 ASCII 双引号

Turbopack MDX 解析器会把 JSX 属性 `attr="..."` 的第一个内层 `"` 视为属性结束，
然后把后续字符当作下一个属性名解析；若紧跟全/半角逗号或中文字符，会触发
`Unexpected character` 构建错误。

```text
❌ <ModuleSummary philosophy="他示范"我也不知道"的求知姿态。" />
✅ <ModuleSummary philosophy="他示范「我也不知道」的求知姿态。" />
✅ <ModuleSummary philosophy={`他示范"我也不知道"的求知姿态。`} />
```

写中文 JSX 属性时优先使用 CJK 引号 `「…」` / `『…』`；需要 ASCII 引号时改用
JSX 表达式 `{`…`}` 或 `&quot;`。`pnpm lint:mdx` 会扫到这种漏写。

#### Rule 5: Run Lint Before Build

```bash
pnpm lint:mdx          # Check for MDX issues (incl. JSX inner-quote check)
pnpm build             # prebuild script runs lint-mdx.js automatically
```

#### Common Error Patterns

| Error Message | Cause | Fix |
|---------------|-------|-----|
| `Unexpected character before name` | Code block without language specifier | Add `text` or appropriate language |
| `Error evaluating Node.js code` | Turbopack treating content as JS | Add language specifier to code block |
| Position like `52:52` in error | Usually points to content after bare code block | Find and fix the bare ` ``` ` above that line |
| `Unexpected character `，` (U+FF0C) in attribute name` | JSX 属性值含未转义的内层 ASCII `"` | 内层引号改为 CJK `「」` 或用 `{`…`}` 表达式包裹 |

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.
Instead use:
- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.
Instead use:
- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED
WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.
Instead use:
- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)
Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)
If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)
Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
