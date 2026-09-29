"use client";

import { useState, useTransition } from "react";
import { StageType } from "@prisma/client";
import { MATERIAL_STAGE_ORDER, STAGE_LABELS } from "@/lib/stages";
import { Button } from "@/components/ui/Button";
import { UNIT_OPTIONS } from "@/lib/units";

type MaterialRow = { id: string; stage: StageType; name: string; unit: string; remaining: number };

type Actions = {
  save: (objectId: string, stage: StageType, formData: FormData) => Promise<void>;
  add: (objectId: string, stage: StageType, formData: FormData) => Promise<void>;
  remove: (objectId: string, materialId: string) => Promise<void>;
};

export function MaterialsManager({
  objectId,
  materials,
  actions,
  error,
}: {
  objectId: string;
  materials: MaterialRow[];
  actions: Actions;
  error?: string;
}) {
  const [stage, setStage] = useState<StageType>(MATERIAL_STAGE_ORDER[0]);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const rows = materials.filter((m) => m.stage === stage);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await actions.save(objectId, stage, formData);
      setSaved(true);
    });
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      await actions.add(objectId, stage, formData);
      form.reset();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await actions.remove(objectId, id);
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <p className="mb-1 font-semibold text-ink">Материалы</p>
      <p className="mb-4 text-sm text-ink-muted">Перечислите материалы по типам работ и укажите остаток</p>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

      <div className="mb-5 flex flex-wrap gap-2">
        {MATERIAL_STAGE_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStage(s);
              setSaved(false);
            }}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              stage === s ? "border-brand bg-sage-50 text-brand-dark" : "border-border text-ink-light"
            }`}
          >
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-ink-muted">
              <th className="pb-2 font-medium">Материал · {STAGE_LABELS[stage]}</th>
              <th className="pb-2 font-medium">Ед. изм.</th>
              <th className="pb-2 text-right font-medium">Осталось</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0">
                <td className="py-2.5 pr-3">
                  <input type="hidden" name="materialId" value={m.id} />
                  <input
                    name={`name_${m.id}`}
                    defaultValue={m.name}
                    onChange={() => setSaved(false)}
                    className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-brand"
                  />
                </td>
                <td className="py-2.5 pr-3">
                  <select
                    name={`unit_${m.id}`}
                    defaultValue={m.unit}
                    onChange={() => setSaved(false)}
                    className="rounded-lg border border-border px-2 py-2 outline-none focus:border-brand"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2.5 pr-3 text-right">
                  <input
                    type="number"
                    min={0}
                    name={`remaining_${m.id}`}
                    defaultValue={m.remaining}
                    onChange={() => setSaved(false)}
                    className="w-24 rounded-lg border border-border px-3 py-2 text-right outline-none focus:border-brand"
                  />
                </td>
                <td className="py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="text-xs font-medium text-red-500"
                  >
                    удалить
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-ink-muted">
                  Материалы для этапа «{STAGE_LABELS[stage]}» ещё не добавлены
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {rows.length > 0 && (
          <Button type="submit" disabled={isPending} className="mt-4">
            {isPending ? "Сохранение…" : saved ? "Сохранено — клиент увидит ✓" : "Сохранить — клиент увидит"}
          </Button>
        )}
      </form>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <input
          name="newName"
          required
          placeholder="Название нового материала"
          className="min-w-[220px] flex-1 rounded-lg border border-dashed border-border px-3 py-2 outline-none focus:border-brand"
        />
        <select
          name="newUnit"
          defaultValue="шт"
          className="rounded-lg border border-border px-2 py-2 outline-none focus:border-brand"
        >
          {UNIT_OPTIONS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary" disabled={isPending}>
          Добавить
        </Button>
      </form>
      <p className="mt-2 text-xs text-ink-muted">Новый материал добавляется с количеством 0</p>
    </div>
  );
}
