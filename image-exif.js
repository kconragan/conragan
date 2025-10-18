import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const EXIF = require('exifreader');

const ESSENTIAL_TAGS = [
  'Make', 'Model', 'LensMake', 'LensModel', 'Lens', 'FocalLength', 
  'FNumber', 'ExposureTime', 'ISOSpeedRatings', 'ExposureBiasValue',
  'DateTimeOriginal', 'GPSLatitude', 'GPSLongitude', 'GPSAltitude',
  'Headline', 'Caption', 'Keywords', 'Orientation'
];

async function getFileHash(filePath) {
  const content = await fs.readFile(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

async function extractEssentialEXIF(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const tags = EXIF.load(imageBuffer);
    
    const essentialData = {};
    for (const tag of ESSENTIAL_TAGS) {
      if (tags[tag]) {
        essentialData[tag] = tags[tag].description || tags[tag].value;
      }
    }
    
    return essentialData;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

async function processImagesIncremental() {
  const photographyDir = 'src/photography';
  const outputDir = 'src/photography-data';
  const cacheFile = path.join(outputDir, '.cache.json');
  
  // Load existing cache
  let cache = {};
  try {
    const cacheData = await fs.readFile(cacheFile, 'utf8');
    cache = JSON.parse(cacheData);
  } catch (error) {
    // Cache doesn't exist or is invalid, start fresh
  }
  
  await fs.mkdir(outputDir, { recursive: true });
  
  async function processDirectory(dirPath, relativePath = '') {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const galleryData = {};
    let hasChanges = false;
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      const relPath = path.join(relativePath, file.name);
      
      if (file.isDirectory()) {
        await processDirectory(fullPath, relPath);
      } else if (/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
        try {
          const currentHash = await getFileHash(fullPath);
          const cachedHash = cache[relPath];
          
          if (currentHash !== cachedHash) {
            console.log(`Processing ${relPath}...`);
            const exifData = await extractEssentialEXIF(fullPath);
            if (exifData) {
              galleryData[relPath] = exifData;
              cache[relPath] = currentHash;
              hasChanges = true;
            }
          } else {
            // Load from existing gallery file if available
            const galleryName = relativePath || 'root';
            const galleryFile = path.join(outputDir, `${galleryName.replace(/[/\\]/g, '-')}.json`);
            try {
              const existingData = JSON.parse(await fs.readFile(galleryFile, 'utf8'));
              if (existingData[relPath]) {
                galleryData[relPath] = existingData[relPath];
              }
            } catch (error) {
              // Gallery file doesn't exist or is invalid
            }
          }
        } catch (error) {
          console.error(`Failed to process ${relPath}:`, error.message);
        }
      }
    }
    
    // Write gallery data if any images found and changes detected
    if (Object.keys(galleryData).length > 0) {
      const galleryName = relativePath || 'root';
      const outputPath = path.join(outputDir, `${galleryName.replace(/[/\\]/g, '-')}.json`);
      
      if (hasChanges) {
        await fs.writeFile(outputPath, JSON.stringify(galleryData, null, 2));
        console.log(`Updated ${outputPath} with ${Object.keys(galleryData).length} images`);
      }
    }
  }
  
  await processDirectory(photographyDir);
  
  // Save updated cache
  await fs.writeFile(cacheFile, JSON.stringify(cache, null, 2));
  console.log('Incremental EXIF processing complete');
}

processImagesIncremental().catch(console.error);
