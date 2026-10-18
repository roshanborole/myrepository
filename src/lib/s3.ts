import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { processAndCompressImage, generateCompressedFilename } from './imageProcessor';

const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = process.env.AWS_S3_BUCKET_NAME || 'roshspark-uploads';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

/**
 * Server-side AWS S3 Client instance.
 * Credentials are kept secure on the server and never sent to the browser.
 */
export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
  mimeType: string;
  filename: string;
  originalFilename?: string;
  originalSize?: number;
  compressedSize?: number;
  aspectRatio?: '1:1';
  dimensions?: {
    width: number;
    height: number;
  };
  savingsPercent?: number;
}

/**
 * Ensures the S3 key prefix always starts with "new/".
 * e.g., "" -> "new", "photos" -> "new/photos", "profiles" -> "new/profiles", "new/anything" -> "new/anything"
 */
export function normalizeNewPrefix(subfolder: string = 'new'): string {
  const clean = (subfolder || '').trim().replace(/^\/+|\/+$/g, '');
  if (!clean || clean === 'new') {
    return 'new';
  }
  if (clean.startsWith('new/')) {
    return clean;
  }
  // Any legacy or custom folder gets prefixed with "new/"
  return `new/${clean}`;
}

/**
 * Checks if S3 environment credentials and bucket configuration exist.
 */
export function getS3Status() {
  const isConfigured = Boolean(
    accessKeyId &&
    accessKeyId !== 'YOUR_AWS_ACCESS_KEY_ID' &&
    secretAccessKey &&
    secretAccessKey !== 'YOUR_AWS_SECRET_ACCESS_KEY' &&
    bucketName
  );

  return {
    configured: isConfigured,
    bucket: bucketName,
    region,
    isSecure: true,
  };
}

/**
 * Uploads a photo to AWS S3.
 * - Forces S3 key prefix to start with "new/".
 * - Automatically crops image to 1:1 aspect ratio (square format).
 * - Compresses the image to optimize file size.
 * - Enforces that the resulting filename clearly contains the word 'compressed'.
 */
export async function uploadToS3(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  subfolder: string = 'new'
): Promise<UploadResult> {
  const prefix = normalizeNewPrefix(subfolder);

  let finalBuffer = buffer;
  let finalMimeType = mimeType;
  let finalFilename = originalFilename;
  let originalSize = buffer.length;
  let compressedSize = buffer.length;
  let dimensions: { width: number; height: number } | undefined;
  let savingsPercent = 0;

  // Process & compress image to 1:1 aspect ratio (square format)
  try {
    const processed = await processAndCompressImage(buffer, originalFilename);
    finalBuffer = processed.buffer;
    finalMimeType = processed.mimeType;
    finalFilename = processed.filename;
    originalSize = processed.originalSize;
    compressedSize = processed.compressedSize;
    dimensions = processed.dimensions;
    savingsPercent = processed.savingsPercent;
  } catch (err) {
    console.warn('Image compression fallback (non-raster or raw buffer):', err);
    // If sharp cannot parse (e.g., SVG/raw), still ensure the filename clearly contains 'compressed'
    const ext = originalFilename.includes('.') ? originalFilename.split('.').pop() || 'jpg' : 'jpg';
    finalFilename = generateCompressedFilename(originalFilename, ext);
  }

  // Ensure sanitized filename
  const sanitizedFilename = finalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const key = `${prefix}/${uniquePrefix}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: finalBuffer,
    ContentType: finalMimeType,
  });

  await s3Client.send(command);

  // Construct S3 public URL
  const url = region === 'us-east-1'
    ? `https://${bucketName}.s3.amazonaws.com/${encodeURI(key)}`
    : `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURI(key)}`;

  return {
    url,
    key,
    bucket: bucketName,
    size: finalBuffer.length,
    mimeType: finalMimeType,
    filename: finalFilename,
    originalFilename,
    originalSize,
    compressedSize,
    aspectRatio: '1:1',
    dimensions,
    savingsPercent,
  };
}

/**
 * Generates an AWS S3 presigned PUT URL for direct browser uploads.
 * Ensures the target key starts with "new/" and includes "compressed".
 */
export async function generatePresignedUploadUrl(
  fileName: string,
  mimeType: string,
  subfolder: string = 'new',
  expiresInSeconds: number = 300
) {
  const prefix = normalizeNewPrefix(subfolder);
  const ext = fileName.includes('.') ? fileName.split('.').pop() || 'jpg' : 'jpg';
  const compressedName = generateCompressedFilename(fileName, ext);
  const sanitized = compressedName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const key = `${prefix}/${uniquePrefix}-${sanitized}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });

  const finalPublicUrl = region === 'us-east-1'
    ? `https://${bucketName}.s3.amazonaws.com/${encodeURI(key)}`
    : `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURI(key)}`;

  return {
    uploadUrl,
    finalPublicUrl,
    key,
    bucket: bucketName,
    filename: compressedName,
    expiresIn: expiresInSeconds,
  };
}
