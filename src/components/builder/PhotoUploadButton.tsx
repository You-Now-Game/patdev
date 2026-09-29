"use client";

import { useRef, useTransition } from "react";

export function PhotoUploadButton({
  objectId,
  action,
  hasPhoto,
}: {
  objectId: string;
  action: (objectId: string, formData: FormData) => Promise<void>;
  hasPhoto: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const boundAction = action.bind(null, objectId);

  return (
    <form
      ref={formRef}
      action={boundAction}
      className="w-full"
      onChange={(e) => {
        e.preventDefault();
        startTransition(() => {
          formRef.current?.requestSubmit();
        });
      }}
    >
      <label className="block w-full cursor-pointer rounded-xl border border-border px-3 py-2 text-center text-sm font-semibold text-ink-light hover:bg-cream-200">
        {isPending ? "Загрузка…" : hasPhoto ? "Сменить фото" : "Загрузить фото"}
        <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="hidden" />
      </label>
    </form>
  );
}
