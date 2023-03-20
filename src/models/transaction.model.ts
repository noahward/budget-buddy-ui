interface Transaction {
  id: number;
  date: string | Date;
  description: string;
  currencyCode: string;
  amount: number;
  user: number;
  account: number;
  category: string | null;
  dateClassified: string | null | Date;
}

export type { Transaction }
