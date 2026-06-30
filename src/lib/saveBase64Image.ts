import fs from 'fs';
import path from 'path';

/**
 * If the image string is a base64 data URI, saves it to disk as a file
 * in /public/uploads/articles/ and returns the public URL path.
 * If it's already an HTTP/S URL, returns it as-is.
 * If null/undefined, returns the input as-is.
 */
export async function resolveArticleImage(
  image: string | null | undefined,
  slugHint?: string
): Promise<string | null | undefined> {
  if (!image || !image.startsWith('data:')) return image;

  // Parse the data URI: data:image/jpeg;base64,<data>
  const matches = image.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) return image;

  const mimeType = matches[1]; // e.g. image/jpeg
  const base64Data = matches[2];
  const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles');
  fs.mkdirSync(uploadDir, { recursive: true });

  const filename = `${slugHint ? slugHint.slice(0, 40).replace(/[^a-z0-9-]/gi, '-') + '-' : ''}${Date.now()}.${ext}`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

  return `/uploads/articles/${filename}`;
}
