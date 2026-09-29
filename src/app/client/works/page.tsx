import { auth } from "@/lib/auth";
import { getClientObjectDetail } from "@/lib/queries";
import { ObjectTabs } from "@/components/client/ObjectTabs";
import { NoObject } from "@/components/client/NoObject";
import { WorksView } from "@/components/client/WorksView";
import { overallReadiness } from "@/lib/stages";
import { formatDate } from "@/lib/utils";

export default async function ClientWorksPage({
  searchParams,
}: {
  searchParams: Promise<{ object?: string }>;
}) {
  const session = await auth();
  const { object: objectId } = await searchParams;
  const { objects, object } = await getClientObjectDetail(session!.user.id, objectId);

  if (!object) return <NoObject />;

  const progressMap = new Map(object.progress.map((p) => [p.stage, p.percent]));
  const updatedAt = object.progress
    .map((p) => p.updatedAt)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Типы работ</h1>
          <p className="text-sm text-ink-muted">
            Прогресс заполняет строитель{updatedAt ? ` · обновлено ${formatDate(updatedAt)}` : ""}
          </p>
        </div>
        <ObjectTabs objects={objects} activeId={object.id} basePath="/client/works" />
      </div>

      <WorksView progress={progressMap} readiness={overallReadiness(object.progress)} />
    </div>
  );
}
