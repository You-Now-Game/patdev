import Link from "next/link";
import { auth } from "@/lib/auth";
import { getBuilderObjectsList } from "@/lib/queries";
import { ObjectCard } from "@/components/builder/ObjectCard";
import { AddObjectForm } from "@/components/builder/AddObjectForm";

export default async function BuilderObjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; error?: string }>;
}) {
  const session = await auth();
  const objects = await getBuilderObjectsList(session!.user.id);

  const sp = await searchParams;
  const filter = sp.type;
  const filtered = filter ? objects.filter((o) => o.type === filter) : objects;
  const apartments = objects.filter((o) => o.type === "APARTMENT").length;
  const houses = objects.filter((o) => o.type === "HOUSE").length;

  const tabs = [
    { key: undefined, label: `Все (${objects.length})` },
    { key: "APARTMENT", label: `Квартиры (${apartments})` },
    { key: "HOUSE", label: `Дома (${houses})` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Мои объекты</h1>
          <p className="text-sm text-ink-muted">Все объекты, которые были и есть в работе</p>
        </div>
        <AddObjectForm error={sp.error} />
      </div>

      <div className="inline-flex w-fit rounded-xl border border-border bg-cream-200 p-1">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.key ? `/builder/objects?type=${tab.key}` : "/builder/objects"}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.key ? "bg-white text-ink shadow-sm" : "text-ink-light"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-ink-muted">
          Пока нет объектов. Нажмите «Добавить объект», чтобы создать первый.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((object) => (
            <ObjectCard key={object.id} object={object} />
          ))}
        </div>
      )}
    </div>
  );
}
