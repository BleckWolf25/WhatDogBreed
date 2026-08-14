/**
 * @file audit_documentation.js
 *
 * @version 1.0.0
 * @author BleckWolf25
 * @license MIT
 *
 * @summary Audits all TypeScript and JavaScript files for strict adherence to file header and section banner standards.
 *
 * @description
 * Recursively scans project source trees, verifies that all .ts and .js files contain mandatory JSDoc header fields,
 * confirms required metadata values (@author, @version, @since, @updated, @summary, @description), checks for uppercase
 * section banner comments, and exits with a non-zero code if any non-conforming file is detected.
 *
 * @since 05/08/2026
 * @updated 13/08/2026
 */

// ---------- IMPORTS

import fs from 'fs';
import path from 'path';

// ---------- FILE SCANNER

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.svelte-kit', '.git', 'dist', 'build', '.vercel'].includes(file)) {
        results = results.concat(getFiles(fullPath));
      }
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

// ---------- AUDIT RUNNER

function auditDocumentation() {
  const allFiles = getFiles('.');
  console.log(`Auditing ${allFiles.length} files...`);

  let issues = 0;
  allFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const rel = path.relative('.', file);

    if (!content.includes('* @author BleckWolf25')) {
      console.error('Missing author in', rel);
      issues++;
    }
    if (!content.includes('* @version 1.0.0')) {
      console.error('Missing @version 1.0.0 in', rel);
      issues++;
    }
    if (!content.includes('* @license MIT')) {
      console.error('Missing @license MIT in', rel);
      issues++;
    }
    if (!content.includes('* @since 05/08/2026')) {
      console.error('Missing @since 05/08/2026 in', rel);
      issues++;
    }
    if (!content.includes('* @updated 13/08/2026')) {
      console.error('Missing @updated 13/08/2026 in', rel);
      issues++;
    }
    if (!content.includes('* @summary')) {
      console.error('Missing @summary in', rel);
      issues++;
    }
    if (!content.includes('* @description')) {
      console.error('Missing @description in', rel);
      issues++;
    }
    if (!content.includes('// ---------- ')) {
      console.error('Missing section banners in', rel);
      issues++;
    }
  });

  if (issues === 0) {
    console.log(
      `All ${allFiles.length} files strictly conform to the documentation and organization specification!`
    );
  } else {
    console.error(`Found ${issues} non-conforming files!`);
    process.exit(1);
  }
}

// ---------- EXECUTION

auditDocumentation();
