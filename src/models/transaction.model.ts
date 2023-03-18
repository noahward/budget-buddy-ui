interface Transaction {
  id: number;
  date: string;
  description: string;
  currencyCode: string;
  amount: number;
  user: number;
  account: number;
  category: number;
}

export type { Transaction }
