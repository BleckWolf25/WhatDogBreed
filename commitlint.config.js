/**
 * @file commitlint.config.js
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Configures conventional commit message standards and linting rules for git version control.
 *
 * @description
 * Enforces conventional commit standards across Git commit messages, ensuring consistent prefix formatting
 * such as feat, fix, chore, and refactor for automated changelogs and release workflows.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- CONFIGURATION

export default {
  extends: ['@commitlint/config-conventional']
};
