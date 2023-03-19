interface Transaction {
  id: number;
  date: string;
  description: string;
  currencyCode: string;
  amount: number;
  user: number;
  account: number;
  category: string | null;
}

export type { Transaction }
