import { Logo } from "@/components/layout/Logo";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { STAGE_COLORS, STAGE_LABELS, STAGE_ORDER } from "@/lib/stages";

const DEMO_PERCENTS: Record<string, number> = {
  DESIGN: 100,
  ROUGH: 80,
  TECHNICAL: 55,
  WORKING: 30,
  FINISHING: 0,
};

export function AuthPromoPanel() {
  return (
    <div className="hidden flex-1 flex-col justify-between bg-sage-50 p-12 lg:flex">
      <Logo />

      <div>
        <h2 className="text-4xl font-bold leading-tight text-ink">
          Ремонт под контролем — <span className="text-brand">в любой момент</span>
        </h2>
        <ul className="mt-6 flex flex-col gap-3 text-ink-light">
          {[
            "Фото объекта и общая готовность",
            "Прогресс по 5 типам работ: от дизайн-макета до чистовых",
            "Журнал визитов строителя по датам",
            "Учёт материалов и их остатков",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-6">
        {STAGE_ORDER.map((stage) => (
          <div key={stage} className="flex flex-col items-center gap-1">
            <ProgressRing
              percent={DEMO_PERCENTS[stage]}
              color={STAGE_COLORS[stage]}
              size={64}
              strokeWidth={6}
            />
            <span className="text-center text-[11px] text-ink-muted">{STAGE_LABELS[stage]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
