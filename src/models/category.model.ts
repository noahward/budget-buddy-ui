interface Category {
  id: number;
  name: string;
  detailedName: string;
  user: number | null;
}

interface CreateCategory {
  name: string;
  detailedName?: string;
}

interface ApiCategoryErrors {
  name?: Array<string>;
  detailedName?: Array<string>;
}

export type { Category, CreateCategory, ApiCategoryErrors }
