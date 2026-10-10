import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    hasAccessKey: Boolean(accessKeyId),
    hasSecretKey: Boolean(secretAccessKey),
    maskedAccessKey: accessKeyId ? `${accessKeyId.slice(0, 4)}...${accessKeyId.slice(-4)}` : null,
  };
}

/**
 * Uploads a buffer directly to AWS S3.
 */
export async function uploadToS3(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  subfolder: string = 'photos'
): Promise<UploadResult> {
  // Sanitize filename and create unique timestamped key
  const sanitized = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const key = `${subfolder}/${uniquePrefix}-${sanitized}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
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
    size: buffer.length,
    mimeType,
  };
}

/**
 * Generates an AWS S3 presigned PUT URL for direct browser uploads.
 */
export async function generatePresignedUploadUrl(
  fileName: string,
  mimeType: string,
  subfolder: string = 'photos',
  expiresInSeconds: number = 300
) {
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const key = `${subfolder}/${uniquePrefix}-${sanitized}`;

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
    expiresIn: expiresInSeconds,
  };
}
