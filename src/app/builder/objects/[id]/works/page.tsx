import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBuilderObjectDetail, getBuilderObjectsList } from "@/lib/queries";
import { ObjectSwitcher } from "@/components/builder/ObjectSwitcher";
import { WorksEditor } from "@/components/builder/WorksEditor";
import { updateProgressAction } from "@/lib/actions/progress";
import { STAGE_ORDER } from "@/lib/stages";
import { objectTypeLabel } from "@/lib/utils";
import type { StageType } from "@prisma/client";

export default async function BuilderWorksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const [object, objects] = await Promise.all([
    getBuilderObjectDetail(session!.user.id, id),
    getBuilderObjectsList(session!.user.id),
  ]);
  if (!object) notFound();

  const progressMap = Object.fromEntries(
    STAGE_ORDER.map((s) => [s, object.progress.find((p) => p.stage === s)?.percent ?? 0])
  ) as Record<StageType, number>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Заполнение типов работ</h1>
          <p className="text-sm text-ink-muted">
            {objectTypeLabel(object.type)} · {object.address}
          </p>
        </div>
        <ObjectSwitcher objects={objects} currentId={object.id} />
      </div>

      <WorksEditor objectId={object.id} initialProgress={progressMap} action={updateProgressAction} />
    </div>
  );
}
