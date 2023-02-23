import { Schema, model } from 'mongoose'
import TransferSchema from '../schemas/TransferSchema.js'

const RecordSchema = new Schema({
  profile: { type: Schema.Types.ObjectId, ref: 'profiles', required: true },
  bill: { type: Schema.Types.ObjectId, ref: 'profiles', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'profiles', default: null },
  transfer: TransferSchema || null,
  sum: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  created_at: { type: Date, required: true },
  description: { type: String },
})

export default model('records', RecordSchema)
