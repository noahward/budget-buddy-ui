interface Account {
  id: number;
  name: string;
  nickname?: string;
  kind: 'saving' | 'spending';
  balance: number;
  initialBalance: number;
}

interface CreateAccount {
  name: string;
  nickname?: string;
  initialBalance?: number;
  kind?: 'saving' | 'spending';
}

interface UpdateAccount {
  id: number;
  name?: string;
  nickname?: string;
  kind?: 'saving' | 'spending';
}

interface ApiAccountErrors {
  name?: Array<string>;
  nickname?: Array<string>;
  kind?: Array<string>;
  initialBalance?: Array<string>;
  balance?: Array<string>;
  nonFieldErrors?: Array<string>;
  detail?: string;
}

export type { Account, UpdateAccount, CreateAccount, ApiAccountErrors }
