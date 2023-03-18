import { number, object, string, InferType } from 'yup'

const accountSchema = object({
  id: number(),
  name: string().required('Account name is required'),
  nickname: string(),
  initialBalance: number(),
  balance: number(),
  kind: string()
})

export interface Account {
  id: number;
  name: string;
  nickname?: string;
  initialBalance?: number;
  balance: number;
  kind: 'saving' | 'spending';
}

export type AccountSchema = InferType<typeof accountSchema>

export interface ApiAccountErrors {
  name?: Array<string>;
  nickname?: Array<string>;
  kind?: Array<string>;
  initialBalance?: Array<string>;
  balance?: Array<string>;
  nonFieldErrors?: Array<string>;
  detail?: string;
}

export default accountSchema
