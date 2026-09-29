import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBuilderObjectDetail, getBuilderObjectsList } from "@/lib/queries";
import { ObjectSwitcher } from "@/components/builder/ObjectSwitcher";
import { MaterialsManager } from "@/components/builder/MaterialsManager";
import { saveMaterialsAction, addMaterialAction, deleteMaterialAction } from "@/lib/actions/materials";
import { objectTypeLabel } from "@/lib/utils";

export default async function BuilderMaterialsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const session = await auth();
  const [object, objects] = await Promise.all([
    getBuilderObjectDetail(session!.user.id, id),
    getBuilderObjectsList(session!.user.id),
  ]);
  if (!object) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Материалы</h1>
          <p className="text-sm text-ink-muted">
            {objectTypeLabel(object.type)} · {object.address}
          </p>
        </div>
        <ObjectSwitcher objects={objects} currentId={object.id} />
      </div>

      <MaterialsManager
        objectId={object.id}
        materials={object.materials}
        error={sp.error}
        actions={{ save: saveMaterialsAction, add: addMaterialAction, remove: deleteMaterialAction }}
      />
    </div>
  );
}
