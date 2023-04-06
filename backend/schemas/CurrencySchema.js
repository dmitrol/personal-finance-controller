import { Schema } from 'mongoose'

const CurrencySchema = new Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, uppercase: true },
  rate: { type: Number, default: 1 },
  main: { type: Boolean, default: false },
})

export default CurrencySchema
