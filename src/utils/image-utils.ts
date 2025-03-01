import path from 'path';
import { stat } from 'node:fs/promises';

export async function getCoverImage(galleryDir: string): Promise<string | null> {
  const coverImageNames = ['cover.jpg', 'cover.png', 'cover.webp'];
  for (const imageName of coverImageNames) {
    const imagePath = path.join('./src/content/photography/', galleryDir, imageName);
    try {
      // Check if the file exists
      await import('node:fs/promises').then(fs => fs.stat(imagePath)); // Use fs.promises.stat
      return `/src/content/photography/${galleryDir}/${imageName}`; // Return the path if it exists
    } catch (error: any) {
      // File doesn't exist, continue to the next one
      if (error.code !== 'ENOENT') {
        console.error(`Error checking for cover image ${imagePath}:`, error); // Log unexpected errors
      }
    }
  }
  return null; // No cover image found
}
