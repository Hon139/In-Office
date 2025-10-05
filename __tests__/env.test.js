import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(process.cwd());
const envPath = path.join(repoRoot, '.env');

function parseEnv(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      if (idx === -1) return null;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      return { key, val };
    })
    .filter(Boolean);
}

describe('.env file', () => {
  test('.env file is present', () => {
    const exists = fs.existsSync(envPath);
    expect(exists).toBe(true);
  });

  test('has no undefined or empty values', () => {
    if (!fs.existsSync(envPath)) {
      // skip this test if .env doesn't exist; first test will fail appropriately
      return;
    }

    const content = fs.readFileSync(envPath, 'utf8');
    const pairs = parseEnv(content);
    // ensure there is at least one variable
    expect(pairs.length).toBeGreaterThan(0);

    const bad = pairs.filter((p) => p.val === '' || p.val.toLowerCase() === 'undefined');
    if (bad.length > 0) {
      const keys = bad.map((b) => b.key).join(', ');
      throw new Error(`Found undefined/empty values for keys: ${keys}`);
    }
  });
});
