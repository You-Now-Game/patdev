"use client";

import { useState } from "react";
import { StageType } from "@prisma/client";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STAGE_COLORS, STAGE_LABELS, STAGE_ORDER, stageStatusLabel } from "@/lib/stages";

export function WorksView({
  progress,
  readiness,
}: {
  progress: Map<StageType, number>;
  readiness: number;
}) {
  const [view, setView] = useState<"ring" | "bar">("ring");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div className="inline-flex rounded-xl border border-border bg-cream-200 p-1">
          {(["ring", "bar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                view === v ? "bg-white text-ink shadow-sm" : "text-ink-light"
              }`}
            >
              {v === "ring" ? "Круг" : "Диаграмма"}
            </button>
          ))}
        </div>
      </div>

      {view === "ring" ? (
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="mb-6 font-semibold text-ink">Вид «Круг»</p>
          <div className="flex flex-wrap justify-center gap-8 sm:justify-between">
            {STAGE_ORDER.map((stage) => {
              const percent = progress.get(stage) ?? 0;
              return (
                <div key={stage} className="flex flex-col items-center gap-1">
                  <ProgressRing percent={percent} color={STAGE_COLORS[stage]} size={110} />
                  <span className="text-sm font-medium text-ink">{STAGE_LABELS[stage]}</span>
                  <span className="text-xs text-ink-muted">{stageStatusLabel(percent)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-semibold text-ink">Вид «Диаграмма»</p>
            <p className="text-sm text-ink-muted">общая готовность {readiness}%</p>
          </div>
          <div className="flex flex-col gap-5">
            {STAGE_ORDER.map((stage) => {
              const percent = progress.get(stage) ?? 0;
              return (
                <div key={stage} className="flex items-center gap-4">
                  <span className="w-32 shrink-0 text-sm font-medium text-ink">
                    {STAGE_LABELS[stage]}
                  </span>
                  <div className="flex-1">
                    <ProgressBar percent={percent} color={STAGE_COLORS[stage]} />
                  </div>
                  <span className="w-12 shrink-0 text-right text-sm font-semibold text-ink">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
