// image-exif.js
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const EXIF = require('exifreader');

async function extractEXIFData(imagePath) {
    try {
        const imageBuffer = await fs.readFile(imagePath);
        const tags = EXIF.load(imageBuffer);
        return tags;
    } catch (error) {
        console.error(`Error processing ${imagePath}:`, error);
        return null;
    }
}

async function processImages() {
    const imageData = {};
    const photographyDir = 'src/photography';
    const outputFilePath = 'src/image-data.json';

    async function traverseDir(dir) {
        const files = await fs.readdir(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                await traverseDir(fullPath); // Recursive call for subdirectories
            } else if (/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
                const exifData = await extractEXIFData(fullPath);
                if (exifData) {
                    imageData[fullPath] = exifData;
                }
            }
        }
    }

    await traverseDir(photographyDir);

    await fs.writeFile(outputFilePath, JSON.stringify(imageData, null, 2));
    console.log(`EXIF data written to ${outputFilePath}`);
}

processImages();
