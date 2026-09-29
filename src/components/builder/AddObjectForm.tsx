"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createObjectAction } from "@/lib/actions/objects";

export function AddObjectForm({ error }: { error?: string }) {
  const [open, setOpen] = useState(Boolean(error));

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <span className="text-base leading-none">+</span> Добавить объект
      </Button>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold text-ink">Новый объект</p>
        <button onClick={() => setOpen(false)} className="text-sm text-ink-light">
          Закрыть
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

      <form action={createObjectAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-light">Тип объекта</span>
          <select
            name="type"
            defaultValue="APARTMENT"
            className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
          >
            <option value="APARTMENT">Квартира</option>
            <option value="HOUSE">Дом</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-light">Адрес</span>
          <input
            name="address"
            required
            placeholder="ул. Ленина 12, кв. 45"
            className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-light">Площадь, м²</span>
          <input
            name="area"
            type="number"
            min={1}
            step="0.1"
            required
            className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-light">Комнат (необязательно)</span>
          <input
            name="rooms"
            type="number"
            min={1}
            className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-light">Начало работ</span>
          <input
            name="startDate"
            type="date"
            required
            className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-light">E-mail/телефон клиента (необязательно)</span>
          <input
            name="clientLogin"
            placeholder="anna@mail.ru"
            className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
          />
        </label>

        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto">
            Создать объект
          </Button>
        </div>
      </form>
    </div>
  );
}
