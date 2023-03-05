export interface Account {
  id: number;
  name: string;
  nickname?: string;
  kind: 'spending' | 'saving';
}
