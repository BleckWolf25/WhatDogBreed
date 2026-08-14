/**
 * @file env.ts
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Resolves environment variables and platform credentials for server-side execution.
 *
 * @description
 * Inspects dynamic server environment bindings, Node.js process environment values, and Cloudflare/Vercel
 * platform environment objects to resolve API keys such as GEMINI_API_KEY with graceful fallback to empty strings.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import { env } from '$env/dynamic/private';

// ---------- ENVIRONMENT RESOLVERS

export function getGeminiKey(platform?: App.Platform): string {
  const pEnv = platform?.env as Record<string, string | undefined> | undefined;
  const platformKey = pEnv?.GEMINI_API_KEY || pEnv?.GEMINI;
  const dynamicEnvMap = env as Record<string, string | undefined>;

  // ---------- RESOLUTION HIERARCHY
  const key =
    dynamicEnvMap.GEMINI_API_KEY ||
    dynamicEnvMap.GEMINI ||
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI ||
    platformKey ||
    '';

  return key.trim();
}
