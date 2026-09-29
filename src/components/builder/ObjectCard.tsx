import Image from "next/image";
import Link from "next/link";
import { PhotoUploadButton } from "./PhotoUploadButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { uploadPhotoAction } from "@/lib/actions/objects";
import { overallReadiness } from "@/lib/stages";
import { formatDate, objectTypeLabel } from "@/lib/utils";
import type { ConstructionObject, WorkProgress, User } from "@prisma/client";

type ObjectWithRelations = ConstructionObject & {
  progress: WorkProgress[];
  client: Pick<User, "name" | "email"> | null;
};

export function ObjectCard({ object }: { object: ObjectWithRelations }) {
  const readiness = overallReadiness(object.progress);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white p-4">
      <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-cream-200">
        {object.photoUrl ? (
          <Image src={object.photoUrl} alt={object.address} fill className="object-cover" />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-ink-muted/40">
            <path
              d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="9" cy="10" r="1.6" fill="currentColor" />
            <path d="M4 17l5.5-5.5L13 15l3-3 4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
      </div>

      <span className="mb-2 inline-flex w-fit items-center rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-brand-dark">
        {objectTypeLabel(object.type)}
      </span>

      <p className="font-semibold text-ink">{object.address}</p>
      <p className="mb-3 text-sm text-ink-muted">
        {object.area} м² · {object.status === "DONE" ? "завершён" : "в работе"}
        {object.client ? ` · ${object.client.name}` : ""}
      </p>

      <ProgressBar percent={readiness} color={object.status === "DONE" ? "#3fae6a" : "#e0913f"} />
      <p className="mb-3 mt-2 text-sm font-semibold text-ink">Готовность {readiness}%</p>

      <dl className="mb-4 flex flex-col gap-1 text-xs text-ink-muted">
        <div className="flex justify-between">
          <dt>Начало</dt>
          <dd className="font-medium text-ink">{formatDate(object.startDate)}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-2">
        <Link
          href={`/builder/objects/${object.id}/works`}
          className="rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Открыть объект
        </Link>
        <PhotoUploadButton
          objectId={object.id}
          action={uploadPhotoAction}
          hasPhoto={Boolean(object.photoUrl)}
        />
      </div>
    </div>
  );
}
