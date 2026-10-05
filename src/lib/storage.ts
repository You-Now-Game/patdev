import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 МБ, как указано на макете

export class UploadError extends Error {}

/**
 * Сохраняет фото объекта на локальный диск в /public/uploads и возвращает
 * публичный URL. При переезде на облачное хранилище (S3-совместимое —
 * Yandex Object Storage, Selectel и т.п.) достаточно заменить реализацию
 * этой функции — вызывающий код (server actions) менять не нужно.
 */
export async function saveObjectPhoto(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError("Допустимы только файлы JPG, PNG или WEBP");
  }
  if (file.size > MAX_SIZE) {
    throw new UploadError("Файл превышает допустимый размер 10 МБ");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}
