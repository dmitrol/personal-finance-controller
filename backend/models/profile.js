import { Schema, model } from 'mongoose'

import CurrencySchema from '../schemas/CurrencySchema.js'
import CategorySchema from '../schemas/CategorySchema.js'
import BillSchema from '../schemas/BillSchema.js'

const ProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  per_page: { type: Number, default: 10 },
  currencies: [CurrencySchema],
  categories: [CategorySchema],
  bills: [BillSchema],
})

export default model('profiles', ProfileSchema)
