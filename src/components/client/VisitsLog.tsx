"use client";

import { useState } from "react";
import { StageType } from "@prisma/client";
import { StageChip } from "@/components/ui/StageChip";
import { STAGE_LABELS, STAGE_ORDER } from "@/lib/stages";
import { formatDate } from "@/lib/utils";

type VisitRow = {
  id: string;
  date: Date;
  timeFrom: string;
  timeTo: string;
  stage: StageType;
  description: string;
  progressAfter: number;
};

export function VisitsLog({ visits }: { visits: VisitRow[] }) {
  const [filter, setFilter] = useState<StageType | "ALL">("ALL");
  const filtered = filter === "ALL" ? visits : visits.filter((v) => v.stage === filter);

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-ink">Что делал строитель</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filter === "ALL"
                ? "border-brand bg-brand text-white"
                : "border-border text-ink-light"
            }`}
          >
            Все
          </button>
          {STAGE_ORDER.map((stage) => (
            <button key={stage} onClick={() => setFilter(stage)} className="cursor-pointer">
              <StageChip stage={stage} active={filter === stage} />
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-ink-muted">
              <th className="pb-2 font-medium">Дата</th>
              <th className="pb-2 font-medium">Время</th>
              <th className="pb-2 font-medium">Тип работ</th>
              <th className="pb-2 font-medium">Что сделано</th>
              <th className="pb-2 pr-2 text-right font-medium">Прогресс этапа</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="py-3 font-semibold text-ink">{formatDate(v.date)}</td>
                <td className="py-3 text-ink-light">
                  {v.timeFrom}–{v.timeTo}
                </td>
                <td className="py-3">
                  <StageChip stage={v.stage} />
                </td>
                <td className="py-3 text-ink">{v.description}</td>
                <td className="py-3 pr-2 text-right font-semibold text-ink">{v.progressAfter}%</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-ink-muted">
                  Записей по этапу «{STAGE_LABELS[filter as StageType]}» пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
