# WhatDogBreed

> An intelligent, privacy-first canine identification and breed intelligence suite powered by Google Gemini AI, SvelteKit 2, and Svelte 5.

WhatDogBreed is a modern, responsive web application designed to identify dog breeds from photos or live camera captures in seconds. Beyond instant identification, it provides a comprehensive breed encyclopedia, an interactive crossbreed mixer simulator, side-by-side breed comparisons, care and nutrition guides, and local scan history management.

---

## ✨ Features

- 📷 **AI Photo & Live Camera Breed Scanner**: Instant multimodal canine identification powered by Google Gemini with confidence scores, breed composition, and secondary breed possibilities.
- 📖 **Comprehensive Breed Encyclopedia**: Searchable and filterable database of recognized FCI & AKC dog breeds, physical metrics, temperaments, care requirements, and health watchlists.
- 🧬 **Crossbreed Mixer Simulator**: Interactive dual-parent crossbreed simulator predicting physical attributes, temperament traits, exercise needs, and size ranges.
- ⚖️ **Side-by-Side Breed Compare**: Comparison tool with matrices for physical dimensions, exercise requirements, barking levels, trainability, shedding, and grooming needs.
- 📜 **Scan History & Pet Profiles**: Offline-first scan history and dog profile management stored securely in browser storage.
- 📏 **Unit Converter**: Seamless toggle between Metric (kg/cm) and Imperial (lbs/in) measurements.
- 🔗 **Shareable Deep Links**: Share scan results via compact Base64URL-encoded deep links with thumbnail compression.
- 🛡️ **Privacy & Local Resilience**: Zero client data monetization, edge rate limiting, and local fallback analysis.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22.x or higher
- **pnpm** 9.0.0 or higher
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BleckWolf25/WhatDogBreed.git
   cd WhatDogBreed
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 Available Scripts

- `pnpm dev` - Start the Vite development server
- `pnpm build` - Build the production bundle
- `pnpm preview` - Preview the production build locally
- `pnpm check` - Run SvelteKit type and component diagnostics via `svelte-check`
- `pnpm typecheck` - Run TypeScript compiler type check (`tsc --noEmit`)
- `pnpm lint` - Run ESLint across the codebase and auto-fix issues
- `pnpm format` - Run Prettier to format the codebase
- `pnpm test:unit` - Run unit tests using Vitest
- `pnpm test:e2e` - Run browser end-to-end tests using Playwright
- `pnpm test` - Run both unit and end-to-end tests
- `pnpm validate` - Run all linting, formatting, typecheck, test, and build suites

---

## 🏗️ Project Structure

```zsh
WhatDogBreed/
├── e2e/                     # Playwright end-to-end browser test suites
├── public/                  # Static assets & breed photography
├── src/
│   ├── app.d.ts             # Global SvelteKit ambient type definitions
│   ├── app.html             # HTML shell template
│   ├── hooks.server.ts      # Server request lifecycle, telemetry & error handling
│   ├── lib/
│   │   ├── components/      # Svelte UI components (Header, Footer, Lightbox, Modals, etc.)
│   │   ├── config/          # AI system prompts and schema constants
│   │   ├── data/            # Dog breeds catalog dataset & encyclopedic registries
│   │   ├── server/          # Server logic (AI scanning, validation, rate limiting, logger)
│   │   ├── stores/          # Reactive stores (app state, scanner, theme, unit preference)
│   │   ├── types/           # Core domain TypeScript interfaces and type definitions
│   │   └── utils/           # Helper utilities (unit converter, breed matcher, deep links)
│   └── routes/              # SvelteKit routing tree
│       ├── +layout.svelte   # Root application layout with navigation & toast stack
│       ├── +page.svelte     # Landing hero & featured breed discovery
│       ├── scanner/         # Photo upload & live camera AI breed recognition
│       ├── encyclopedia/    # Searchable breed directory & detail modals
│       ├── mixer/           # Crossbreed simulator & trait predictor
│       ├── compare/         # Side-by-side breed comparison matrix
│       ├── history/         # Local scan logs & saved pet profiles
│       ├── help/            # FAQ & user documentation
│       ├── privacy/         # Privacy policy & telemetry disclosure
│       ├── terms/           # Terms of service
│       └── api/             # Server endpoints (AI scan, feedback, breed data)
├── tests/
│   └── unit/                # Vitest unit & integration test suites
├── package.json
├── tsconfig.json            # Strict TypeScript compiler configuration
├── vite.config.ts           # Vite build pipeline & Svelte compiler options
├── vitest.config.ts         # Vitest unit test runner configuration
└── playwright.config.ts     # Playwright E2E browser test configuration
```

---

## 🧪 Testing

The project uses **Vitest** for unit & integration testing and **Playwright** for browser end-to-end testing.

### Run Unit Tests

```bash
pnpm test:unit
```

### Run End-to-End Tests

```bash
pnpm test:e2e
```

### Run Full Test Suite

```bash
pnpm test
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔒 Security

For security concerns, please review our [Security Policy](SECURITY.md).

---

## 📧 Contact

For questions or support, please open an issue on GitHub or contact [joao.coutinho08@gmail.com](mailto:joao.coutinho08@gmail.com).

---

Built with ❤️ using SvelteKit 2, Svelte 5, TypeScript, Vite, and Google Gemini API.
