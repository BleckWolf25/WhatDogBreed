# Contributing to WhatDogBreed

First off, thank you for taking the time to contribute! Contributions from the community help make **WhatDogBreed** more comprehensive, accurate, and helpful for everyone.

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Table of Contents

- [Contributing to WhatDogBreed](#contributing-to-whatdogbreed)
  - [Table of Contents](#table-of-contents)
  - [How Can I Contribute?](#how-can-i-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Enhancements or Breeds](#suggesting-enhancements-or-breeds)
    - [Pull Requests](#pull-requests)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Setting Up Your Workspace](#setting-up-your-workspace)
    - [Development Commands](#development-commands)
  - [Style \& Code Guidelines](#style--code-guidelines)
    - [Code Organization \& Documentation Standard](#code-organization--documentation-standard)
    - [TypeScript and Svelte 5 Coding Style](#typescript-and-svelte-5-coding-style)
    - [Commit Messages](#commit-messages)
  - [Testing](#testing)
    - [Writing Unit Tests (Vitest)](#writing-unit-tests-vitest)
    - [Writing End-to-End Tests (Playwright)](#writing-end-to-end-tests-playwright)
  - [Security Vulnerabilities](#security-vulnerabilities)

---

## How Can I Contribute?

### Reporting Bugs

We use structured GitHub Issues to track bug reports. Before submitting a bug report, please:

1. Check existing issues to ensure it hasn't been reported or resolved already.
2. Test on a clean environment without conflicting browser extensions.
3. Open a bug report including:
   - Application version/commit
   - Browser and OS details
   - Step-by-step instructions to reproduce
   - Console logs from the browser developer tools (`F12 > Console`) or server output

### Suggesting Enhancements or Breeds

If you have ideas for new features, catalog enhancements, crossbreed simulator traits, or additional dog breeds:

1. Search the issues to verify your suggestion hasn't been discussed before.
2. Open a Feature Request describing the functionality, data source references (e.g., FCI or AKC breed standards), and why it benefits the community.

### Pull Requests

To submit code changes:

1. **Fork** the repository and create your branch from `main` (e.g., `feat/breed-trait-refinement` or `fix/scanner-upload-guard`).
2. Make your changes, keeping them focused. Avoid unrelated modifications.
3. Follow the project's documentation and code structure conventions.
4. Ensure your changes compile and pass all quality checks locally (`pnpm validate`).
5. Submit a Pull Request with a clear description of the changes and references to any related issues.

---

## Development Setup

This project is built using **SvelteKit 2**, **Svelte 5** (Runes), **TypeScript**, **Vite**, and **Google Gemini AI**.

### Prerequisites

- **Node.js** 22.x or higher
- **pnpm** 9.0.0 or higher
- **Git**
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

### Setting Up Your Workspace

1. **Clone the repository:**

   ```bash
   git clone https://github.com/BleckWolf25/WhatDogBreed.git
   cd WhatDogBreed
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment:**

   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY inside .env
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Development Commands

Use the following pnpm commands in your project root:

- **Start Vite development server:**

  ```bash
  pnpm dev
  ```

- **Build production bundle:**

  ```bash
  pnpm build
  ```

- **Preview production build locally:**

  ```bash
  pnpm preview
  ```

- **Run Svelte and TypeScript checks:**

  ```bash
  pnpm check
  ```

- **Run ESLint with auto-fixes:**

  ```bash
  pnpm lint
  ```

- **Run Prettier formatter:**

  ```bash
  pnpm format
  ```

- **Run Vitest unit tests:**

  ```bash
  pnpm test:unit
  ```

- **Run Playwright end-to-end tests:**

  ```bash
  pnpm test:e2e
  ```

- **Run full test suite (Unit + E2E):**

  ```bash
  pnpm test
  ```

- **Run full quality gate validation:**

  ```bash
  pnpm validate
  ```

---

## Style & Code Guidelines

### Code Organization & Documentation Standard

All `.ts` and `.js` source files must strictly follow the project's documentation and uppercase section banner conventions:

1. **File Header:**

   ```typescript
   /**
    * @file <FileName.ext>
    *
    * @version 1.0.0
    * @author BleckWolf25
    * @license MIT
    *
    * @summary <One terse sentence describing the file's purpose.>
    *
    * @description
    * <A fuller paragraph elaborating responsibilities and features handled by the file.>
    *
    * @since 05/08/2026
    * @updated 13/08/2026
    */
   ```

2. **Section Banners:**
   - Mark every structural region with: `// ---------- UPPERCASE LABEL`
   - Common banner labels: `IMPORTS`, `TYPES & INTERFACES`, `CONSTANTS`, `STATE`, `HELPERS`, `HANDLERS`, `EXPORTS`.

3. **Verification:**
   - Run `node scripts/audit_documentation.js` to verify that all code files strictly conform.

### TypeScript and Svelte 5 Coding Style

- **Indentation:** Use 2 spaces for indentation.
- **Naming Conventions:**
  - Classes, Types, and Interfaces: `PascalCase`
  - Functions, Variables, and Utilities: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Svelte Component Files: `PascalCase` (e.g., `BreedProfileContent.svelte`)
- **Svelte 5 Runes:** Use Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`) instead of legacy Svelte 3/4 stores or `let:` exports in new components.
- **Type Safety:** Always declare explicit TypeScript types. Avoid `any` whenever possible.

### Commit Messages

Commit messages should adhere to Conventional Commits:

- `feat: ...` for a new feature or capability
- `fix: ...` for a bug fix
- `docs: ...` for documentation changes
- `refactor: ...` for non-functional code restructurings
- `test: ...` for adding or updating unit/e2e tests
- `chore: ...` for build or configuration updates

Example:

```text
feat(mixer): add size and temperament prediction for crossbreed simulations
```

---

## Testing

The project uses **Vitest** for isolated unit & integration tests and **Playwright** for multi-route browser testing.

### Writing Unit Tests (Vitest)

- Place unit tests in `tests/unit/`.
- Name test files with the `.test.ts` extension (e.g., `tests/unit/breedMatcher.test.ts`).
- Include test assertions for edge cases, error conditions, and expected domain transformations.

### Writing End-to-End Tests (Playwright)

- Place E2E tests in `e2e/`.
- Name test files with the `.spec.ts` extension (e.g., `e2e/encyclopedia.spec.ts`).
- Use stable, accessible locators (IDs, semantic roles, or specific CSS selectors).

---

## Security Vulnerabilities

Please do not report security vulnerabilities in public issues. Refer to our [Security Policy](SECURITY.md) for instructions on how to report security issues privately.
