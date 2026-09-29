import { auth } from "@/lib/auth";
import { getClientObjectDetail } from "@/lib/queries";
import { ObjectTabs } from "@/components/client/ObjectTabs";
import { NoObject } from "@/components/client/NoObject";
import { VisitsLog } from "@/components/client/VisitsLog";
import { Card } from "@/components/ui/Card";
import { formatDate, formatHours, hoursBetween } from "@/lib/utils";

export default async function ClientVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ object?: string }>;
}) {
  const session = await auth();
  const { object: objectId } = await searchParams;
  const { objects, object } = await getClientObjectDetail(session!.user.id, objectId);

  if (!object) return <NoObject />;

  const totalHours = object.visits.reduce((sum, v) => sum + hoursBetween(v.timeFrom, v.timeTo), 0);
  const lastVisit = object.visits[0]?.date;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Журнал визитов строителя</h1>
        <ObjectTabs objects={objects} activeId={object.id} basePath="/client/visits" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-muted">Визитов на объекте</p>
          <p className="mt-1 text-2xl font-bold text-ink">{object.visits.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">Последний визит</p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {lastVisit ? formatDate(lastVisit) : "—"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">Часов на объекте</p>
          <p className="mt-1 text-2xl font-bold text-ink">{formatHours(totalHours)}</p>
        </Card>
      </div>

      <VisitsLog visits={object.visits} />
    </div>
  );
}
