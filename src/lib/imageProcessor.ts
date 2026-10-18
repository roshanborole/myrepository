import sharp from 'sharp';

export interface ProcessedImageResult {
  buffer: Buffer;
  filename: string;
  originalFilename: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  aspectRatio: '1:1';
  savingsPercent: number;
}

export interface ImageProcessingOptions {
  maxDimension?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png' | 'match-original';
}

/**
 * Sanitizes and generates a filename that clearly contains the word 'compressed'.
 * e.g., "fan_avatar.jpg" -> "fan_avatar-compressed.jpg"
 */
export function generateCompressedFilename(originalFilename: string, targetExt: string): string {
  // Strip path and get base name
  const basename = originalFilename.replace(/^.*[\\/]/, '');
  const lastDot = basename.lastIndexOf('.');
  const rawName = lastDot > 0 ? basename.substring(0, lastDot) : basename;

  // Clean name: alphanumeric, dashes, underscores
  let cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').trim();
  if (!cleanName) cleanName = 'photo';

  // Ensure 'compressed' is clearly in the filename without duplicating
  const lower = cleanName.toLowerCase();
  let finalBaseName: string;
  if (lower.endsWith('compressed') || lower.endsWith('-compressed') || lower.endsWith('_compressed')) {
    finalBaseName = cleanName;
  } else {
    finalBaseName = `${cleanName}-compressed`;
  }

  const cleanExt = targetExt.replace(/^\./, '').toLowerCase();
  return `${finalBaseName}.${cleanExt}`;
}

/**
 * Crops an image to an exact 1:1 aspect ratio (square format) with center alignment,
 * compresses the file to optimize storage and loading, and returns the processed buffer.
 */
export async function processAndCompressImage(
  inputBuffer: Buffer,
  originalFilename: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> {
  const maxDimension = options.maxDimension || 1080;
  const quality = options.quality || 80;

  // Load image metadata
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  const originalWidth = metadata.width || 800;
  const originalHeight = metadata.height || 800;

  // Calculate 1:1 square dimensions (center crop)
  const minDimension = Math.min(originalWidth, originalHeight);
  const targetDimension = Math.min(minDimension, maxDimension);

  // Determine output format
  const origFormat = (metadata.format || '').toLowerCase();
  let outputFormat: 'jpeg' | 'webp' | 'png' = 'jpeg';
  let targetExt = 'jpg';
  let mimeType = 'image/jpeg';

  if (options.format && options.format !== 'match-original') {
    outputFormat = options.format;
  } else if (origFormat === 'webp') {
    outputFormat = 'webp';
  } else if (origFormat === 'png') {
    // If PNG has transparency, keep PNG to preserve alpha
    outputFormat = metadata.hasAlpha ? 'png' : 'jpeg';
  } else {
    outputFormat = 'jpeg';
  }

  // Set extension and mime type
  if (outputFormat === 'webp') {
    targetExt = 'webp';
    mimeType = 'image/webp';
  } else if (outputFormat === 'png') {
    targetExt = 'png';
    mimeType = 'image/png';
  } else {
    targetExt = 'jpg';
    mimeType = 'image/jpeg';
  }

  // Build sharp pipeline: rotate EXIF, crop to 1:1 square, and compress
  let pipeline = sharp(inputBuffer)
    .rotate() // Auto-orient based on EXIF orientation tag
    .resize(targetDimension, targetDimension, {
      fit: 'cover',
      position: 'center', // 1:1 aspect ratio center crop
    });

  if (outputFormat === 'webp') {
    pipeline = pipeline.webp({ quality, effort: 4 });
  } else if (outputFormat === 'png') {
    pipeline = pipeline.png({ compressionLevel: 8, quality });
  } else {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  }

  const { data: compressedBuffer, info } = await pipeline.toBuffer({ resolveWithObject: true });

  const finalFilename = generateCompressedFilename(originalFilename, targetExt);
  const originalSize = inputBuffer.length;
  const compressedSize = compressedBuffer.length;
  const savingsPercent = originalSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return {
    buffer: compressedBuffer,
    filename: finalFilename,
    originalFilename,
    mimeType,
    originalSize,
    compressedSize,
    dimensions: {
      width: info.width,
      height: info.height,
    },
    aspectRatio: '1:1',
    savingsPercent,
  };
}
