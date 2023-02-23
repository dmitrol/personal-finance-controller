import { Schema } from 'mongoose'

const TransferSchema = new Schema({
  rate: { type: Number, required: true },
})

export default TransferSchema
