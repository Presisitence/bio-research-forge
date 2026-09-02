import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const skillsRoot = path.join(ROOT, 'skills');
const dirs = (await readdir(skillsRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
assert.deepEqual(dirs, [
  'bio-research-orchestrator',
  'evidence-review',
  'experimental-design-gate',
  'local-bio-toolkit',
  'manuscript-argument',
  'omics-workflow',
  'public-bio-databases',
  'quantitative-research',
  'reproducible-analysis',
  'rna-figure-workflow',
  'scientific-figure-delivery',
  'secure-compute-routing',
]);

for (const name of dirs) {
  const skill = await readFile(path.join(skillsRoot, name, 'SKILL.md'), 'utf8');
  const ui = await readFile(path.join(skillsRoot, name, 'agents', 'openai.yaml'), 'utf8');
  assert.match(skill, /^---\r?\nname: /);
  assert.match(skill, new RegExp(`^name: ${name}$`, 'm'));
  assert.match(skill, /^description: .+/m);
  assert(!/\[TODO:|TODO\b/.test(skill));
  assert(ui.includes(`$${name}`), `${name} UI prompt must name the skill`);
}
console.log('skill-structure: ok');
