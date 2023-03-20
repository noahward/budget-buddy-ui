interface Transaction {
  id: number;
  date: Date | string;
  description: string;
  currencyCode: string;
  amount: number;
  user: number;
  account: number;
  category: string | null;
  dateClassified: Date | string | null;
}

export type { Transaction }
