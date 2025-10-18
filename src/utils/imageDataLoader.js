// src/utils/imageDataLoader.js
import * as fs from 'node:fs/promises';
import path from 'node:path';

export async function loadImageData(galleryName) {
  try {
    const dataPath = path.join('src/photography-data', `${galleryName}.json`);
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Could not load data for gallery: ${galleryName}`);
    return {};
  }
}

export async function getImageExif(imagePath) {
  // Extract gallery name from path (e.g., "birds-wildlife" from "birds-wildlife/image.jpg")
  const galleryName = imagePath.split('/')[0];
  const galleryData = await loadImageData(galleryName);
  return galleryData[imagePath] || null;
}
