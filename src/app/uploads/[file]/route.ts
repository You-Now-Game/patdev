import { readFile } from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "@/lib/storage";

// Next.js в production отдаёт из /public только файлы, которые были там на
// момент сборки. Фото объектов загружаются позже, поэтому их отдаёт этот
// обработчик прямо с диска (тома patina_uploads).
const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Только имена, которые генерирует saveObjectPhoto: <uuid>.<ext>.
const FILE_NAME = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const match = FILE_NAME.exec(file);
  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await readFile(path.join(UPLOAD_DIR, file));
    return new Response(data, {
      headers: {
        "Content-Type": CONTENT_TYPES[match[1]],
        // Имя файла уникально и содержимое по нему не меняется.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
