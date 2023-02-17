import { Schema, model } from 'mongoose'

import CurrencySchema from '../schemas/CurrencySchema.js'
import CategorySchema from '../schemas/CategorySchema.js'

const ProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  currencies: [CurrencySchema],
  categories: [CategorySchema],
})

export default model('profiles', ProfileSchema)
