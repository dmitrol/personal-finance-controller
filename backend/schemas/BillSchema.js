import { Schema } from 'mongoose'

const BillSchema = new Schema({
  title: { type: String, required: true, unique: true },
  currency: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
  },
})

export default BillSchema
