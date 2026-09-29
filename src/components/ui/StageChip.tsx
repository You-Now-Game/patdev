import { StageType } from "@prisma/client";
import { STAGE_COLORS, STAGE_LABELS } from "@/lib/stages";

export function StageChip({ stage, active = true }: { stage: StageType; active?: boolean }) {
  const color = STAGE_COLORS[stage];
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
      style={
        active
          ? { color, borderColor: color, backgroundColor: `${color}1a` }
          : { color: "#9aa08b", borderColor: "#e7e2d3" }
      }
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
