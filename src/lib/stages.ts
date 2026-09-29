import { StageType } from "@prisma/client";

export const STAGE_ORDER: StageType[] = [
  "DESIGN",
  "ROUGH",
  "TECHNICAL",
  "WORKING",
  "FINISHING",
];

export const STAGE_LABELS: Record<StageType, string> = {
  DESIGN: "Дизайн-макет",
  ROUGH: "Черновые",
  TECHNICAL: "Технические",
  WORKING: "Рабочие",
  FINISHING: "Чистовые",
};

export const STAGE_COLORS: Record<StageType, string> = {
  DESIGN: "#7c5fd1",
  ROUGH: "#e0913f",
  TECHNICAL: "#3f7fe0",
  WORKING: "#2ea88f",
  FINISHING: "#3fae6a",
};

// Материалы этапу "Дизайн-макет" не нужны — на макете этот этап помечен как
// "материалы не требуются", поэтому он исключён из списка этапов материалов.
export const MATERIAL_STAGE_ORDER: StageType[] = STAGE_ORDER.filter(
  (s) => s !== "DESIGN"
);

export function stageStatusLabel(percent: number): string {
  if (percent <= 0) return "не начато";
  if (percent >= 100) return "готово";
  return "в работе";
}

export function overallReadiness(progress: { stage: StageType; percent: number }[]): number {
  if (progress.length === 0) return 0;
  const byStage = new Map(progress.map((p) => [p.stage, p.percent]));
  const values = STAGE_ORDER.map((s) => byStage.get(s) ?? 0);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / STAGE_ORDER.length);
}

export function orderedProgress<T extends { stage: StageType }>(progress: T[]): T[] {
  return [...progress].sort(
    (a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage)
  );
}
