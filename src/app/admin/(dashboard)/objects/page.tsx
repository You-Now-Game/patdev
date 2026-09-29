import { getAllObjectsOverview } from "@/lib/queries";
import { overallReadiness } from "@/lib/stages";
import { formatDate, objectTypeLabel } from "@/lib/utils";

// Страница не вызывает auth()/cookies() напрямую (проверка роли — в admin/layout.tsx),
// поэтому явно помечаем её динамической, чтобы Next не пытался рендерить статически на билде.
export const dynamic = "force-dynamic";

export default async function AdminObjectsPage() {
  const objects = await getAllObjectsOverview();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Все объекты</h1>
        <p className="text-sm text-ink-muted">Обзор по всем строителям — только просмотр</p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-ink-muted">
                <th className="pb-2 font-medium">Адрес</th>
                <th className="pb-2 font-medium">Тип</th>
                <th className="pb-2 font-medium">Строитель</th>
                <th className="pb-2 font-medium">Клиент</th>
                <th className="pb-2 font-medium">Готовность</th>
                <th className="pb-2 font-medium">Начало</th>
                <th className="pb-2 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {objects.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-semibold text-ink">{o.address}</td>
                  <td className="py-3 text-ink-light">{objectTypeLabel(o.type)}</td>
                  <td className="py-3 text-ink-light">{o.builder.name}</td>
                  <td className="py-3 text-ink-light">{o.client?.name ?? "— не привязан"}</td>
                  <td className="py-3 font-semibold text-ink">{overallReadiness(o.progress)}%</td>
                  <td className="py-3 text-ink-light">{formatDate(o.startDate)}</td>
                  <td className="py-3 text-ink-light">
                    {o.status === "DONE" ? "завершён" : "в работе"}
                  </td>
                </tr>
              ))}
              {objects.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-ink-muted">
                    Объектов пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
