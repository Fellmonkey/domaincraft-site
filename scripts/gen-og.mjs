// Generates per-post Open Graph images (1200×630) into public/og/.
// Run: node scripts/gen-og.mjs   (PNGs are committed; rerun when posts change)
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const postsDir = join(root, 'src/content/blog');
const outDir = join(root, 'public/og');

const posts = [
  ...readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ id: f.replace(/\.md$/, ''), file: join(postsDir, f) })),
  ...readdirSync(join(postsDir, 'ru'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ id: `ru-${f.replace(/\.md$/, '')}`, file: join(postsDir, 'ru', f) }))
];

function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return fm;
}

function wrap(title, maxChars = 32) {
  const lines = [];
  let line = '';
  for (const word of title.split(/\s+/)) {
    if ((line + ' ' + word).trim().length > maxChars) {
      lines.push(line.trim());
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 3);
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function svg(title, date) {
  const lines = wrap(title);
  const lineHeight = 86;
  const titleStart = 230 + (3 - lines.length) * (lineHeight / 2);
  const titleEls = lines
    .map(
      (l, i) =>
        `<text x="80" y="${titleStart + i * lineHeight}" font-family="Geist Variable, Arial, sans-serif" font-size="62" font-weight="700" fill="#fafafa">${escapeXml(l)}</text>`
    )
    .join('\n  ');
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 -120) rotate(90) scale(900)">
      <stop offset="0" stop-color="#f97316" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="6" fill="#f97316"/>
  <text x="80" y="112" font-family="JetBrains Mono Variable, Consolas, monospace" font-size="34" font-weight="600" fill="#f97316" letter-spacing="2">domaincraft</text>
  <text x="1120" y="112" font-family="JetBrains Mono Variable, Consolas, monospace" font-size="34" font-weight="600" fill="#52525b" letter-spacing="2" text-anchor="end">domaincraft.github.io</text>
  ${titleEls}
  <line x1="80" y1="520" x2="1120" y2="520" stroke="#27272a" stroke-width="2"/>
  <text x="80" y="566" font-family="Geist Variable, Arial, sans-serif" font-size="26" fill="#a1a1aa">${escapeXml(date)}</text>
  <text x="1120" y="566" font-family="Geist Variable, Arial, sans-serif" font-size="26" fill="#a1a1aa" text-anchor="end">domain compiler</text>
</svg>`;
}

mkdirSync(outDir, { recursive: true });

for (const post of posts) {
  const fm = frontmatter(post.file);
  if (!fm.title) continue;
  const date = fm.date || new Date().toISOString().slice(0, 10);
  await sharp(Buffer.from(svg(fm.title, date))).png().toFile(join(outDir, `${post.id}.png`));
  console.log('✓', post.id);
}