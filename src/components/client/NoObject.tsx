import { Card } from "@/components/ui/Card";

export function NoObject() {
  return (
    <Card className="text-center">
      <p className="text-lg font-semibold text-ink">Пока нет привязанного объекта</p>
      <p className="mt-2 text-sm text-ink-light">
        Как только строитель добавит вас к объекту, здесь появится ход ремонта.
      </p>
    </Card>
  );
}
