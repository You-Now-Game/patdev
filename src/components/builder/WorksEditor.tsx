"use client";

import { useState, useTransition } from "react";
import { StageType } from "@prisma/client";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { STAGE_COLORS, STAGE_LABELS, STAGE_ORDER, stageStatusLabel } from "@/lib/stages";
import { clamp } from "@/lib/utils";

export function WorksEditor({
  objectId,
  initialProgress,
  action,
}: {
  objectId: string;
  initialProgress: Record<StageType, number>;
  action: (objectId: string, formData: FormData) => Promise<void>;
}) {
  const [values, setValues] = useState(initialProgress);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const readiness = Math.round(
    STAGE_ORDER.reduce((sum, s) => sum + values[s], 0) / STAGE_ORDER.length
  );

  function setStage(stage: StageType, value: number) {
    setSaved(false);
    setValues((prev) => ({ ...prev, [stage]: clamp(value, 0, 100) }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(objectId, formData);
      setSaved(true);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6">
        <p className="mb-1 font-semibold text-ink">Заполнение типов работ</p>
        <p className="mb-6 text-sm text-ink-muted">Укажите прогресс от 0% до 100% по каждому этапу</p>

        <div className="flex flex-col gap-6">
          {STAGE_ORDER.map((stage) => (
            <div key={stage} className="flex items-center gap-4">
              <ProgressRing percent={values[stage]} color={STAGE_COLORS[stage]} size={52} strokeWidth={5} />
              <span className="w-32 shrink-0 font-medium text-ink">{STAGE_LABELS[stage]}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={values[stage]}
                style={{ ["--thumb-color" as string]: STAGE_COLORS[stage] }}
                onChange={(e) => setStage(stage, Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStage(stage, values[stage] - 5)}
                  className="h-7 w-7 rounded-lg border border-border text-ink-light"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={values[stage]}
                  onChange={(e) => setStage(stage, Number(e.target.value))}
                  name={`percent_${stage}`}
                  className="w-14 rounded-lg border border-border py-1 text-center text-sm"
                />
                <button
                  type="button"
                  onClick={() => setStage(stage, values[stage] + 5)}
                  className="h-7 w-7 rounded-lg border border-border text-ink-light"
                >
                  +
                </button>
              </div>
              <span className="w-20 shrink-0 text-right text-xs text-ink-muted">
                {stageStatusLabel(values[stage])}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-ink-muted">Шаг 5% · можно тянуть ползунок или вводить число</p>
        <Button type="submit" disabled={isPending} className="mt-4 w-full sm:w-auto">
          {isPending ? "Сохранение…" : saved ? "Сохранено ✓" : "Сохранить изменения"}
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-white p-6">
        <p className="mb-4 font-semibold text-ink">Так увидит клиент</p>
        <div className="flex justify-center">
          <ProgressRing percent={readiness} color="#4f8a2e" size={130} strokeWidth={11} />
        </div>
        <p className="mb-4 mt-1 text-center text-xs text-ink-muted">общая готовность</p>

        <div className="flex flex-col gap-3">
          {STAGE_ORDER.map((stage) => (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs font-medium text-ink">{STAGE_LABELS[stage]}</span>
              <div className="flex-1">
                <ProgressBar percent={values[stage]} color={STAGE_COLORS[stage]} />
              </div>
              <span className="w-9 shrink-0 text-right text-xs font-semibold text-ink">
                {values[stage]}%
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 rounded-xl bg-cream-200 px-4 py-3 text-xs text-ink-muted">
          После сохранения прогресс сразу обновится у клиента
        </p>
      </div>
    </div>
  );
}
