import { number, object, string, InferType } from 'yup'

const accountSchema = object({
  id: number(),
  name: string().required('Account name is required'),
  nickname: string(),
  amount: number(),
  kind: string()
})

export type Account = InferType<typeof accountSchema>

export interface ApiAccountErrors {
  name?: Array<string>;
  nickname?: Array<string>;
  kind?: Array<string>;
  amount?: Array<string>;
  nonFieldErrors?: Array<string>;
  detail?: string;
}

export default accountSchema
