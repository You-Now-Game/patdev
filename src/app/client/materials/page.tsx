import { auth } from "@/lib/auth";
import { getClientObjectDetail } from "@/lib/queries";
import { ObjectTabs } from "@/components/client/ObjectTabs";
import { NoObject } from "@/components/client/NoObject";
import { StageChip } from "@/components/ui/StageChip";
import { MATERIAL_STAGE_ORDER } from "@/lib/stages";

export default async function ClientMaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ object?: string }>;
}) {
  const session = await auth();
  const { object: objectId } = await searchParams;
  const { objects, object } = await getClientObjectDetail(session!.user.id, objectId);

  if (!object) return <NoObject />;

  const byStage = MATERIAL_STAGE_ORDER.map((stage) => ({
    stage,
    materials: object.materials.filter((m) => m.stage === stage),
  })).filter((g) => g.materials.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Материалы на объекте</h1>
        <ObjectTabs objects={objects} activeId={object.id} basePath="/client/materials" />
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <p className="mb-4 text-sm text-ink-muted">
          Список по типам работ и остаток · первоначально у всех позиций 0
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-ink-muted">
              <th className="pb-2 font-medium">Тип работ</th>
              <th className="pb-2 font-medium">Материал</th>
              <th className="pb-2 font-medium">Ед. изм.</th>
              <th className="pb-2 text-right font-medium">Осталось</th>
            </tr>
          </thead>
          <tbody>
            {byStage.map((group) =>
              group.materials.map((m, i) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="py-3">{i === 0 ? <StageChip stage={group.stage} /> : null}</td>
                  <td className="py-3 text-ink">{m.name}</td>
                  <td className="py-3 text-ink-light">{m.unit}</td>
                  <td className="py-3 text-right font-semibold text-ink">
                    {m.remaining > 0 ? m.remaining : 0}
                  </td>
                </tr>
              ))
            )}
            {byStage.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-ink-muted">
                  Материалы ещё не добавлены строителем
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="mt-4 rounded-xl bg-cream-200 px-4 py-3 text-sm text-ink-light">
          Дизайн-макет — материалы не требуются. Новые позиции появляются, когда их добавляет
          строитель.
        </p>
      </div>
    </div>
  );
}
