import sharp from 'sharp';
import { Readable } from 'stream';
import { getImageStreamFromS3 } from '../aws/getImageStreamFromS3';

// Utility to validate image URLs
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const lower = url.toLowerCase();
  if (!lower.startsWith('http')) return false;
  if (!validExtensions.some((ext) => lower.includes(ext))) return false;
  return true;
};

// Helper to convert stream to buffer
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: any = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks) as any));
    stream.on('error', reject);
  });
}

/**
 * Processes an array of image objects for PDF generation.
 * Downloads, validates, and converts images to PNG base64 for PDFMake.
 * Returns { imagesForPDF, skippedImages }
 *
 * @param images Array of { url: string }
 */
export async function processImagesForPDF({
  images,
  width = 100,
  height = 100,
}: {
  images: { url: string }[];
  width?: number;
  height?: number;
}) {
  const skippedImages: { url: string; reason: string }[] = [];
  const allResults = await Promise.all(
    (images || []).map(async (img) => {
      let { url } = img || {};
      if (!isValidImageUrl(url)) {
        skippedImages.push({ url: url || '', reason: 'URL inválida ou extensão não suportada' });
        return null;
      }
      url = encodeURI(url);
      try {
        const imageStream = await getImageStreamFromS3(url);
        const buffer = await streamToBuffer(imageStream);
        if (!buffer || buffer.length === 0) {
          skippedImages.push({ url, reason: 'Buffer vazio' });
          return null;
        }
        // Check for HTML masquerading as image (e.g., S3 error page)
        const bufferSample = buffer.slice(0, 64).toString('utf8');
        if (bufferSample.startsWith('<!DOCTYPE') || bufferSample.startsWith('<html')) {
          skippedImages.push({ url, reason: 'Conteúdo HTML recebido em vez de imagem (possível erro de permissão, URL inválida ou objeto não encontrado)' });
          return null;
        }
        const imageType = await sharp(buffer).metadata();
        if (!imageType.format || !['jpeg', 'png', 'webp'].includes(imageType.format)) {
          skippedImages.push({ url, reason: `Formato não suportado (${imageType.format})` });
          return null;
        }
        // Compress to JPEG, lower quality, and smaller size for PDF size reduction
        const processedBuffer = await sharp(buffer)
          .rotate()
          .resize({ width: 400, height: 400, fit: 'inside' })
          .jpeg({ quality: 60 })
          .toBuffer();
        // Validate processed JPEG buffer
        try {
          const verify = await sharp(processedBuffer).metadata();
          if (!verify.format || verify.format !== 'jpeg') {
            skippedImages.push({ url, reason: 'JPEG pós-processamento inválido' });
            return null;
          }
        } catch (verifyErr) {
          skippedImages.push({ url, reason: `Erro ao validar JPEG pós-processamento: ${(verifyErr as Error).message || verifyErr}` });
          return null;
        }
        const base64Image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
        if (!base64Image.startsWith('data:image/')) {
          skippedImages.push({ url, reason: 'dataURL inválido' });
          return null;
        }
        return {
          image: base64Image,
          width,
          height,
          link: url,
        };
      } catch (err) {
        skippedImages.push({ url, reason: 'Erro de formato ou processamento' });
        return null;
      }
    })
  );
  // Defensive: filter out any invalid image objects before returning
  const validImagesForPDF = (allResults || []).filter(
    img => img && typeof img.image === 'string' && img.image.startsWith('data:image/')
  );
  if (allResults.length !== validImagesForPDF.length) {
    console.error('[processImagesForPDF] Some invalid image objects were filtered out before returning:', allResults);
  }
  return { imagesForPDF: validImagesForPDF, skippedImages };
}
