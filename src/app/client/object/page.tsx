import Image from "next/image";
import { auth } from "@/lib/auth";
import { getClientObjectDetail } from "@/lib/queries";
import { ObjectTabs } from "@/components/client/ObjectTabs";
import { NoObject } from "@/components/client/NoObject";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { STAGE_COLORS, STAGE_LABELS, STAGE_ORDER, overallReadiness } from "@/lib/stages";
import { formatDate, objectTypeLabel } from "@/lib/utils";

export default async function ClientObjectPage({
  searchParams,
}: {
  searchParams: Promise<{ object?: string }>;
}) {
  const session = await auth();
  const { object: objectId } = await searchParams;
  const { objects, object } = await getClientObjectDetail(session!.user.id, objectId);

  if (!object) return <NoObject />;

  const byStage = new Map(object.progress.map((p) => [p.stage, p.percent]));
  const readiness = overallReadiness(object.progress);
  const lastVisit = object.visits[0]?.date;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Мой объект</h1>
        <ObjectTabs objects={objects} activeId={object.id} basePath="/client/object" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6">
            <p className="font-semibold text-ink">Фото объекта</p>
            <p className="text-xs text-ink-muted">
              {object.photoUrl ? "загружено строителем" : "фото ещё не загружено"} ·{" "}
              {formatDate(object.createdAt)}
            </p>
          </div>
          <div className="relative mx-6 my-4 flex h-80 items-center justify-center overflow-hidden rounded-xl bg-cream-200">
            {object.photoUrl ? (
              <Image src={object.photoUrl} alt="Фото объекта" fill className="object-cover" />
            ) : (
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" className="text-ink-muted/40">
                <path
                  d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="9" cy="10" r="1.6" fill="currentColor" />
                <path d="M4 17l5.5-5.5L13 15l3-3 4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
            {object.photoUrl && (
              <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                Фото загружено строителем
              </span>
            )}
          </div>
        </Card>

        <Card>
          <p className="mb-4 font-semibold text-ink">Информация об объекте</p>
          <dl className="flex flex-col gap-3 text-sm">
            <Row label="Тип" value={objectTypeLabel(object.type)} />
            <Row label="Адрес" value={object.address} />
            <Row
              label="Площадь"
              value={`${object.area} м²${object.rooms ? `, ${object.rooms} комнаты` : ""}`}
            />
            <Row label="Строитель" value={object.builder.name} />
            <Row label="Начало работ" value={formatDate(object.startDate)} />
            <Row label="Последний визит" value={lastVisit ? formatDate(lastVisit) : "—"} />
          </dl>
        </Card>
      </div>

      <Card>
        <p className="mb-4 font-semibold text-ink">Общая готовность</p>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-start">
          <ProgressRing percent={readiness} color="#4f8a2e" size={140} strokeWidth={12} />
          <ul className="flex flex-1 flex-col gap-2.5">
            {STAGE_ORDER.map((stage) => (
              <li key={stage} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[stage] }}
                  />
                  {STAGE_LABELS[stage]}
                </span>
                <span className="font-semibold text-ink">{byStage.get(stage) ?? 0}%</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2.5 last:border-0 last:pb-0">
      <dt className="text-ink-light">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
