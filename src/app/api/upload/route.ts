import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, getS3Status } from '@/lib/s3';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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
  });
}

/**
 * POST /api/upload
 * Accepts multipart/form-data containing an image file to upload to AWS S3
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'photos';

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

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds 10MB limit. Selected file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
        },
        { status: 400 }
      );
    }

    // Convert file to Node buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to AWS S3 bucket
    const result = await uploadToS3(buffer, file.name, file.type, folder);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully to AWS S3',
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: result.url,
        key: result.key,
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
