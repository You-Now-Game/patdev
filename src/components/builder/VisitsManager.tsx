"use client";

import { useState, useTransition } from "react";
import { StageType } from "@prisma/client";
import { STAGE_COLORS, STAGE_LABELS, STAGE_ORDER } from "@/lib/stages";
import { formatDate, formatDateInput } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StageChip } from "@/components/ui/StageChip";

type VisitRow = {
  id: string;
  date: Date;
  timeFrom: string;
  timeTo: string;
  stage: StageType;
  description: string;
  progressAfter: number;
};

type Actions = {
  save: (objectId: string, formData: FormData) => Promise<void>;
  remove: (objectId: string, visitId: string) => Promise<void>;
};

const emptyDraft = (currentPercent: Record<StageType, number>) => ({
  visitId: "",
  date: formatDateInput(new Date()),
  timeFrom: "09:00",
  timeTo: "17:00",
  stage: "DESIGN" as StageType,
  description: "",
  progressAfter: currentPercent.DESIGN ?? 0,
});

export function VisitsManager({
  objectId,
  visits,
  currentPercent,
  actions,
}: {
  objectId: string;
  visits: VisitRow[];
  currentPercent: Record<StageType, number>;
  actions: Actions;
}) {
  const [draft, setDraft] = useState(emptyDraft(currentPercent));
  const [isPending, startTransition] = useTransition();

  function startEdit(v: VisitRow) {
    setDraft({
      visitId: v.id,
      date: formatDateInput(v.date),
      timeFrom: v.timeFrom,
      timeTo: v.timeTo,
      stage: v.stage,
      description: v.description,
      progressAfter: v.progressAfter,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await actions.save(objectId, formData);
      setDraft(emptyDraft(currentPercent));
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await actions.remove(objectId, id);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6">
        <p className="mb-1 font-semibold text-ink">{draft.visitId ? "Изменить запись" : "Новая запись"}</p>
        <p className="mb-5 text-sm text-ink-muted">Внесите дату визита и что было сделано</p>

        <input type="hidden" name="visitId" value={draft.visitId} />

        <div className="mb-4 grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ink-light">Дата визита</span>
            <input
              type="date"
              name="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="rounded-xl border border-border px-3 py-2.5 outline-none focus:border-brand"
            />
          </label>
          <div className="flex flex-col gap-1.5 text-sm">
            <span className="text-ink-light">Время</span>
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                name="timeFrom"
                value={draft.timeFrom}
                onChange={(e) => setDraft({ ...draft, timeFrom: e.target.value })}
                className="w-full rounded-xl border border-border px-2 py-2.5 outline-none focus:border-brand"
              />
              <span className="text-ink-muted">–</span>
              <input
                type="time"
                name="timeTo"
                value={draft.timeTo}
                onChange={(e) => setDraft({ ...draft, timeTo: e.target.value })}
                className="w-full rounded-xl border border-border px-2 py-2.5 outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>

        <p className="mb-1.5 text-sm text-ink-light">Тип работ</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {STAGE_ORDER.map((stage) => (
            <button
              type="button"
              key={stage}
              onClick={() =>
                setDraft({ ...draft, stage, progressAfter: currentPercent[stage] ?? 0 })
              }
            >
              <StageChip stage={stage} active={draft.stage === stage} />
            </button>
          ))}
        </div>
        <input type="hidden" name="stage" value={draft.stage} />

        <label className="mb-4 flex flex-col gap-1.5 text-sm">
          <span className="text-ink-light">Что сделано</span>
          <textarea
            name="description"
            required
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Например: разводка электрики на кухне"
            className="resize-none rounded-xl border border-border px-3 py-2.5 outline-none focus:border-brand"
          />
        </label>

        <label className="mb-2 flex flex-col gap-2 text-sm">
          <span className="text-ink-light">
            Прогресс этапа «{STAGE_LABELS[draft.stage]}» после визита
          </span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              name="progressAfter"
              value={draft.progressAfter}
              style={{ ["--thumb-color" as string]: STAGE_COLORS[draft.stage] }}
              onChange={(e) => setDraft({ ...draft, progressAfter: Number(e.target.value) })}
              className="flex-1"
            />
            <span className="w-12 text-right font-semibold text-ink">{draft.progressAfter}%</span>
          </div>
        </label>

        <div className="mt-4 flex gap-2">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? "Сохранение…" : draft.visitId ? "Сохранить изменения" : "Добавить запись"}
          </Button>
          {draft.visitId && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDraft(emptyDraft(currentPercent))}
            >
              Отмена
            </Button>
          )}
        </div>
      </form>

      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold text-ink">История визитов</p>
          <span className="text-sm text-ink-muted">{visits.length} записей</span>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: 560 }}>
          {visits.map((v) => (
            <div key={v.id} className="rounded-xl border border-border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{formatDate(v.date)}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold" style={{ color: STAGE_COLORS[v.stage] }}>
                    {v.progressAfter}%
                  </span>
                  <button onClick={() => startEdit(v)} className="font-medium text-brand">
                    изм.
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="font-medium text-red-500">
                    удалить
                  </button>
                </div>
              </div>
              <StageChip stage={v.stage} />
              <p className="mt-1.5 text-sm text-ink-light">{v.description}</p>
            </div>
          ))}
          {visits.length === 0 && (
            <p className="py-6 text-center text-sm text-ink-muted">Записей пока нет</p>
          )}
        </div>
      </div>
    </div>
  );
}
