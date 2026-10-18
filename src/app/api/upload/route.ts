import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, getS3Status } from '@/lib/s3';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB input limit before compression
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

/**
 * GET /api/upload
 * Returns AWS S3 configuration status
 */
export async function GET() {
  const status = getS3Status();
  return NextResponse.json({
    success: true,
    status,
    rules: {
      s3Prefix: 'new/',
      aspectRatio: '1:1 (square)',
      compression: 'enabled',
      filenameFormat: '*_compressed.* or *-compressed.*',
    },
  });
}

/**
 * POST /api/upload
 * Accepts multipart/form-data containing an image file to crop to 1:1 square,
 * compress, and upload to AWS S3 under the "new/" prefix.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'new';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided in request' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type: ${file.type}. Please upload an image (JPEG, PNG, WebP, GIF, SVG, AVIF).`,
        },
        { status: 400 }
      );
    }

    // Validate raw input file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds 15MB limit. Selected file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
        },
        { status: 400 }
      );
    }

    // Convert file to Node buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to AWS S3 bucket (performs 1:1 square crop, compression, and new/ prefixing)
    const result = await uploadToS3(buffer, file.name, file.type, folder);

    return NextResponse.json({
      success: true,
      message: 'Image compressed, cropped to 1:1 square, and uploaded successfully to AWS S3 under new/ prefix',
      file: {
        name: result.filename, // Contains 'compressed'
        originalName: file.name,
        size: result.size, // Compressed size
        originalSize: result.originalSize ?? file.size,
        savingsPercent: result.savingsPercent ?? 0,
        aspectRatio: '1:1',
        dimensions: result.dimensions,
        type: result.mimeType,
        url: result.url,
        key: result.key, // Starts with new/
        bucket: result.bucket,
      },
    });
  } catch (error: any) {
    console.error('AWS S3 Upload Error:', error);

    // Provide detailed diagnostics for AWS specific issues
    let userHint = 'Failed to upload photo to AWS S3.';
    if (error?.name === 'InvalidAccessKeyId' || error?.name === 'SignatureDoesNotMatch') {
      userHint = 'AWS credentials invalid. Please check your AWS Access Key ID and Secret Access Key in .env.';
    } else if (error?.name === 'NoSuchBucket') {
      userHint = `The specified S3 bucket does not exist. Please create the bucket in your AWS S3 Console or update AWS_S3_BUCKET_NAME in .env.`;
    } else if (error?.name === 'AccessDenied') {
      userHint = 'AWS S3 Access Denied. Ensure your IAM user has PutObject permissions on the target S3 bucket.';
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to upload photo to AWS S3',
        code: error?.name || 'S3_UPLOAD_ERROR',
        hint: userHint,
      },
      { status: 500 }
    );
  }
}
