import { ObjectSchema, InferType } from 'yup'

export function getSubmitFn<Schema extends ObjectSchema<Record<string, unknown>>> (
  _: Schema,
  callback: (values: InferType<Schema>) => void
) {
  return (values: Record<string, unknown>) => {
    return callback(values)
  }
}
