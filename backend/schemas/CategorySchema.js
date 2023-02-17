import { Schema } from 'mongoose'

const CategorySchema = new Schema({
  title: { type: String, unique: true, required: true },
  income: { type: Boolean, required: true },
  expense: { type: Boolean, required: true },
})

export default CategorySchema
