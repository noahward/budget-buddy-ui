interface Transaction {
  id: number;
  date: string;
  description: string;
  currencyCode: string;
  amount: number;
  dateClassified: string | null;
  user: number;
  account: number;
  categoryName: string | null;
  categoryDetailedName: string | null;
}

export type { Transaction }
