import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, parse } from 'path';

const folderPath = Bun.argv[2];
const prefix = Bun.argv[3] || '';

if (!folderPath) {
  console.error('Usage: bun script.ts <folderPath> [prefix]');
  process.exit(1);
}

const files = readdirSync(folderPath)
  .filter((file) => statSync(join(folderPath, file)).isFile())
  .reduce<Record<string, string>>((acc, file) => {
    const { name } = parse(file);
    const filePath = `${prefix.replace(/\/?$/, '/')}${file}`;
    acc[name] = filePath.replace(/\\/g, '/');
    return acc;
  }, {});

const output = `const files = ${JSON.stringify(files, null, 2)};`;

writeFileSync('output.ts', output);
