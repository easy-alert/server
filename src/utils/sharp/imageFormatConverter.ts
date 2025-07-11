// utils/imageFormatConverter.ts
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Ensures the image is in PNG or JPEG format for PDF compatibility.
 * If the image is webp, converts it to PNG and returns the new file path.
 * Otherwise, returns the original file path.
 *
 * @param imagePath - The path to the image file to check/convert
 * @param preferredFormat - 'png' or 'jpeg' (default: 'png')
 * @returns The path to a PNG/JPEG image file
 */
export async function ensurePdfCompatibleImage(
  imagePath: string,
  preferredFormat: 'png' | 'jpeg' = 'png',
): Promise<string> {
  const ext = path.extname(imagePath).toLowerCase();
  if (ext === '.webp') {
    const outputPath = imagePath.replace(/\.webp$/i, `.${preferredFormat}`);
    // Only convert if not already converted
    if (!fs.existsSync(outputPath)) {
      await sharp(imagePath).toFormat(preferredFormat).toFile(outputPath);
    }
    return outputPath;
  }
  // Optionally, you could also convert other unsupported formats here
  return imagePath;
}
