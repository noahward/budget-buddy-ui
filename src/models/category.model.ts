interface Category {
  id: number;
  name: string;
  detailedName: string;
  user: number | null;
}

interface SortedCategories {
  [key: string]: Category[]
}

export type { Category, SortedCategories }
