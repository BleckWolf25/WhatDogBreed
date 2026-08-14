/**
 * @file app.d.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Global application type definitions and SvelteKit platform environment ambient declarations.
 *
 * @description
 * Declares global TypeScript interfaces for SvelteKit App namespace, including platform environment bindings
 * for the Gemini API key, and provides foundational ambient type definitions across the project.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- GLOBAL NAMESPACE

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env?: {
        GEMINI_API_KEY?: string;
      };
    }
  }
}

// ---------- EXPORT

export {};
