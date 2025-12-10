export interface ReferenceRow {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
}

export type ReferenceByCategoryName = Record<string, {
  items: { id: number; name: string }[];
}>;



export const groupByCategoryName = (rows: ReferenceRow[]): ReferenceByCategoryName => {
  const grouped: ReferenceByCategoryName = {};
  for (const r of rows) {
    grouped[r.categoryName] ||= { items: [] };
    grouped[r.categoryName].items.push({ id: r.id, name: r.name });
  }

  return grouped;
};
