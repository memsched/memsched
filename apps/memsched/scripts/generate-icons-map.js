#!/usr/bin/env node
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

/**
 * Script to generate a JavaScript object mapping icon filenames (without extensions)
 * to their paths in the format /icons/foldername/icon.svg
 *
 * Usage: node generate-icons-map.js <icons-folder> <output-file> [base-path]
 *
 * Example: node generate-icons-map.js ./static/icons ./src/lib/generated-icons.ts /icons
 */

import { lstatSync, readdirSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';

// Get command line arguments
const [, , iconsFolder, outputFile, basePath = '/icons'] = process.argv;

if (!iconsFolder || !outputFile) {
  console.error('Usage: node generate-icons-map.js <icons-folder> <output-file> [base-path]');
  process.exit(1);
}

function generateIconsMaps(folderPath, basePath) {
  const iconCategories = {};
  const isDirectory = lstatSync(folderPath).isDirectory();

  if (!isDirectory) {
    console.error(`${folderPath} is not a directory`);
    process.exit(1);
  }

  // Get all folders within the icons folder
  const iconFolders = readdirSync(folderPath).filter((item) =>
    lstatSync(join(folderPath, item)).isDirectory()
  );

  // Process each folder as a category
  iconFolders.forEach((folder) => {
    const categoryName = folder.toUpperCase().replace(/-/g, '_');
    const categoryIcons = {};
    const folderPath2 = join(folderPath, folder);

    const files = readdirSync(folderPath2).filter((file) => {
      const filePath = join(folderPath2, file);
      const isFile = lstatSync(filePath).isFile();
      const isSvg = file.toLowerCase().endsWith('.svg');
      return isFile && isSvg;
    });

    // Add each file to the category icons object
    files.forEach((file) => {
      const fileName = basename(file, extname(file));
      const iconPath = `${basePath}/${folder}/${file}`;
      categoryIcons[fileName] = iconPath;
    });

    // Only add the category if it has icons
    if (Object.keys(categoryIcons).length > 0) {
      iconCategories[folder] = {
        name: categoryName,
        icons: categoryIcons,
      };
    }
  });

  return iconCategories;
}

try {
  // Generate the icons mappings by category
  const iconCategories = generateIconsMaps(iconsFolder, basePath);
  const categoryNames = Object.keys(iconCategories);

  if (categoryNames.length === 0) {
    console.warn('No icon categories found. Check if your icons folder structure is correct.');
    process.exit(0);
  }

  // Build the TypeScript output
  let output = `/**
 * Auto-generated icon mappings
 * Generated on: ${new Date().toISOString()}
 */

`;

  // Add each category constant
  categoryNames.forEach((category) => {
    const { name, icons } = iconCategories[category];
    output += `export const ${name}: Record<string, string> = ${JSON.stringify(icons, null, 2)};\n\n`;
  });

  // Write the output to the file
  writeFileSync(outputFile, output);

  const totalIcons = categoryNames.reduce(
    (total, category) => total + Object.keys(iconCategories[category].icons).length,
    0
  );

  console.log(
    `Generated icon mappings with ${totalIcons} icons across ${categoryNames.length} categories:`
  );
  categoryNames.forEach((category) => {
    const iconCount = Object.keys(iconCategories[category].icons).length;
    console.log(`  - ${category}: ${iconCount} icons`);
  });
  console.log(`Output written to ${outputFile}`);
} catch (error) {
  console.error('Error generating icons map:', error);
  process.exit(1);
}
