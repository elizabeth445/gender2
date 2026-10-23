import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

// Heuristic local scan. Report locations and types, never credential values.
const root = process.cwd();
const excluded = new Set([
  '.git',
  'node_modules',
  'dist',
  'output',
  'playwright-report',
  'test-results',
  'coverage',
  '.vercel',
  '.cache',
  '.vite',
  '.turbo',
  '.npm',
  '__pycache__',
  'tmp',
  'temp',
]);
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (excluded.has(entry.name) || entry.isSymbolicLink()) return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path);
    if (entry.name.startsWith('.env') && entry.name !== '.env.example') return [];
    return entry.isFile() ? [relative(root, path)] : [];
  });
}
const isGit =
  spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' }).stdout?.trim() ===
  'true';
const listing = isGit
  ? spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
      encoding: 'utf8',
    })
  : null;
if (listing && listing.status !== 0) throw new Error('Cannot enumerate intended Git files.');
const files = listing ? [...new Set(listing.stdout.split('\0').filter(Boolean))] : walk(root);
const staged = isGit
  ? spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], {
      encoding: 'utf8',
    })
  : null;
if (staged && staged.status !== 0) throw new Error('Cannot enumerate staged files.');
const stagedFiles = new Set(staged?.stdout.split('\0').filter(Boolean));
const patterns = [
  ['private key', /-----BEGIN (?:[A-Z]+ )*PRIVATE KEY-----/g],
  ['OpenAI token', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}/g],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})/g],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['Stripe secret', /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}/g],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{20,}/g],
  ['credential in URL', /\b(?:https?|postgres(?:ql)?|mongodb(?:\+srv)?):\/\/[^\s/:]+:[^\s/@]+@/g],
  [
    'literal credential',
    /\b(?:api[_-]?key|client[_-]?secret|password|passwd|access[_-]?token|auth[_-]?token)\b\s*[:=]\s*["']([^"'\r\n]{8,})["']/gi,
  ],
  [
    'environment credential',
    /^\s*[A-Z_]*(?:API_KEY|SECRET|PASSWORD|TOKEN)[A-Z_]*\s*=\s*([^\s#]{8,})/gm,
  ],
];
const placeholder =
  /^(?:["']?\$\{[^}]+\}["']?|(?:your|example|placeholder|dummy|test|replace|changeme|change-me|sample|insert|redacted)(?:[-_\s].*)?|[xX*]{8,})$/;
let findings = 0;
let checked = 0;
for (const file of files) {
  if (/(?:^|\/)\.env(?!\.example$)(?:\.|$)/.test(file)) {
    console.error(`${file}: local environment file is tracked; review before publication.`);
    findings += 1;
  }
  const sources = [];
  try {
    sources.push([file, readFileSync(join(root, file))]);
  } catch {
    // A staged file may already have been removed from the working directory.
  }
  if (stagedFiles.has(file)) {
    const indexed = spawnSync('git', ['show', `:${file}`], { maxBuffer: 64 * 1024 * 1024 });
    if (indexed.status !== 0) throw new Error('Cannot inspect a staged file.');
    sources.push([`${file} (index)`, indexed.stdout]);
  }
  for (const [label, buffer] of sources) {
    if (buffer.includes(0)) continue; // Preserve binary assets without interpreting them as text.
    const content = buffer.toString('utf8');
    checked += 1;
    for (const [type, pattern] of patterns) {
      for (const match of content.matchAll(pattern)) {
        const value = (match[1] ?? match[0]).replace(/^["']|["']$/g, '');
        if (placeholder.test(value)) continue;
        const line = content.slice(0, match.index).split('\n').length;
        console.error(`${label}:${line}: potential ${type}`);
        findings += 1;
      }
    }
  }
}
console.log(
  `Secret scan: ${checked} text file versions, ${findings} potential findings${isGit ? '' : ' (no Git history present)'}.`,
);
process.exitCode = findings ? 1 : 0;
