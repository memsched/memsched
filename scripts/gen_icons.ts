/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
